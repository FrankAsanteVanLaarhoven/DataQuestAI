import { NextResponse } from 'next/server';
import { getPlatformDb } from '@/lib/platform-db';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  createSessionToken,
  validatePasswordStrength,
  extractBearerToken,
  validateSessionToken,
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
      // Strict Role Control: Default unconditionally to 'student'.
      // Only permit elevated roles ('teacher', 'architect', 'admin') if verified by server secret.
      const adminSecret = body.adminSecret || request.headers.get('x-admin-secret');
      const isAuthorizedElevated = Boolean(
        process.env.ADMIN_REGISTRATION_SECRET &&
        adminSecret &&
        adminSecret === process.env.ADMIN_REGISTRATION_SECRET
      );
      const userRole: UserRole = isAuthorizedElevated
        ? (role === 'teacher' ? 'teacher' : role === 'architect' ? 'architect' : 'student')
        : 'student';
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

    // 3. GUEST ACCESS (Issues real time-limited session with student role)
    if (action === 'guest') {
      const userRecord: any = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY xp DESC LIMIT 1').get('student');
      const guestId = userRecord?.id || 'usr_guest_demo';
      const safeUser = userRecord
        ? {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
            role: 'student' as UserRole,
            level: userRecord.level,
            xp: userRecord.xp,
            streak: userRecord.streak,
            avatar: userRecord.avatar,
          }
        : {
            id: guestId,
            email: 'guest@dataquest.internal',
            name: 'Demo Student',
            role: 'student' as UserRole,
            level: 1,
            xp: 150,
            streak: 1,
            avatar: '👩‍💻',
          };

      // Create a genuine time-limited session in the database
      const guestToken = createSessionToken(guestId, 'student');
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24-hour guest session
      try {
        db.prepare(`
          INSERT INTO sessions (token, user_id, role, expires_at)
          VALUES (?, ?, ?, ?)
        `).run(guestToken, guestId, 'student', expiresAt);
      } catch {}

      return NextResponse.json({ success: true, user: safeUser, token: guestToken });
    }

    // 4. VERIFY ACTIVE SESSION
    if (action === 'verify_session') {
      const token = body.token || extractBearerToken(request);
      const authCheck = validateSessionToken(token, db);
      if (!authCheck.valid) {
        return NextResponse.json({ valid: false, error: authCheck.error }, { status: authCheck.statusCode || 401 });
      }
      return NextResponse.json({ valid: true, user: authCheck.user, role: authCheck.role });
    }

    return NextResponse.json({ error: 'Invalid authentication action specified.' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 });
  }
}

// Privileged Roster Endpoint: Strict Role-Based Access Control (Teacher/Admin only)
export async function GET(request: Request) {
  try {
    const db = getPlatformDb();
    const token = extractBearerToken(request);
    const authCheck = validateSessionToken(token, db, 'teacher');

    if (!authCheck.valid) {
      return NextResponse.json(
        { error: authCheck.error || 'Lecturer or administrator privileges required to access student roster.' },
        { status: authCheck.statusCode || 401 }
      );
    }

    const users = db.prepare('SELECT id, email, name, role, level, xp, streak, avatar, created_at FROM users').all();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
