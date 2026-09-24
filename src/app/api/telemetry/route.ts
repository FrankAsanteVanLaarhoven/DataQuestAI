import { NextResponse } from 'next/server';
import { getPlatformDb } from '@/lib/platform-db';

export async function POST(request: Request) {
  try {
    const db = getPlatformDb();
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
      userId || 'usr_anonymous',
      eventType || 'QUERY',
      queryText || '',
      tableName || '',
      durationMs || 0,
      rowsScanned || 0,
      rowsReturned || 0,
      indexUsed || null,
      errorType || null
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getPlatformDb();
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
