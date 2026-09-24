import { NextResponse } from 'next/server';
import { getPlatformDb } from '@/lib/platform-db';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  createSessionToken,
  validatePasswordStrength,
  UserRole,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const db = getPlatformDb();
    const body = await request.json();
    const { action, email, password, name, role, avatar } = body;

    // 1. SIGNUP
    if (action === 'signup') {
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }

      const passCheck = validatePasswordStrength(password);
      if (!passCheck.valid) {
        return NextResponse.json({ error: passCheck.reason }, { status: 400 });
      }

      const existing: any = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email.toLowerCase().trim());
      if (existing) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.' },
          { status: 409 }
        );
      }

      const id = 'usr_' + Math.random().toString(36).substring(2, 10);
      const salt = generateSalt(16);
      const hashedPassword = await hashPassword(password, salt);
      const userRole: UserRole = role === 'teacher' ? 'teacher' : role === 'architect' ? 'architect' : 'student';
      const userAvatar = avatar || '👩‍💻';
      const userName = (name && name.trim()) || email.split('@')[0];

      db.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, email.toLowerCase().trim(), hashedPassword, salt, userName, userRole, 1, 100, 1, userAvatar);

      const sessionToken = createSessionToken(id, userRole);
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(sessionToken, id, userRole, expiresAt);

      // Audit log
      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run('aud_' + Date.now(), id, 'SIGNUP_SUCCESS', `New user registered with role ${userRole}`);

      const user = {
        id,
        email: email.toLowerCase().trim(),
        name: userName,
        role: userRole,
        level: 1,
        xp: 100,
        streak: 1,
        avatar: userAvatar,
      };

      return NextResponse.json({ success: true, user, token: sessionToken });
    }

    // 2. LOGIN
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const userRecord: any = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

      if (!userRecord) {
        // Audit log failed attempt
        db.prepare(`
          INSERT INTO audit_logs (id, user_id, action, details)
          VALUES (?, ?, ?, ?)
        `).run('aud_' + Date.now(), 'anonymous', 'LOGIN_FAILED', `No account found for ${normalizedEmail}`);

        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      // Verify Password Hash
      const isValid = await verifyPassword(password, userRecord.password_salt, userRecord.password_hash);
      if (!isValid) {
        db.prepare(`
          INSERT INTO audit_logs (id, user_id, action, details)
          VALUES (?, ?, ?, ?)
        `).run('aud_' + Date.now(), userRecord.id, 'LOGIN_FAILED_CREDENTIALS', `Incorrect password for ${normalizedEmail}`);

        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }

      // Generate Session
      const sessionToken = createSessionToken(userRecord.id, userRecord.role);
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(sessionToken, userRecord.id, userRecord.role, expiresAt);

      // Audit log success
      db.prepare(`
        INSERT INTO audit_logs (id, user_id, action, details)
        VALUES (?, ?, ?, ?)
      `).run('aud_' + Date.now(), userRecord.id, 'LOGIN_SUCCESS', `User logged in from web client`);

      const safeUser = {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role,
        level: userRecord.level,
        xp: userRecord.xp,
        streak: userRecord.streak,
        avatar: userRecord.avatar,
      };

      return NextResponse.json({ success: true, user: safeUser, token: sessionToken });
    }

    // 3. GUEST ACCESS
    if (action === 'guest') {
      const userRecord: any = db.prepare('SELECT * FROM users ORDER BY xp DESC LIMIT 1').get();
      const safeUser = userRecord
        ? {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
            role: userRecord.role,
            level: userRecord.level,
            xp: userRecord.xp,
            streak: userRecord.streak,
            avatar: userRecord.avatar,
          }
        : {
            id: 'usr_guest_demo',
            email: 'guest@dataquest.org',
            name: 'Alex Mercer',
            role: 'student',
            level: 5,
            xp: 2350,
            streak: 12,
            avatar: '👩‍💻',
          };

      return NextResponse.json({ success: true, user: safeUser, token: 'dqs_guest_token' });
    }

    return NextResponse.json({ error: 'Invalid authentication action specified.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getPlatformDb();
    const users = db.prepare('SELECT id, email, name, role, level, xp, streak, avatar, created_at FROM users').all();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
