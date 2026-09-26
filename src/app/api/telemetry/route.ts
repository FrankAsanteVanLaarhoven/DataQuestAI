import { NextResponse } from 'next/server';
import { getPlatformDb } from '@/lib/platform-db';
import { extractBearerToken, validateSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const db = getPlatformDb();
    const token = extractBearerToken(request);
    let sessionUserId = 'usr_anonymous';
    let sessionUser: any = null;

    if (token) {
      const auth = validateSessionToken(token, db);
      if (auth.valid && auth.user) {
        sessionUserId = auth.user.id;
        sessionUser = auth.user;
      }
    }

    const body = await request.json();
    const {
      id,
      eventType,
      queryText,
      tableName,
      durationMs,
      rowsScanned,
      rowsReturned,
      indexUsed,
      errorType,
      userId,
      path = '/',
      userName,
      userRole,
    } = body;

    const actualUserId = userId || sessionUserId;

    // Handle Active Heartbeat for Real-Time Concurrent Online Students
    if (eventType === 'HEARTBEAT') {
      const heartbeatId = 'hb_' + actualUserId;
      const now = Date.now();
      try {
        db.prepare(`
          INSERT INTO active_heartbeats (id, session_id, user_id, user_name, user_role, path, last_seen_ms)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            last_seen_ms = excluded.last_seen_ms,
            path = excluded.path,
            user_name = COALESCE(excluded.user_name, active_heartbeats.user_name),
            user_role = COALESCE(excluded.user_role, active_heartbeats.user_role)
        `).run(
          heartbeatId,
          token || 'sess_anon',
          actualUserId,
          userName || (sessionUser?.name) || 'Anonymous Explorer',
          userRole || (sessionUser?.role) || 'student',
          path,
          now
        );

        // Prune stale heartbeats older than 5 minutes
        db.prepare('DELETE FROM active_heartbeats WHERE last_seen_ms < ?').run(now - 300_000);

        // Count online students in last 2 minutes
        const onlineRow: any = db.prepare('SELECT COUNT(DISTINCT user_id) as count FROM active_heartbeats WHERE last_seen_ms > ?').get(now - 120_000);
        const onlineCount = onlineRow ? Math.max(1, onlineRow.count) : 1;

        return NextResponse.json({ success: true, onlineStudents: onlineCount, timestamp: now });
      } catch (err: any) {
        return NextResponse.json({ success: true, onlineStudents: 1 });
      }
    }

    const eventId = id || 'tel_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO telemetry_events (id, user_id, event_type, query_text, table_name, duration_ms, rows_scanned, rows_returned, index_used, error_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      actualUserId,
      eventType || 'QUERY',
      queryText || '',
      tableName || '',
      durationMs || 0,
      rowsScanned || 0,
      rowsReturned || 0,
      indexUsed || null,
      errorType || null
    );

    return NextResponse.json({ success: true, eventId });
  } catch (err: any) {
    console.error('Telemetry ingestion error:', err.message);
    return NextResponse.json({ error: 'Failed to record telemetry.' }, { status: 500 });
  }
}

// Privileged Telemetry Stream: Requires Teacher or Admin session
export async function GET(request: Request) {
  try {
    const db = getPlatformDb();
    const token = extractBearerToken(request);
    const authCheck = validateSessionToken(token, db, 'teacher');

    if (!authCheck.valid) {
      return NextResponse.json(
        { error: authCheck.error || 'Educator session required to inspect global class telemetry.' },
        { status: authCheck.statusCode || 401 }
      );
    }

    const recent = db.prepare(`
      SELECT * FROM telemetry_events
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    return NextResponse.json({ success: true, events: recent });
  } catch (err: any) {
    console.error('Telemetry query error:', err.message);
    return NextResponse.json({ error: 'Failed to retrieve telemetry stream.' }, { status: 500 });
  }
}
