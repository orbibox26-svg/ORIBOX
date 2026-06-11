# 📱 Setup Telegram untuk Notifikasi Team Teknisi

## Daftar Isi
1. [Quick Setup](#quick-setup)
2. [Konfigurasi Bot](#konfigurasi-bot)
3. [Konfigurasi Group Telegram](#konfigurasi-group-telegram)
4. [Update .env.local](#update-envlocal)
5. [Testing](#testing)
6. [Contoh Penggunaan](#contoh-penggunaan)
7. [Troubleshooting](#troubleshooting)

---

## Quick Setup

### 1. Buat Telegram Bot
1. Buka Telegram → cari **@BotFather**
2. Ketik: `/newbot`
3. Ikuti langkah-langkahnya:
   - Nama bot: misalnya `ORIBOX_Notifications_Bot`
   - Username bot: misalnya `oribox_notifications_bot` (harus unique)
4. **SIMPAN TOKEN** yang BotFather berikan! (format: `123456:ABC-DEF...`)

### 2. Buat Group Telegram untuk Setiap Lokasi
Buat grup terpisah untuk setiap lokasi teknisi:
- Grup: `ORIBOX - Teknisi TNS 001`
- Grup: `ORIBOX - Teknisi TNS 002`
- Grup: `ORIBOX - Teknisi TNS 003`
- dll...

### 3. Dapatkan Group Chat ID

Ada 3 cara:

**Cara 1: Menggunakan Bot (Recommended)**
```
1. Invite bot ke grup
2. Ketik di grup: /start
3. Bot akan memberikan Chat ID
```

**Cara 2: Menggunakan API**
```bash
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
```
Kirim pesan ke grup, lalu cek Chat ID di response (format: `-100xxxxxxxxxx`)

**Cara 3: Cek Web App**
Buka: `https://web.telegram.org/` → Inspect → cari `chat_id` di console

### 4. Konfigurasi File

Edit file `lib/telegram-config.ts`:

```typescript
export const TELEGRAM_LOCATIONS: TelegramLocation[] = [
  {
    id: 'TNS001',
    name: 'Lokasi TNS 001 - Pusat',
    chatId: '-100xxxxxxxxxxxx', // Chat ID dari grup
    description: 'Group Telegram untuk tim teknisi TNS 001'
  },
  {
    id: 'TNS002',
    name: 'Lokasi TNS 002 - Cabang A',
    chatId: '-100xxxxxxxxxxxx',
    description: 'Group Telegram untuk tim teknisi TNS 002'
  },
  {
    id: 'TNS003',
    name: 'Lokasi TNS 003 - Cabang B',
    chatId: '-100xxxxxxxxxxxx',
    description: 'Group Telegram untuk tim teknisi TNS 003'
  }
];
```

### 5. Update `.env.local`

```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234567890ABCDEF1234567890AB
```

---

## Konfigurasi Bot

### Izin Bot di Grup
1. Bahwa bot sudah di-invite ke semua grup
2. Set permission bot (optional tapi recommended):
   ```
   - Send messages: ✅
   - Send media files: ✅
   - Edit other's messages: ❌
   - Delete messages: ⚠️ (opsional)
   ```

### Setting Bot di BotFather
```
/setcommands
```
Pilih bot, lalu atur commands:
```
start - Start bot
help - Tampilkan bantuan
status - Check bot status
```

---

## Konfigurasi Group Telegram

### Setup Grup untuk Setiap Lokasi

1. **Buat Grup Baru**
   - Nama: `ORIBOX - Teknisi [LOKASI]`
   - Untuk semua teknisi di lokasi tersebut

2. **Invite Members**
   - Semua teknisi di lokasi
   - Admin/supervisor lokasi
   - Bot Telegram

3. **Set Permissions**
   - Bisa dikirim message: ✅
   - Bisa ubah profil grup: admin only
   - Bisa delete message: admin only

4. **Daftar Group Chat IDs**
   ```
   TNS001 (Pusat): -100xxxxxxxxxxxx
   TNS002 (Cabang A): -100xxxxxxxxxxxx
   TNS003 (Cabang B): -100xxxxxxxxxxxx
   ```

---

## Update .env.local

File: `c:\Users\Administrator\Desktop\project_work\.env.local`

Tambahkan atau update:
```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234567890ABCDEF1234567890AB

# Optional: Debug mode
TELEGRAM_DEBUG=false
```

**Tempat dapatkan token:**
- Dari @BotFather di Telegram
- Format: `[numeric_id]:[alphanumeric_token]`

---

## Testing

### Test 1: Cek Konfigurasi
```bash
# Di terminal workspace
npm run test-telegram-config
```

### Test 2: Kirim Test Message Manual

**Menggunakan Curl:**
```bash
curl -X POST http://localhost:3000/api/notifications/send-to-location \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "TNS001",
    "type": "general",
    "message": "Test message dari ORIBOX system 🎉",
    "notificationType": "general",
    "level": "INFO"
  }'
```

**Menggunakan JavaScript (Client-side):**
```javascript
async function testNotification() {
  const response = await fetch('/api/notifications/send-to-location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      locationId: 'TNS001',
      type: 'comment',
      subject: 'Pencarian Harga - Part XYZ',
      author: 'Admin',
      comment: 'Ada penawaran baru dari supplier A dengan harga Rp 50.000',
      priority: 'high'
    })
  });
  
  const result = await response.json();
  console.log(result);
}
```

### Test 3: Verifikasi di Telegram
1. Buka grup ORIBOX di Telegram
2. Lihat apakah pesan test tersampai
3. Cek format dan emoji muncul dengan benar

---

## Contoh Penggunaan

### 1. Update Perangkat (Device Alert)

**Scenario:** Ada device yang error di TNS001

```typescript
import { sendDeviceUpdateToLocation } from '@/lib/telegram';

// Dalam route handler atau function
await sendDeviceUpdateToLocation(
  'TNS001',
  'Mesin Produksi A1',
  'alert',
  'Sensor temperature error - reading 89°C (normal: 25-30°C)',
  'critical'
);
```

**Output di Telegram:**
```
⚠️ DEVICE_STATUS
Location: Lokasi TNS 001 - Pusat
━━━━━━━━━━━━━━━
Device: Mesin Produksi A1
Type: ALERT
Severity: CRITICAL
━━━━━━━━━━━━━━━
Sensor temperature error - reading 89°C (normal: 25-30°C)
Time: 11/06/2026, 10:30:45
```

### 2. Komentar/Update Pencarian Harga

**Scenario:** Ada komentar baru untuk pencarian harga di TNS002

```typescript
import { sendCommentUpdateToLocation } from '@/lib/telegram';

await sendCommentUpdateToLocation(
  'TNS002',
  'Pencarian Harga - Part Control Board',
  'Ari Wijaya',
  'Supplier PT Elektro Indonesia menawarkan harga Rp 125.000 per unit (min order 10 unit). Ditemukan juga alternatif dari CV Elektronik Jaya dengan harga Rp 118.000 tapi waktu delivery 3 hari lebih lama.',
  'high'
);
```

**Output di Telegram:**
```
💬 COMMENT
Location: Lokasi TNS 002 - Cabang A
━━━━━━━━━━━━━━━
Subject: Pencarian Harga - Part Control Board
Author: Ari Wijaya
Priority: HIGH
━━━━━━━━━━━━━━━
Supplier PT Elektro Indonesia menawarkan harga Rp 125.000 per unit...
Time: 11/06/2026, 10:35:22
```

### 3. Absensi Update

```typescript
import { sendAbsensiUpdateToLocation } from '@/lib/telegram';

await sendAbsensiUpdateToLocation(
  'TNS001',
  'Bambang Sutrisno',
  'late',
  '08:45',
  'Macet di Jalan Gatot Subroto, estimasi sampai jam 9'
);
```

**Output di Telegram:**
```
⏰ LATE
Location: Lokasi TNS 001 - Pusat
━━━━━━━━━━━━━━━
Employee: Bambang Sutrisno
Time: 08:45
Details: Macet di Jalan Gatot Subroto, estimasi sampai jam 9
Time: 11/06/2026, 08:50:15
```

### 4. Price Update

```typescript
import { sendPriceUpdateToLocation } from '@/lib/telegram';

await sendPriceUpdateToLocation(
  'TNS001',
  'Resistor 10K 1/4W (100 pcs)',
  'Rp 50.000',
  'Rp 45.000',
  'PT Elektro Indonesia',
  'Target price tercapai, bisa order sekarang'
);
```

### 5. Dari Route Handler

**File: `app/api/comments/create/route.ts`**

```typescript
import { sendCommentUpdateToLocation } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  // ... database logic
  
  const { locationId, subject, author, comment, priority } = body;
  
  // Kirim notifikasi Telegram
  await sendCommentUpdateToLocation(
    locationId,
    subject,
    author,
    comment,
    priority
  );
  
  return NextResponse.json({ success: true });
}
```

---

## Troubleshooting

### Bot tidak kirim pesan?

**1. Cek Token**
```bash
curl "https://api.telegram.org/bot{TOKEN}/getMe"
```
Harus return nama bot dan ID

**2. Cek Chat ID**
```bash
curl "https://api.telegram.org/bot{TOKEN}/getUpdates"
```
Lihat di response apakah ada `chat` object dengan ID

**3. Cek Bot di Grup**
- Bot harus di-invite ke grup
- Bot harus punya permission send message
- Grup harus bukan archive/deleted

### Chat ID tidak muncul?

Kirim message ke grup dulu:
```
Halo, saya bot test
```

Lalu cek: `https://api.telegram.org/bot{TOKEN}/getUpdates`

Chat ID akan muncul dengan format: `-100xxxxxxxxxx`

### Pesan format HTML salah?

Pastikan parameter `parse_mode: 'HTML'` ada di Telegram API call. Sudah built-in di `lib/telegram.ts`

### Bot banned?

- Jangan spam message
- Jangan kirim terlalu sering (rate limit 30 msg/detik per chat)
- Tunggu 24 jam sebelum coba lagi

---

## Advanced: Multi-Location Setup Script

Jika punya banyak lokasi, bisa automate:

```bash
#!/bin/bash
# setup-telegram-locations.sh

LOCATIONS=(
  "TNS001:Lokasi TNS 001 Pusat:-100111111111111"
  "TNS002:Lokasi TNS 002 Cabang A:-100222222222222"
  "TNS003:Lokasi TNS 003 Cabang B:-100333333333333"
)

for location in "${LOCATIONS[@]}"; do
  IFS=':' read -r id name chatId <<< "$location"
  echo "Setup: $id -> $chatId"
done
```

---

## Kesimpulan

✅ **Setup Telegram notifications siap!**

Sekarang setiap update:
- Device status/alert
- Komentar pencarian harga
- Absensi
- Price updates
- General notifications

Akan langsung dikirim ke grup Telegram lokasi yang terkait, sehingga semua teknisi di lokasi itu tahu notifikasinya.

💡 **Tips:** Tambahkan/modifikasi locations di `lib/telegram-config.ts` sesuai kebutuhan.
