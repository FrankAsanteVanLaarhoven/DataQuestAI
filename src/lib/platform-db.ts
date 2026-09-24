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

    // Seed ONLY if explicitly enabled for local sandbox demonstrator (never in default production)
    if (process.env.DATAQUEST_ENABLE_DEMO_SEED === 'true') {
      seedSandboxDemoUsers(dbInstance);
    }
  }

  return dbInstance;
}

// Sandbox Seeding: only active when explicitly opted-in via DATAQUEST_ENABLE_DEMO_SEED=true
async function seedSandboxDemoUsers(db: any) {
  try {
    const countRow: any = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (countRow && countRow.count === 0) {
      const salt = generateSalt(16);
      const hash = await hashPassword('sandbox-demo-pass', salt);
      db.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        'usr_sandbox_student',
        'sandbox-student@dataquest.internal',
        hash,
        salt,
        'Sandbox Student',
        'student',
        1,
        150,
        1,
        '👩‍💻'
      );
    }
  } catch (err: any) {
    console.warn('Sandbox demo seed skipped:', err.message);
  }
}
