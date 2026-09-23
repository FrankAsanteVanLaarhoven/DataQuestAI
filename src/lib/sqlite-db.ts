// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'path';

let dbInstance: any = null;

export function getSqliteDb(): any {
  if (!dbInstance) {
    const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const dbPath = isVercel ? path.join('/tmp', 'dataquest.sqlite') : path.join(process.cwd(), 'dataquest.sqlite');
    try {
      dbInstance = new DatabaseSync(dbPath);
    } catch {
      dbInstance = new DatabaseSync(':memory:');
    }

    // Initialize Schema
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        password_hash TEXT,
        name TEXT,
        role TEXT DEFAULT 'student',
        level INTEGER DEFAULT 5,
        xp INTEGER DEFAULT 2350,
        streak INTEGER DEFAULT 12,
        avatar TEXT DEFAULT '👩‍💻',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS designs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        domain TEXT,
        description TEXT,
        reasoning TEXT,
        nodes_json TEXT,
        edges_json TEXT,
        tags_json TEXT,
        upvotes INTEGER DEFAULT 1,
        forks INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        message TEXT,
        xp_award INTEGER,
        type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS crud_events (
        id TEXT PRIMARY KEY,
        event_type TEXT,
        table_name TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default demo user if empty
    const countRow: any = dbInstance.prepare('SELECT COUNT(*) as count FROM users').get();
    if (countRow && countRow.count === 0) {
      dbInstance.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, level, xp, streak, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_alex_demo',
        'alex@dataquest.org',
        'demo_hash',
        'Alex Mercer',
        'student',
        5,
        2350,
        12,
        '👩‍💻'
      );
    }
  }

  return dbInstance;
}
