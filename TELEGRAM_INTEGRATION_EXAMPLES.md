/**
 * CONTOH: API Route untuk membuat/update comment dengan Telegram notification
 * Path: app/api/comments/create/route.ts
 * 
 * Ini adalah CONTOH implementasi - adjust sesuai database/schema kamu
 */

import { NextRequest, NextResponse } from 'next/server';
import { notifyNewComment } from '@/lib/telegram-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      locationId,
      subject,
      authorName,
      commentText,
      isPriority,
      // ... field lainnya
    } = body;

    // Validasi
    if (!locationId || !subject || !authorName || !commentText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Simpan comment ke database
    // const comment = await db.comments.create({ ... })

    // ✅ KIRIM NOTIFIKASI KE TELEGRAM
    await notifyNewComment(
      locationId,
      subject,
      authorName,
      commentText,
      isPriority || false
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Comment created and notification sent',
        // comment, // return comment dari DB jika ada
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

/**
 * ============================================
 * CONTOH 2: API untuk Device Status Update
 * ============================================
 */

// Path: app/api/devices/update-status/route.ts

import { notifyDeviceStatus } from '@/lib/telegram-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      locationId,
      deviceId,
      deviceName,
      status,
      description,
      isCritical,
    } = body;

    if (!locationId || !deviceId || !deviceName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Update database
    // await db.devices.update({ id: deviceId }, { status })

    // ✅ KIRIM NOTIFIKASI
    if (status === 'error' || status === 'alert') {
      await notifyDeviceStatus(
        locationId,
        deviceName,
        'alert',
        description || 'Device status changed',
        isCritical || false
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating device:', error);
    return NextResponse.json(
      { error: 'Failed to update device' },
      { status: 500 }
    );
  }
}

/**
 * ============================================
 * CONTOH 3: API untuk Absensi Check-in
 * ============================================
 */

// Path: app/api/absensi/checkin/route.ts

import { notifyAbsensi } from '@/lib/telegram-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      locationId,
      employeeId,
      employeeName,
      checkInTime,
      lateReason,
    } = body;

    // Determine status
    const now = new Date(checkInTime);
    const expectedTime = new Date();
    expectedTime.setHours(8, 0, 0); // Misalnya jam 8 pagi

    let status: 'present' | 'late' | 'absent' = 'present';
    if (now > expectedTime) {
      status = 'late';
    }

    // TODO: Simpan ke database
    // await db.absensi.create({ employeeId, checkInTime, status })

    // ✅ KIRIM NOTIFIKASI untuk late/absent saja
    if (status === 'late' || status === 'absent') {
      await notifyAbsensi(
        locationId,
        employeeName,
        status,
        checkInTime,
        lateReason
      );
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error('Error in check-in:', error);
    return NextResponse.json(
      { error: 'Failed to process check-in' },
      { status: 500 }
    );
  }
}

/**
 * ============================================
 * CONTOH 4: API untuk Price Update
 * ============================================
 */

// Path: app/api/prices/update-supplier-offer/route.ts

import { notifyPriceUpdate } from '@/lib/telegram-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      locationId,
      itemName,
      currentPrice,
      targetPrice,
      supplierName,
      additionalNotes,
      isTargetReached,
    } = body;

    // TODO: Simpan price update ke database
    // await db.priceUpdates.create({ ... })

    // ✅ KIRIM NOTIFIKASI
    await notifyPriceUpdate(
      locationId,
      itemName,
      currentPrice,
      targetPrice,
      supplierName,
      additionalNotes
    );

    // Jika target harga tercapai, bisa kirim escalated notification
    if (isTargetReached) {
      // Optional: Bisa tambah emoji/format khusus
      console.log(`🎉 TARGET PRICE REACHED for ${itemName}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating price:', error);
    return NextResponse.json(
      { error: 'Failed to update price' },
      { status: 500 }
    );
  }
}
