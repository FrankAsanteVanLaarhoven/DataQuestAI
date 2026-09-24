// @ts-ignore
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { Pool } from 'pg';
import { hashPassword, generateSalt } from './auth.ts';

let dbInstance: any = null;
let pgPoolInstance: Pool | null = null;

export interface PlatformStorageInfo {
  engine: 'postgres' | 'sqlite';
  isEphemeral: boolean;
  storageTarget: string;
  status: 'active' | 'degraded';
  postgresConfigured: boolean;
}

export function getPlatformStorageInfo(): PlatformStorageInfo {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  const isVercel = Boolean(process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME);

  return {
    engine: databaseUrl ? 'postgres' : 'sqlite',
    isEphemeral: !databaseUrl && isVercel,
    storageTarget: databaseUrl
      ? 'PostgreSQL Cluster (Authoritative Persistent Storage)'
      : isVercel
      ? '/tmp/dataquest_platform.sqlite (Ephemeral Serverless Container Fallback)'
      : 'Local SQLite File with WAL Mode (dataquest_platform.sqlite)',
    status: 'active',
    postgresConfigured: Boolean(databaseUrl),
  };
}

export function getPostgresPool(): Pool | null {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) return null;

  if (!pgPoolInstance) {
    try {
      pgPoolInstance = new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' && !databaseUrl.includes('localhost')
          ? { rejectUnauthorized: false }
          : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      // Initialize PostgreSQL schema in background
      initPostgresSchema(pgPoolInstance).catch((err) => {
        console.error('PostgreSQL schema initialization warning:', err.message);
      });
    } catch (err: any) {
      console.error('Failed to initialize PostgreSQL pool:', err.message);
      pgPoolInstance = null;
    }
  }

  return pgPoolInstance;
}

async function initPostgresSchema(pool: Pool) {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(32) DEFAULT 'student',
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 100,
        streak INTEGER DEFAULT 1,
        avatar VARCHAR(64) DEFAULT '👩‍💻',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(32) NOT NULL,
        expires_at BIGINT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS missions (
        id VARCHAR(64) PRIMARY KEY,
        number INTEGER,
        title VARCHAR(255) NOT NULL,
        domain VARCHAR(128) NOT NULL,
        level VARCHAR(32) DEFAULT 'Beginner',
        xp_reward INTEGER DEFAULT 150,
        objective TEXT,
        rubric_json TEXT,
        allowed_components_json TEXT,
        author_id VARCHAR(64),
        is_custom INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        mission_id VARCHAR(64) NOT NULL,
        status VARCHAR(64) NOT NULL,
        score INTEGER DEFAULT 0,
        error_type VARCHAR(128),
        hint_count INTEGER DEFAULT 0,
        duration_seconds INTEGER DEFAULT 0,
        nodes_json TEXT,
        edges_json TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS telemetry_events (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        session_id VARCHAR(128),
        event_type VARCHAR(64) NOT NULL,
        query_text TEXT,
        table_name VARCHAR(128),
        duration_ms REAL DEFAULT 0,
        rows_scanned INTEGER DEFAULT 0,
        rows_returned INTEGER DEFAULT 0,
        index_used VARCHAR(128),
        error_type VARCHAR(128),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS designs (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        title VARCHAR(255) NOT NULL,
        domain VARCHAR(128) NOT NULL,
        description TEXT,
        reasoning TEXT,
        nodes_json TEXT,
        edges_json TEXT,
        tags_json TEXT,
        upvotes INTEGER DEFAULT 1,
        forks INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        action VARCHAR(128) NOT NULL,
        ip_address VARCHAR(64),
        details TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
}

export function getPlatformDb(): any {
  if (!dbInstance) {
    const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const dbPath =
      process.env.DATAQUEST_DB_PATH ||
      (isVercel
        ? path.join('/tmp', 'dataquest_platform.sqlite')
        : path.join(process.cwd(), 'dataquest_platform.sqlite'));

    try {
      dbInstance = new DatabaseSync(dbPath);
      // Enable WAL mode for high concurrency
      dbInstance.exec('PRAGMA journal_mode = WAL;');
      dbInstance.exec('PRAGMA foreign_keys = ON;');
    } catch {
      dbInstance = new DatabaseSync(':memory:');
    }

    // Initialize Schema
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
        is_blocked INTEGER DEFAULT 0,
        blocked_reason TEXT DEFAULT NULL,
        interests_json TEXT DEFAULT '[]',
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

      CREATE TABLE IF NOT EXISTS active_heartbeats (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        user_id TEXT NOT NULL,
        user_name TEXT,
        user_role TEXT,
        path TEXT,
        last_seen_ms INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS platform_ratings (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        user_name TEXT,
        user_avatar TEXT,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS platform_likes (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        source TEXT DEFAULT 'web',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS platform_referrals (
        id TEXT PRIMARY KEY,
        referrer_id TEXT NOT NULL,
        invite_code TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

    // Idempotent column migrations for existing SQLite database
    try {
      dbInstance.exec('ALTER TABLE users ADD COLUMN is_blocked INTEGER DEFAULT 0;');
    } catch {}
    try {
      dbInstance.exec('ALTER TABLE users ADD COLUMN blocked_reason TEXT DEFAULT NULL;');
    } catch {}
    try {
      dbInstance.exec("ALTER TABLE users ADD COLUMN interests_json TEXT DEFAULT '[]';");
    } catch {}

    // Seed verified accounts if database is empty or ensure Super Admin exists
    ensureDefaultPlatformUsers(dbInstance);
  }

  return dbInstance;
}

// Initial default verified platform users (Founder/Super Admin, Student, Teacher, Architect)
function ensureDefaultPlatformUsers(db: any) {
  try {
    // Precomputed PBKDF2 (100k iters, SHA-256) for 'DataQuest2026!'
    const salt = 'd9e03f1b4c7a6e2d1f8a9b0c3d4e5f6a';
    const defaultHash = '9fe9c84479cbb10ca56a71ba56890ea2474c9bdb5c92c812d0fc7236b3872371';

    // 0. Ensure Frank Asante-Van Laarhoven (Founder & Super Admin) exists
    const superAdminRow = db.prepare('SELECT id, email, role FROM users WHERE email = ? OR role = ?').get('frank@dataquest.ai', 'super_admin');
    if (!superAdminRow) {
      db.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar, is_blocked, interests_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
      `).run(
        'usr_frank_superadmin',
        'frank@dataquest.ai',
        defaultHash,
        salt,
        'Frank Asante-Van Laarhoven',
        'super_admin',
        99,
        99999,
        365,
        '👑',
        JSON.stringify([
          'Relational Database Internals',
          'Query Optimization & B-Trees',
          'Distributed Cloud Scalability',
          'Information Retrieval Engines',
          'AI Vector Databases & RAG',
        ])
      );

      // Also create an audit log
      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run('aud_seed_superadmin', 'usr_frank_superadmin', 'SUPER_ADMIN_INIT', 'Founder & Super Admin account initialized');
    }

    const countRow: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (countRow && countRow.count <= 1) {
      // 1. Alex Mercer (Student)
      db.prepare(`
        INSERT OR IGNORE INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar, interests_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_alex_student',
        'alex@dataquest.org',
        defaultHash,
        salt,
        'Alex Mercer',
        'student',
        5,
        2350,
        12,
        '👩‍💻',
        JSON.stringify(['SQL Query Mastery & Complex Joins', 'Database Normalization', 'CSC1033 Exam Prep'])
      );

      // 2. Prof. Marcus Vance (Instructor / Teacher)
      db.prepare(`
        INSERT OR IGNORE INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar, interests_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_marcus_teacher',
        'instructor@dataquest.org',
        defaultHash,
        salt,
        'Prof. Marcus Vance',
        'teacher',
        10,
        5400,
        45,
        '👨‍🏫',
        JSON.stringify(['Curriculum Authoring', 'Relational Algebra', 'ACID Transactions'])
      );

      // 3. Elena Rostova (Enterprise Data Architect)
      db.prepare(`
        INSERT OR IGNORE INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar, interests_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_elena_architect',
        'architect@dataquest.org',
        defaultHash,
        salt,
        'Elena Rostova',
        'architect',
        8,
        4200,
        30,
        '🏛️',
        JSON.stringify(['Cloud Distributed Scalability', 'B-Tree Indexes', 'Vector Databases'])
      );
    }

    // Seed initial platform ratings and likes if none exist
    const ratingsCount: any = db.prepare('SELECT COUNT(*) as count FROM platform_ratings').get();
    if (ratingsCount && ratingsCount.count === 0) {
      db.prepare(`
        INSERT INTO platform_ratings (id, user_id, user_name, user_avatar, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('rat_1', 'usr_alex_student', 'Alex Mercer', '👩‍💻', 5, 'The 12-week CSC1033 capstones and live EXPLAIN join visualizers are phenomenal. Acing my database exams!');
      db.prepare(`
        INSERT INTO platform_ratings (id, user_id, user_name, user_avatar, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('rat_2', 'usr_elena_architect', 'Elena Rostova', '🏛️', 5, 'Exceptional enterprise architecture. The B-Tree seek vs table scan lab and transaction WAL simulator are world class.');
      db.prepare(`
        INSERT INTO platform_ratings (id, user_id, user_name, user_avatar, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run('rat_3', 'usr_marcus_teacher', 'Prof. Marcus Vance', '👨‍🏫', 5, 'Teaching relational database theory and Codd 1970 algebra has never been this engaging. My students love it.');
    }
  } catch (err: any) {
    console.warn('Initial platform user seeding skipped:', err.message);
  }
}
