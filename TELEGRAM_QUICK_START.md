# 🚀 Telegram Notification System - Quick Guide

## 📋 Struktur File Baru

```
lib/
  ├── telegram.ts                    # Core functions (sudah ada, ditambah fitur location)
  ├── telegram-config.ts             # ✨ BARU: Konfigurasi location → chat ID
  └── telegram-helpers.ts            # ✨ BARU: Helper functions untuk integrasi mudah

app/api/notifications/
  └── send-to-location/
      └── route.ts                   # ✨ BARU: API endpoint untuk send notifikasi

docs/
  ├── TELEGRAM_SETUP.md             # ✨ BARU: Setup lengkap (detailed)
  └── TELEGRAM_INTEGRATION_EXAMPLES.md # ✨ BARU: Code examples
```

---

## ⚡ Quick Start (5 Menit)

### Langkah 1: Dapatkan Telegram Bot Token

1. Buka Telegram → cari `@BotFather`
2. Ketik `/newbot`
3. Ikuti instruksi
4. **COPY TOKEN** yang diberikan (format: `123456:ABC-DEF...`)

### Langkah 2: Buat Group untuk Setiap Lokasi

Buat grup Telegram:
- `ORIBOX - Teknisi TNS 001`
- `ORIBOX - Teknisi TNS 002`
- `ORIBOX - Teknisi TNS 003`
- etc...

Invite bot ke grup.

### Langkah 3: Dapatkan Chat ID

**Metode Paling Mudah:**

```bash
curl "https://api.telegram.org/bot<TOKEN>/getUpdates"
```

Kirim message ke grup dulu, lalu jalankan curl di atas. Cari di response bagian `"chat":` → `"id":` (format: `-100xxxxxxxxxx`)

### Langkah 4: Update Files

**File: `.env.local`**
```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234567890ABCDEF1234567890AB
```

**File: `lib/telegram-config.ts`**
```typescript
export const TELEGRAM_LOCATIONS: TelegramLocation[] = [
  {
    id: 'TNS001',
    name: 'Lokasi TNS 001',
    chatId: '-100xxxxxxxxxxxx',  // ← Chat ID dari step 3
    description: 'Tim Teknisi TNS 001'
  },
  {
    id: 'TNS002',
    name: 'Lokasi TNS 002',
    chatId: '-100xxxxxxxxxxxx',
    description: 'Tim Teknisi TNS 002'
  },
  // Tambah locations lainnya
];
```

### Langkah 5: Test

```bash
curl -X POST http://localhost:3000/api/notifications/send-to-location \
  -H "Content-Type: application/json" \
  -d '{
    "locationId": "TNS001",
    "type": "general",
    "message": "Test notification 🎉",
    "level": "INFO"
  }'
```

Cek grup TNS001 di Telegram - harusnya ada pesan masuk! ✅

---

## 📱 Contoh Penggunaan

### 1. Kirim Notifikasi dari Route Handler

```typescript
import { notifyNewComment } from '@/lib/telegram-helpers';

export async function POST(request: NextRequest) {
  // ... logic untuk create comment
  
  // Kirim notifikasi Telegram
  await notifyNewComment(
    'TNS001',
    'Pencarian Harga - Part XYZ',
    'Ari Wijaya',
    'Ada penawaran baru dari supplier A: Rp 50.000/unit',
    true // isPriority
  );
  
  return NextResponse.json({ success: true });
}
```

### 2. Notifikasi Device Alert

```typescript
import { notifyDeviceStatus } from '@/lib/telegram-helpers';

await notifyDeviceStatus(
  'TNS002',
  'Mesin Produksi B2',
  'alert',
  'Error: Temperature sensor malfunction',
  true // isCritical
);
```

### 3. Notifikasi Absensi

```typescript
import { notifyAbsensi } from '@/lib/telegram-helpers';

await notifyAbsensi(
  'TNS001',
  'Bambang Sutrisno',
  'late',
  '08:45',
  'Macet di Gatot Subroto'
);
```

### 4. Notifikasi Price Update

```typescript
import { notifyPriceUpdate } from '@/lib/telegram-helpers';

await notifyPriceUpdate(
  'TNS001',
  'Resistor 10K 1/4W (100 pcs)',
  'Rp 50.000',
  'Rp 45.000',
  'PT Elektro Indonesia',
  'Target tercapai! Bisa order sekarang'
);
```

---

## 🎯 Tipe Notifikasi yang Tersedia

| Type | Function | Untuk |
|------|----------|-------|
| `comment` | `notifyNewComment()` | Komentar/update pencarian harga |
| `device_status` | `notifyDeviceStatus()` | Alert device/sensor error |
| `absensi` | `notifyAbsensi()` | Late/absent check-in |
| `price_update` | `notifyPriceUpdate()` | Supplier offers/price changes |
| `general` | `notifyLocationUpdate()` | Notifikasi umum custom |

---

## 🔧 Integrasi dengan Existing Routes

Contoh: Update route handler untuk send notification

**Sebelum:**
```typescript
export async function POST(request: NextRequest) {
  // ... create comment logic
  return NextResponse.json({ success: true });
}
```

**Sesudah:**
```typescript
import { notifyNewComment } from '@/lib/telegram-helpers';

export async function POST(request: NextRequest) {
  const { locationId, subject, author, comment } = await request.json();
  
  // ... create comment logic
  
  // ✨ Tambah notification
  await notifyNewComment(locationId, subject, author, comment);
  
  return NextResponse.json({ success: true });
}
```

---

## 🚨 Troubleshooting

### Bot tidak kirim pesan?

1. **Cek token valid:**
   ```bash
   curl "https://api.telegram.org/bot{TOKEN}/getMe"
   ```
   Harus return nama bot

2. **Cek chat ID valid:**
   ```bash
   curl "https://api.telegram.org/bot{TOKEN}/getUpdates"
   ```
   Kirim message ke grup dulu

3. **Cek bot di grup:**
   - Bot sudah di-invite? ✅
   - Bot bukan admin? ✅
   - Grup bukan archived? ✅

### Chat ID salah format?

Harus `-100xxxxxxxxxx` (minus, 100, diikuti angka)

Jika hanya angka (misalnya `123456789`), tambahkan `-100` di depan: `-100123456789`

### Pesan tidak format HTML?

Parse mode `HTML` sudah built-in di `telegram.ts`, jadi:
- `<b>bold</b>` → **bold**
- `<i>italic</i>` → *italic*
- `<code>code</code>` → `code`
- Dan stag HTML lainnya

---

## 📚 Dokumentasi Lengkap

Untuk setup detail & troubleshooting lanjut:
- 📖 [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Setup lengkap
- 💻 [TELEGRAM_INTEGRATION_EXAMPLES.md](./TELEGRAM_INTEGRATION_EXAMPLES.md) - Code examples detail

---

## ✅ Checklist Setup

- [ ] Bot token didapat dari @BotFather
- [ ] Bot token dimasukkan di `.env.local`
- [ ] Group dibuat untuk setiap lokasi (TNS001, TNS002, dst)
- [ ] Bot di-invite ke semua groups
- [ ] Chat IDs didapat dari getUpdates
- [ ] Chat IDs dimasukkan ke `lib/telegram-config.ts`
- [ ] Test notification berhasil
- [ ] Integrasi dengan API routes dimulai
- [ ] Testing production notifications

---

## 🎉 Selesai!

Sistem Telegram notifications sudah siap!

Sekarang setiap update di app akan langsung dikirim ke grup Telegram location yang terkait. Tim teknisi akan otomatis dapat notifikasi! 🚀
