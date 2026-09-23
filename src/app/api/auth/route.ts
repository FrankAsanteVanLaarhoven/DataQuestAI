import { NextResponse } from 'next/server';
import { getSqliteDb } from '@/lib/sqlite-db';

export async function POST(request: Request) {
  try {
    const db = getSqliteDb();
    const body = await request.json();
    const { action, email, password, name, role, avatar } = body;

    if (action === 'signup') {
      let existing: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existing) {
        // If user already exists, update their profile with selected role/avatar/name and log them in
        const userAvatar = avatar || existing.avatar || '👩‍💻';
        const userRole = role || existing.role || 'student';
        const userName = (name && name.trim()) || existing.name || email.split('@')[0];
        db.prepare(`
          UPDATE users SET name = ?, role = ?, avatar = ? WHERE email = ?
        `).run(userName, userRole, userAvatar, email);
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        return NextResponse.json({ success: true, user });
      }

      const id = 'usr_' + Math.random().toString(36).substring(2, 9);
      const userAvatar = avatar || '👩‍💻';
      const userRole = role || 'student';
      const userName = (name && name.trim()) || email.split('@')[0];

      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, level, xp, streak, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, email, password || 'hashed_pw', userName, userRole, 1, 100, 1, userAvatar);

      const user: any = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      return NextResponse.json({ success: true, user });
    }

    if (action === 'login' || action === 'social') {
      let user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        // Auto-create on first login!
        const id = 'usr_' + Math.random().toString(36).substring(2, 9);
        const userAvatar = avatar || '👩‍💻';
        const userRole = role || 'student';
        const userName = (name && name.trim()) || email.split('@')[0];
        db.prepare(`
          INSERT INTO users (id, email, password_hash, name, role, level, xp, streak, avatar)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(id, email, password || 'hashed_pw', userName, userRole, 1, 100, 1, userAvatar);
        user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
      }
      return NextResponse.json({ success: true, user });
    }

    // Guest demo login
    if (action === 'guest') {
      const user: any = db.prepare('SELECT * FROM users ORDER BY xp DESC LIMIT 1').get();
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = getSqliteDb();
    const users = db.prepare('SELECT id, email, name, role, level, xp, streak, avatar, created_at FROM users').all();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
