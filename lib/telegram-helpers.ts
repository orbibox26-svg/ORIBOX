/**
 * Helper functions untuk mengirim notifikasi Telegram
 * Digunakan di berbagai endpoints API
 */

import {
  sendToLocation,
  sendDeviceUpdateToLocation,
  sendCommentUpdateToLocation,
  sendAbsensiUpdateToLocation,
  sendPriceUpdateToLocation,
} from './telegram';

/**
 * Notifikasi ketika ada comment baru di location
 * Gunakan ini saat create/update comment
 */
export async function notifyNewComment(
  locationId: string,
  subject: string,
  authorName: string,
  commentText: string,
  isPriority: boolean = false
) {
  try {
    await sendCommentUpdateToLocation(
      locationId,
      subject,
      authorName,
      commentText,
      isPriority ? 'high' : 'normal'
    );
  } catch (error) {
    console.error('Failed to notify comment:', error);
    // Don't throw - notification failure shouldn't break main flow
  }
}

/**
 * Notifikasi device status/alert
 * Gunakan ini saat ada device status update atau error
 */
export async function notifyDeviceStatus(
  locationId: string,
  deviceName: string,
  updateType: 'status' | 'alert' | 'maintenance' | 'repair',
  description: string,
  isCritical: boolean = false
) {
  try {
    await sendDeviceUpdateToLocation(
      locationId,
      deviceName,
      updateType,
      description,
      isCritical ? 'critical' : updateType === 'alert' ? 'warning' : 'info'
    );
  } catch (error) {
    console.error('Failed to notify device status:', error);
  }
}

/**
 * Notifikasi absensi
 * Gunakan ini saat ada absensi check-in/late/absent
 */
export async function notifyAbsensi(
  locationId: string,
  employeeName: string,
  status: 'present' | 'late' | 'absent',
  checkInTime: string,
  reason?: string
) {
  try {
    await sendAbsensiUpdateToLocation(
      locationId,
      employeeName,
      status,
      checkInTime,
      reason
    );
  } catch (error) {
    console.error('Failed to notify absensi:', error);
  }
}

/**
 * Notifikasi pencarian harga
 * Gunakan ini saat ada price update atau supplier offer
 */
export async function notifyPriceUpdate(
  locationId: string,
  itemName: string,
  currentPrice: string,
  targetPrice: string,
  supplierName: string,
  additionalNotes?: string
) {
  try {
    await sendPriceUpdateToLocation(
      locationId,
      itemName,
      currentPrice,
      targetPrice,
      supplierName,
      additionalNotes
    );
  } catch (error) {
    console.error('Failed to notify price update:', error);
  }
}

/**
 * Notifikasi umum dengan custom message
 */
export async function notifyLocationUpdate(
  locationId: string,
  title: string,
  message: string,
  isImportant: boolean = false
) {
  try {
    await sendToLocation(
      locationId,
      `<b>${title}</b>\n\n${message}`,
      'general',
      isImportant ? 'WARNING' : 'INFO'
    );
  } catch (error) {
    console.error('Failed to notify location update:', error);
  }
}

/**
 * Contoh: Notifikasi ketika daftar penghuni baru
 */
export async function notifyNewResident(
  locationId: string,
  residentName: string,
  unitNumber: string,
  moveInDate: string
) {
  try {
    const message = `
<b>Penghuni Baru</b>
<b>Nama:</b> ${residentName}
<b>Unit:</b> ${unitNumber}
<b>Tanggal Masuk:</b> ${moveInDate}
`;
    await sendToLocation(locationId, message, 'general', 'INFO');
  } catch (error) {
    console.error('Failed to notify new resident:', error);
  }
}

/**
 * Contoh: Notifikasi maintenance/perbaikan
 */
export async function notifyMaintenance(
  locationId: string,
  maintenanceType: string,
  location: string,
  description: string,
  requiredAction?: string
) {
  try {
    const message = `
<b>Maintenance Required</b>
<b>Type:</b> ${maintenanceType}
<b>Location:</b> ${location}
<b>Description:</b> ${description}
${requiredAction ? `<b>Action:</b> ${requiredAction}` : ''}
`;
    await sendToLocation(locationId, message, 'general', 'WARNING');
  } catch (error) {
    console.error('Failed to notify maintenance:', error);
  }
}
