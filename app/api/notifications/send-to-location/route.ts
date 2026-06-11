import { NextRequest, NextResponse } from 'next/server';
import {
  sendToLocation,
  sendDeviceUpdateToLocation,
  sendCommentUpdateToLocation,
  sendAbsensiUpdateToLocation,
  sendPriceUpdateToLocation,
} from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { locationId, type, ...rest } = body;

    if (!locationId) {
      return NextResponse.json(
        { error: 'locationId is required' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'notification type is required' },
        { status: 400 }
      );
    }

    // Kirim notifikasi berdasarkan type
    switch (type) {
      case 'device_update': {
        // { deviceName, updateType, details, severity }
        const { deviceName, updateType, details, severity } = rest;
        if (!deviceName || !details) {
          return NextResponse.json(
            { error: 'deviceName and details are required for device_update' },
            { status: 400 }
          );
        }
        await sendDeviceUpdateToLocation(
          locationId,
          deviceName,
          updateType || 'alert',
          details,
          severity || 'info'
        );
        break;
      }

      case 'comment': {
        // { subject, author, comment, priority }
        const { subject, author, comment, priority } = rest;
        if (!subject || !author || !comment) {
          return NextResponse.json(
            { error: 'subject, author, and comment are required for comment type' },
            { status: 400 }
          );
        }
        await sendCommentUpdateToLocation(
          locationId,
          subject,
          author,
          comment,
          priority || 'normal'
        );
        break;
      }

      case 'absensi': {
        // { employeeName, status, time, details }
        const { employeeName, status, time, details } = rest;
        if (!employeeName || !status || !time) {
          return NextResponse.json(
            { error: 'employeeName, status, and time are required for absensi type' },
            { status: 400 }
          );
        }
        await sendAbsensiUpdateToLocation(
          locationId,
          employeeName,
          status,
          time,
          details
        );
        break;
      }

      case 'price_update': {
        // { item, currentPrice, targetPrice, supplier, notes }
        const { item, currentPrice, targetPrice, supplier, notes } = rest;
        if (!item || !currentPrice || !targetPrice || !supplier) {
          return NextResponse.json(
            { error: 'item, currentPrice, targetPrice, and supplier are required for price_update type' },
            { status: 400 }
          );
        }
        await sendPriceUpdateToLocation(
          locationId,
          item,
          currentPrice,
          targetPrice,
          supplier,
          notes
        );
        break;
      }

      case 'general': {
        // { message, notificationType, level }
        const { message, notificationType, level } = rest;
        if (!message) {
          return NextResponse.json(
            { error: 'message is required for general type' },
            { status: 400 }
          );
        }
        await sendToLocation(
          locationId,
          message,
          notificationType || 'general',
          level || 'INFO'
        );
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: true, message: `Notification sent to location ${locationId}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
