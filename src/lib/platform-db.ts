// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { hashPassword, generateSalt } from './auth';

let dbInstance: any = null;

export function getPlatformDb(): any {
  if (!dbInstance) {
    const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    // In Vercel or ephemeral container, use persistent data folder if mounted or local file
    const dbPath = process.env.DATAQUEST_DB_PATH ||
      (isVercel ? path.join('/tmp', 'dataquest_platform.sqlite') : path.join(process.cwd(), 'dataquest_platform.sqlite'));

    try {
      dbInstance = new DatabaseSync(dbPath);
      // Enable WAL mode for high concurrency
      dbInstance.exec('PRAGMA journal_mode = WAL;');
      dbInstance.exec('PRAGMA foreign_keys = ON;');
    } catch {
      dbInstance = new DatabaseSync(':memory:');
    }

    // Initialize Production Schema
    dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 100,
        streak INTEGER DEFAULT 1,
        avatar TEXT DEFAULT '👩‍💻',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        role TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS missions (
        id TEXT PRIMARY KEY,
        number INTEGER,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        level TEXT DEFAULT 'Beginner',
        xp_reward INTEGER DEFAULT 150,
        objective TEXT,
        rubric_json TEXT,
        allowed_components_json TEXT,
        author_id TEXT,
        is_custom INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        mission_id TEXT NOT NULL,
        status TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        error_type TEXT,
        hint_count INTEGER DEFAULT 0,
        duration_seconds INTEGER DEFAULT 0,
        nodes_json TEXT,
        edges_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS telemetry_events (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        session_id TEXT,
        event_type TEXT NOT NULL,
        query_text TEXT,
        table_name TEXT,
        duration_ms REAL DEFAULT 0,
        rows_scanned INTEGER DEFAULT 0,
        rows_returned INTEGER DEFAULT 0,
        index_used TEXT,
        error_type TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS designs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        description TEXT,
        reasoning TEXT,
        nodes_json TEXT,
        edges_json TEXT,
        tags_json TEXT,
        upvotes INTEGER DEFAULT 1,
        forks INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        action TEXT NOT NULL,
        ip_address TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default demo student and teacher accounts with secure PBKDF2 hash
    seedDefaultUsers(dbInstance);
  }

  return dbInstance;
}

async function seedDefaultUsers(db: any) {
  try {
    const countRow: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (countRow && countRow.count === 0) {
      // 1. Student Demo Account
      const saltStudent = generateSalt(16);
      const hashStudent = await hashPassword('password123', saltStudent);
      db.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_alex_demo',
        'alex@dataquest.org',
        hashStudent,
        saltStudent,
        'Alex Mercer',
        'student',
        5,
        2350,
        12,
        '👩‍💻'
      );

      // 2. Teacher Account
      const saltTeacher = generateSalt(16);
      const hashTeacher = await hashPassword('teach123!', saltTeacher);
      db.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_prof_frank',
        'frank@newcastle.ac.uk',
        hashTeacher,
        saltTeacher,
        'Prof. Frank Van Laarhoven',
        'teacher',
        10,
        5000,
        25,
        '🎓'
      );
    }
  } catch (err) {
    console.error('Failed to seed default users:', err);
  }
}
