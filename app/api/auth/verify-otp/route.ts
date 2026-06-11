import { NextResponse } from 'next/server';
import { verifyOTP } from '../../../../lib/otp';

type Body = {
  username?: string;
  code?: string;
};

export async function POST(req: Request) {
  const body: Body = await req.json().catch(() => ({}));
  const { username, code } = body;

  if (!username || !code) {
    return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
  }

  const ok = verifyOTP(username, code);
  if (!ok) return NextResponse.json({ ok: false, message: 'Invalid or expired OTP' }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  // Set a simple session cookie (demo). Use secure, signed cookies in production.
  res.cookies.set('orbibox_session', `user=${username}`, { httpOnly: false, path: '/', maxAge: 86400 });
  return res;
}
