import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const hasSession = cookieHeader.split(';').some(c => c.trim().startsWith('orbibox_session='));

  if (!hasSession) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true });
}
