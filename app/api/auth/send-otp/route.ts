import { NextResponse } from 'next/server';
import { createOTP } from '../../../../lib/otp';
import { sendTelegramMessage } from '../../../../lib/telegram';

type Body = {
  phone?: string; // Nomor telepon lengkap dengan kode negara, mis. +628123456789
};

function isDev() {
  return process.env.NODE_ENV !== 'production' || process.env.SHOW_OTP_IN_RESPONSE === 'true';
}

export async function POST(req: Request) {
  const body: Body = await req.json().catch(() => ({}));
  const { phone } = body;

  if (!phone) {
    return NextResponse.json({ ok: false, message: 'phone is required' }, { status: 400 });
  }

  // Create OTP associated with the phone number
  const code = createOTP(phone);

  // Try to send via Twilio if configured
  const TW_SID = process.env.TWILIO_ACCOUNT_SID;
  const TW_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TW_FROM = process.env.TWILIO_FROM_NUMBER; // e.g. +1234567890

  if (TW_SID && TW_TOKEN && TW_FROM) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${TW_SID}/Messages.json`;
      const params = new URLSearchParams();
      params.append('From', TW_FROM);
      params.append('To', phone);
      params.append('Body', `Kode OTP Anda: ${code}`);

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${TW_SID}:${TW_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('Twilio error:', resp.status, text);
        // fallback nanti
      } else {
        return NextResponse.json({ ok: true, sentVia: 'twilio' });
      }
    } catch (err) {
      console.error('Twilio send failed', err);
    }
  }

  // Fallback: try sending OTP via Telegram to configured chat (for testing)
  const BOT = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT = process.env.TELEGRAM_CHAT_ID; // admin/testing chat
  if (BOT && CHAT) {
    try {
      await sendTelegramMessage(BOT, CHAT, `OTP untuk ${phone}: ${code}`);
      return NextResponse.json({ ok: true, sentVia: 'telegram' });
    } catch (err) {
      console.error('Telegram fallback failed', err);
    }
  }

  // If no provider configured, return success in dev and include OTP when allowed
  if (isDev()) {
    return NextResponse.json({ ok: true, sentVia: 'dev', otp: code });
  }

  return NextResponse.json({ ok: true, message: 'OTP created' });
}
