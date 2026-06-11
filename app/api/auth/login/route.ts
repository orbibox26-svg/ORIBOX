import { NextResponse } from 'next/server';
import { addDeviceSession } from '../../../../lib/sessions';
import { sendLoginNotification } from '../../../../lib/telegram';

type Body = {
  username?: string;
  password?: string;
};

function genSessionId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(req: Request) {
  const body: Body = await req.json().catch(() => ({}));
  const { username, password } = body;

  // Simple static credential check (for demo). Replace with real auth.
  const valid =
    (username === 'Queitz' && password === 'Inseba21') ||
    (username === 'admin' && password === 'admin');

  if (valid) {
    const sessionId = genSessionId();

    // Get client info
    const ip =
      req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || null;

    const session = {
      id: sessionId,
      username: username || 'unknown',
      ip,
      userAgent,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDeviceSession(session as any);
    } catch (e) {
      // ignore file write errors but log to console
      // eslint-disable-next-line no-console
      console.error('Failed to store device session', e);
    }

    // Send Telegram notification ke Team Admin
    try {
      await sendLoginNotification(session.username, session.ip, session.userAgent, session.createdAt);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Telegram notify failed', err);
    }

    const res = NextResponse.json({ ok: true });
    // Set httpOnly session cookie with generated session id
    res.cookies.set('orbibox_session', sessionId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
    return res;
  }

  return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
}
