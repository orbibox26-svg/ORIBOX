import fs from 'fs/promises';
import path from 'path';

type AlertLevel = 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
type TeamGroup = 'teknisi' | 'admin' | 'umum';

interface TelegramConfig {
  groups: {
    [key: string]: {
      name: string;
      chatId: string;
      description: string;
    };
  };
  alertLevels: {
    [key: string]: string;
  };
}

let telegramConfig: TelegramConfig | null = null;

async function loadConfig(): Promise<TelegramConfig> {
  if (telegramConfig) return telegramConfig;

  try {
    const configPath = path.join(process.cwd(), 'data', 'telegram-config.json');
    const data = await fs.readFile(configPath, 'utf-8');
    telegramConfig = JSON.parse(data);
    return telegramConfig;
  } catch (e) {
    console.warn('Could not load telegram config, using env vars only');
    return {
      groups: {},
      alertLevels: {
        ERROR: '🔴',
        WARNING: '🟡',
        INFO: '🔵',
        SUCCESS: '🟢',
      },
    };
  }
}

export async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  if (!botToken || !chatId) {
    throw new Error('Telegram bot token or chat id not configured');
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram API error: ${res.status} ${body}`);
  }

  return res.json();
}

/**
 * Send alert ke grup tertentu (teknisi, admin, umum)
 */
export async function sendToTeam(
  teamGroup: TeamGroup,
  message: string,
  level: AlertLevel = 'INFO'
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN not configured');
    return;
  }

  const config = await loadConfig();
  const group = config.groups[teamGroup];

  if (!group || !group.chatId || group.chatId.includes('Isi dengan')) {
    console.warn(`Telegram group '${teamGroup}' not properly configured`);
    return;
  }

  const emoji = config.alertLevels[level] || '•';
  const formattedMessage = `${emoji} <b>${level}</b>\n${message}\n<i>Time: ${new Date().toLocaleString()}</i>`;

  try {
    await sendTelegramMessage(botToken, group.chatId, formattedMessage);
  } catch (error) {
    console.error(`Failed to send Telegram message to ${teamGroup}:`, error);
  }
}

/**
 * Send alert ke semua grup sekaligus
 */
export async function sendToAllTeams(message: string, level: AlertLevel = 'INFO') {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  if (!botToken) {
    console.warn('TELEGRAM_BOT_TOKEN not configured');
    return;
  }

  const config = await loadConfig();
  const groups = Object.keys(config.groups) as TeamGroup[];

  console.log(`Sending to ${groups.length} teams...`);

  for (const group of groups) {
    await sendToTeam(group, message, level);
  }
}

/**
 * Send device alert (untuk teknisi)
 */
export async function sendDeviceAlert(
  deviceName: string,
  location: string,
  issue: string,
  severity: 'critical' | 'warning' | 'info' = 'warning'
) {
  const level: AlertLevel =
    severity === 'critical' ? 'ERROR' : severity === 'warning' ? 'WARNING' : 'INFO';

  const message = `
<b>Device Alert</b>
<b>Device:</b> ${deviceName}
<b>Location:</b> ${location}
<b>Issue:</b> ${issue}
<b>Severity:</b> ${severity.toUpperCase()}
`;

  await sendToTeam('teknisi', message, level);
}

/**
 * Send login activity notification
 */
export async function sendLoginNotification(
  username: string,
  ip: string,
  userAgent: string | null,
  timestamp: string
) {
  const message = `
<b>Login Activity</b>
<b>User:</b> ${username}
<b>IP Address:</b> ${ip}
<b>Device:</b> ${userAgent ? userAgent.substring(0, 50) + '...' : 'Unknown'}
<b>Time:</b> ${timestamp}
`;

  await sendToTeam('admin', message, 'INFO');
}

/**
 * Send attendance report notification
 */
export async function sendAttendanceAlert(
  employeeName: string,
  status: 'late' | 'absent' | 'present',
  time: string,
  reason?: string
) {
  const statusEmoji = status === 'late' ? '⏰' : status === 'absent' ? '❌' : '✅';
  const message = `
${statusEmoji} <b>${status.toUpperCase()}</b>
<b>Employee:</b> ${employeeName}
<b>Time:</b> ${time}
${reason ? `<b>Reason:</b> ${reason}` : ''}
`;

  await sendToTeam('admin', message, 'INFO');
}

/**
 * Send system status update
 */
export async function sendSystemAlert(subject: string, details: string, level: AlertLevel = 'INFO') {
  const message = `<b>${subject}</b>\n\n${details}`;
  await sendToAllTeams(message, level);
}
