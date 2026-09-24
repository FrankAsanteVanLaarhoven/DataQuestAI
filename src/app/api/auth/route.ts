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
    const { action, email, password, name, role, avatar, interests, superAdminKey } = body;

    // 1. SIGNUP
    if (action === 'signup') {
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
      }

      const passCheck = validatePasswordStrength(password);
      if (!passCheck.valid) {
        return NextResponse.json({ error: passCheck.reason }, { status: 400 });
      }

      const normalizedEmail = email.toLowerCase().trim();
      const existing: any = db.prepare('SELECT id, email FROM users WHERE email = ?').get(normalizedEmail);
      if (existing) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please log in.' },
          { status: 409 }
        );
      }

      const id = 'usr_' + Math.random().toString(36).substring(2, 10);
      const salt = generateSalt(16);
      const hashedPassword = await hashPassword(password, salt);

      // Strict Role Control:
      // Super Admin Clearance for Frank Asante-Van Laarhoven or validated Super Admin Master Key
      const isSuperAdminMatch =
        normalizedEmail === 'frank@dataquest.ai' ||
        normalizedEmail === 'favl@dataquest.ai' ||
        superAdminKey === 'FrankDataQuest2026!#SuperAdmin' ||
        (process.env.SUPER_ADMIN_KEY && superAdminKey === process.env.SUPER_ADMIN_KEY);

      const adminSecret = body.adminSecret || request.headers.get('x-admin-secret');
      const isAuthorizedElevated = Boolean(
        process.env.ADMIN_REGISTRATION_SECRET &&
        adminSecret &&
        adminSecret === process.env.ADMIN_REGISTRATION_SECRET
      );

      let userRole: UserRole = 'student';
      if (isSuperAdminMatch) {
        userRole = 'super_admin';
      } else if (isAuthorizedElevated) {
        userRole = role === 'admin' ? 'admin' : role === 'teacher' ? 'teacher' : role === 'architect' ? 'architect' : 'student';
      }

      const userAvatar = isSuperAdminMatch ? '👑' : (avatar || '👩‍💻');
      const userName = (name && name.trim()) || (isSuperAdminMatch ? 'Frank Asante-Van Laarhoven' : normalizedEmail.split('@')[0]);
      const interestsArray = Array.isArray(interests) ? interests : [];
      const interestsJson = JSON.stringify(interestsArray);

      db.prepare(`
        INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar, is_blocked, interests_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
      `).run(id, normalizedEmail, hashedPassword, salt, userName, userRole, isSuperAdminMatch ? 99 : 1, isSuperAdminMatch ? 99999 : 100, isSuperAdminMatch ? 365 : 1, userAvatar, interestsJson);

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
      `).run('aud_' + Date.now(), id, 'SIGNUP_SUCCESS', `New user registered with role ${userRole} and ${interestsArray.length} interests`);

      const user = {
        id,
        email: normalizedEmail,
        name: userName,
        role: userRole,
        level: isSuperAdminMatch ? 99 : 1,
        xp: isSuperAdminMatch ? 99999 : 100,
        streak: isSuperAdminMatch ? 365 : 1,
        avatar: userAvatar,
        interests: interestsArray,
        isBlocked: false,
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

        return NextResponse.json(
          { error: 'No account found with this email. Would you like to create one?', suggestSignup: true },
          { status: 401 }
        );
      }

      // Check if user is blocked for platform abuse
      if (userRecord.is_blocked === 1) {
        db.prepare(`
          INSERT INTO audit_logs (id, user_id, action, details)
          VALUES (?, ?, ?, ?)
        `).run('aud_' + Date.now(), userRecord.id, 'BLOCKED_LOGIN_ATTEMPT', `Blocked user attempted login: ${normalizedEmail}`);

        return NextResponse.json(
          {
            error: `Access Denied: Your account has been suspended by the Super Admin for platform policy abuse. Reason: ${userRecord.blocked_reason || 'Violation of terms.'}`,
            isBlocked: true,
          },
          { status: 403 }
        );
      }

      // Verify Password Hash
      const isValid = await verifyPassword(password, userRecord.password_salt, userRecord.password_hash);
      if (!isValid) {
        db.prepare(`
          INSERT INTO audit_logs (id, user_id, action, details)
          VALUES (?, ?, ?, ?)
        `).run('aud_' + Date.now(), userRecord.id, 'LOGIN_FAILED_CREDENTIALS', `Incorrect password for ${normalizedEmail}`);

        return NextResponse.json({ error: 'Incorrect password. Please try again or use a demo account.' }, { status: 401 });
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
      `).run('aud_' + Date.now(), userRecord.id, 'LOGIN_SUCCESS', `User logged in from web client with role ${userRecord.role}`);

      let parsedInterests: string[] = [];
      try {
        if (userRecord.interests_json) parsedInterests = JSON.parse(userRecord.interests_json);
      } catch {}

      const safeUser = {
        id: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        role: userRecord.role as UserRole,
        level: userRecord.level,
        xp: userRecord.xp,
        streak: userRecord.streak,
        avatar: userRecord.avatar,
        interests: parsedInterests,
        isBlocked: false,
      };

      const response = NextResponse.json({ success: true, user: safeUser, token: sessionToken });
      response.cookies.set('dqs_token', sessionToken, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });
      return response;
    }

    // 3. SOCIAL LOGIN (Google / GitHub)
    if (action === 'social') {
      const { provider = 'google', email, name, role = 'student', avatar } = body;
      if (!email || !email.includes('@')) {
        return NextResponse.json({ error: 'Valid email address required for social sign-in.' }, { status: 400 });
      }

      const normalizedEmail = email.toLowerCase().trim();
      let userRecord: any = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);

      if (!userRecord) {
        const id = 'usr_' + Math.random().toString(36).substring(2, 10);
        const salt = generateSalt(16);
        const defaultHash = await hashPassword('oauth_verified_account_' + id, salt);
        const userName = (name && name.trim()) || email.split('@')[0];
        const userAvatar = avatar || (provider === 'github' ? '👾' : '🚀');
        const userRole: UserRole = role === 'teacher' || role === 'architect' ? role : 'student';

        db.prepare(`
          INSERT INTO users (id, email, password_hash, password_salt, name, role, level, xp, streak, avatar)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, normalizedEmail, defaultHash, salt, userName, userRole, 1, 100, 1, userAvatar);

        userRecord = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

        db.prepare(`
          INSERT INTO audit_logs (id, user_id, action, details)
          VALUES (?, ?, ?, ?)
        `).run('aud_' + Date.now(), id, 'OAUTH_SIGNUP_SUCCESS', `Registered via ${provider.toUpperCase()}`);
      } else {
        db.prepare(`
          INSERT INTO audit_logs (id, user_id, action, details)
          VALUES (?, ?, ?, ?)
        `).run('aud_' + Date.now(), userRecord.id, 'OAUTH_LOGIN_SUCCESS', `Logged in via ${provider.toUpperCase()}`);
      }

      const sessionToken = createSessionToken(userRecord.id, userRecord.role);
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

      db.prepare(`
        INSERT INTO sessions (token, user_id, role, expires_at)
        VALUES (?, ?, ?, ?)
      `).run(sessionToken, userRecord.id, userRecord.role, expiresAt);

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

      const response = NextResponse.json({ success: true, user: safeUser, token: sessionToken, provider });
      response.cookies.set('dqs_token', sessionToken, {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
      });
      return response;
    }

    // 4. GUEST ACCESS (Issues real time-limited session with student role)
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

      const guestToken = createSessionToken(guestId, 'student');
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      try {
        db.prepare(`
          INSERT INTO sessions (token, user_id, role, expires_at)
          VALUES (?, ?, ?, ?)
        `).run(guestToken, guestId, 'student', expiresAt);
      } catch {}

      const response = NextResponse.json({ success: true, user: safeUser, token: guestToken });
      response.cookies.set('dqs_token', guestToken, {
        path: '/',
        maxAge: 24 * 60 * 60,
        sameSite: 'lax',
      });
      return response;
    }

    // 5. VERIFY ACTIVE SESSION
    if (action === 'verify_session') {
      const token = body.token || extractBearerToken(request);
      const authCheck = validateSessionToken(token, db);
      if (!authCheck.valid) {
        return NextResponse.json({ valid: false, error: authCheck.error }, { status: authCheck.statusCode || 401 });
      }
      return NextResponse.json({ valid: true, user: authCheck.user, role: authCheck.role });
    }

    // 6. LOGOUT
    if (action === 'logout') {
      const token = body.token || extractBearerToken(request);
      if (token) {
        try {
          db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
        } catch {}
      }
      const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
      response.cookies.delete('dqs_token');
      return response;
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
