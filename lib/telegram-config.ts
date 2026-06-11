/**
 * Konfigurasi Telegram untuk setiap location/team teknisi
 * Mapping: Location ID → Group Chat ID
 */

export interface TelegramLocation {
  id: string;
  name: string;
  chatId: string;
  description?: string;
}

export const TELEGRAM_LOCATIONS: TelegramLocation[] = [
  {
    id: 'TNS001',
    name: 'Lokasi TNS 001',
    chatId: '-5131258468',
    description: 'Group Telegram untuk tim teknisi TNS 001'
  },
  {
    id: 'TNS002',
    name: 'Lokasi TNS 002',
    chatId: 'MASUKKAN_CHAT_ID_TNS002_DI_SINI',
    description: 'Group Telegram untuk tim teknisi TNS 002'
  },
  {
    id: 'TNS003',
    name: 'Lokasi TNS 003',
    chatId: 'MASUKKAN_CHAT_ID_TNS003_DI_SINI',
    description: 'Group Telegram untuk tim teknisi TNS 003'
  },
  // Tambah locations lainnya di sini
];

export const getTelegramChatIdByLocation = (locationId: string): string | null => {
  const location = TELEGRAM_LOCATIONS.find(
    loc => loc.id.toLowerCase() === locationId.toLowerCase()
  );
  return location?.chatId || null;
};

export const getLocationName = (locationId: string): string => {
  const location = TELEGRAM_LOCATIONS.find(
    loc => loc.id.toLowerCase() === locationId.toLowerCase()
  );
  return location?.name || locationId;
};

export const getAllLocations = (): TelegramLocation[] => {
  return TELEGRAM_LOCATIONS;
};
