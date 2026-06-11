import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

export type DeviceSession = {
  id: string;
  username: string;
  ip: string;
  userAgent?: string | null;
  createdAt: string;
};

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(SESSIONS_FILE);
  } catch (err) {
    await fs.writeFile(SESSIONS_FILE, '[]', 'utf8');
  }
}

export async function addDeviceSession(session: DeviceSession) {
  await ensureFile();
  const raw = await fs.readFile(SESSIONS_FILE, 'utf8');
  let arr: DeviceSession[] = [];
  try {
    arr = JSON.parse(raw || '[]');
  } catch (e) {
    arr = [];
  }
  arr.push(session);
  await fs.writeFile(SESSIONS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

export async function listDeviceSessions() {
  await ensureFile();
  const raw = await fs.readFile(SESSIONS_FILE, 'utf8');
  try {
    return JSON.parse(raw) as DeviceSession[];
  } catch (e) {
    return [];
  }
}

export default {
  addDeviceSession,
  listDeviceSessions,
};
