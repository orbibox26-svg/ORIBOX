# Setup SMS (Twilio) untuk OTP

Jika ingin mengirim OTP lewat SMS, saya saran pakai Twilio. Berikut langkah singkat:

1. Buat akun Twilio di https://www.twilio.com/
2. Catat `Account SID` dan `Auth Token`
3. Buat `Phone Number` di Twilio (dapat mengirim SMS)
4. Simpan nilai di `.env.local`:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

5. Endpoint yang sudah dibuat: `POST /api/auth/send-otp`
- Body JSON: `{ "phone": "+6281xxxxxxx" }`

6. Verifikasi OTP: `POST /api/auth/verify-otp` (body: `{ "username": "+6281...", "code": "123456" }`)

Catatan:
- `username` pada flow OTP dipetakan ke `phone` di implementasi sekarang.
- Jika tidak punya Twilio, endpoint akan mencoba fallback mengirim ke Telegram chat jika `TELEGRAM_BOT_TOKEN` dan `TELEGRAM_CHAT_ID` dikonfigurasi.
- Untuk pengujian lokal, set `NODE_ENV=development` atau `SHOW_OTP_IN_RESPONSE=true` agar OTP dikembalikan dalam response (HANYA UNTUK PENGUJIAN).