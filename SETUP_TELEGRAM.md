# 📱 Panduan Setup Telegram Integration

## Langkah 1: Buat Telegram Bot

1. Buka Telegram dan cari **@BotFather**
2. Kirim command `/start`
3. Kirim `/newbot`
4. Ikuti instruksi:
   - Masukkan nama bot (contoh: "ORIBOX Alert Bot")
   - Masukkan username bot (harus unik, contoh: "oribox_alert_bot")
5. Kamu akan dapat **Bot Token** (contoh: `8660454822:AAHM21YswVAMJjKr6GX2YyjInb8X0mbbQgM`)
6. Copy token ini ke `.env.local` sebagai `TELEGRAM_BOT_TOKEN`

## Langkah 2: Dapatkan Chat ID untuk Grup/User

### Cara 1: Untuk User ID Individual
1. Buka chat dengan bot kamu
2. Kirim message apapun
3. Buka URL: `https://api.telegram.org/botTOKEN/getUpdates` (ganti TOKEN dengan bot token kamu)
4. Cari `chat.id` di response JSON
5. Chat ID akan berupa angka negatif atau positif

### Cara 2: Untuk Grup Telegram
1. Buat grup baru di Telegram
2. Tambahkan bot kamu ke grup
3. Kirim message apapun di grup
4. Buka URL: `https://api.telegram.org/botTOKEN/getUpdates`
5. Cari `chat.id` (akan berupa angka negatif untuk group)

### Contoh Response:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "chat": {
          "id": -1001234567890,  // <-- Ini Chat ID (grup)
          "type": "group"
        }
      }
    }
  ]
}
```

## Langkah 3: Setup di Project

### Edit `.env.local`:
```env
TELEGRAM_BOT_TOKEN=8660454822:AAHM21YswVAMJjKr6GX2YyjInb8X0mbbQgM

# Grup Telegram untuk Team Teknisi
TELEGRAM_CHAT_ID_TEKNISI=-1001234567890

# Grup Telegram untuk Team Admin
TELEGRAM_CHAT_ID_ADMIN=-1001234567891

# Grup Telegram untuk Alert Umum
TELEGRAM_CHAT_ID_UMUM=123456789
```

## Struktur Chat ID di Project

Edit file `data/telegram-config.json`:
```json
{
  "groups": {
    "teknisi": {
      "name": "Team Teknisi",
      "chatId": "-1001234567890",
      "description": "Alert untuk masalah device & system"
    },
    "admin": {
      "name": "Team Admin",
      "chatId": "-1001234567891",
      "description": "Report absensi & user management"
    },
    "umum": {
      "name": "Channel Umum",
      "chatId": "123456789",
      "description": "Notifikasi umum"
    }
  }
}
```

## Penggunaan di Code

### Kirim ke grup tertentu:
```typescript
import { sendTelegramMessage } from '@/lib/telegram';

// Kirim ke Team Teknisi
await sendTelegramMessage(
  process.env.TELEGRAM_BOT_TOKEN!,
  process.env.TELEGRAM_CHAT_ID_TEKNISI!,
  "⚠️ Device offline: Gate A - Head Office"
);
```

### Kirim ke multiple groups:
```typescript
import { sendToTeam, sendToAllTeams } from '@/lib/telegram';

// Kirim ke group tertentu
await sendToTeam('teknisi', '⚠️ Device maintenance required');

// Kirim ke semua group sekaligus
await sendToAllTeams('🔌 System maintenance: 10:00 - 11:00 WIB');
```

## Testing

### Test dengan cURL:
```bash
curl -X POST https://api.telegram.org/botTOKEN/sendMessage \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "CHAT_ID",
    "text": "Test message dari ORIBOX"
  }'
```

## Tips & Best Practices

✅ Gunakan **Grup Private** untuk data sensitif (Login, IP, dll)
✅ Gunakan **Forward Message** feature untuk log history
✅ Set Telegram notification pada level level: ERROR, WARNING, INFO
✅ Jangan share Bot Token di public repository

❌ Jangan hardcode Chat ID - selalu gunakan .env
❌ Jangan kirim data sensitif tanpa enkripsi
❌ Jangan rate limit ke API Telegram (max 30 msg/sec per group)
