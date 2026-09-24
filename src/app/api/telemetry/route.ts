import { NextResponse } from 'next/server';
import { getPlatformDb } from '@/lib/platform-db';
import { extractBearerToken, validateSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const db = getPlatformDb();
    const token = extractBearerToken(request);
    let sessionUserId = 'usr_anonymous';

    if (token) {
      const auth = validateSessionToken(token, db);
      if (auth.valid && auth.user) {
        sessionUserId = auth.user.id;
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
    } = body;

    const eventId = id || 'tel_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);

    db.prepare(`
      INSERT INTO telemetry_events (id, user_id, event_type, query_text, table_name, duration_ms, rows_scanned, rows_returned, index_used, error_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      eventId,
      userId || sessionUserId,
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
    return NextResponse.json({ error: err.message }, { status: 500 });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
