const otps: Map<string, { code: string; expires: number }> = new Map();

export function createOTP(username: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
  otps.set(username, { code, expires });
  return code;
}

export function verifyOTP(username: string, code: string) {
  const entry = otps.get(username);
  if (!entry) return false;
  if (Date.now() > entry.expires) {
    otps.delete(username);
    return false;
  }
  const ok = entry.code === code;
  if (ok) otps.delete(username);
  return ok;
}

export function clearOTP(username: string) {
  otps.delete(username);
}

export function _debugList() {
  return Array.from(otps.entries());
}
