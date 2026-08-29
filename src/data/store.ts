import { UserSettings, AlarmConfig } from './types';

const STORAGE_KEY = 'gridflag_settings';

export function getDefaultSettings(): UserSettings {
  return {
    oddHoursStart: 20,
    oddHoursEnd: 7,
    defaultOffset: 15,
    defaultAlarmType: 'moderate',
    oddTimeAlarmType: 'aggressive',
    normalTimeAlarmType: 'soft',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    enabledSeries: ['f1', 'wec', 'imsa', 'motogp', 'dtm', 'gtwc'],
    sessionTypeFilters: ['Race', 'Qualifying', 'Sprint', 'Sprint Qualifying'],
    alarms: [],
  };
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return getDefaultSettings();
}

export function saveSettings(s: UserSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function isOddTime(dateUTC: string, settings: UserSettings): boolean {
  const d = new Date(dateUTC);
  const local = new Date(d.toLocaleString('en-US', { timeZone: settings.timezone }));
  const h = local.getHours();
  if (settings.oddHoursStart > settings.oddHoursEnd) {
    return h >= settings.oddHoursStart || h < settings.oddHoursEnd;
  }
  return h >= settings.oddHoursStart && h < settings.oddHoursEnd;
}

export function getAlarmForSession(sessionId: string, settings: UserSettings): AlarmConfig | undefined {
  return settings.alarms.find(a => a.sessionId === sessionId);
}

export function toggleAlarm(sessionId: string, seriesId: string, dateUTC: string, settings: UserSettings): UserSettings {
  const existing = settings.alarms.find(a => a.sessionId === sessionId);
  if (existing) {
    return { ...settings, alarms: settings.alarms.filter(a => a.sessionId !== sessionId) };
  }
  const odd = isOddTime(dateUTC, settings);
  const newAlarm: AlarmConfig = {
    sessionId,
    offsetMinutes: settings.defaultOffset,
    alarmType: odd ? settings.oddTimeAlarmType : settings.normalTimeAlarmType,
    enabled: true,
  };
  return { ...settings, alarms: [...settings.alarms, newAlarm] };
}

export function updateAlarm(sessionId: string, updates: Partial<AlarmConfig>, settings: UserSettings): UserSettings {
  return {
    ...settings,
    alarms: settings.alarms.map(a => a.sessionId === sessionId ? { ...a, ...updates } : a),
  };
}

export function formatLocalTime(dateUTC: string, tz: string): string {
  return new Date(dateUTC).toLocaleString('en-US', {
    timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function formatTimeOnly(dateUTC: string, tz: string): string {
  return new Date(dateUTC).toLocaleString('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true,
  });
}

export function getRelativeTime(dateUTC: string): string {
  const now = Date.now();
  const target = new Date(dateUTC).getTime();
  const diff = target - now;
  if (diff < 0) return 'Past';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  if (d > 30) return `${Math.floor(d / 30)}mo`;
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function scheduleNotification(session: { type: string; dateUTC: string }, eventName: string, alarm: AlarmConfig) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
    return;
  }
  if (Notification.permission !== 'granted') return;
  const fireAt = new Date(session.dateUTC).getTime() - alarm.offsetMinutes * 60000;
  const delay = fireAt - Date.now();
  if (delay <= 0) return;
  setTimeout(() => {
    new Notification(`🏁 ${eventName} – ${session.type}`, {
      body: `Starting in ${alarm.offsetMinutes} minutes!`,
      icon: '/vite.svg',
      tag: `gridflag-${session.dateUTC}`,
      requireInteraction: alarm.alarmType === 'aggressive',
    });
    if (alarm.alarmType === 'aggressive') {
      let count = 0;
      const interval = setInterval(() => {
        count++;
        if (count >= 5) { clearInterval(interval); return; }
        new Notification(`⚠️ WAKE UP! ${eventName} – ${session.type}`, {
          body: `Starting in ${Math.max(0, alarm.offsetMinutes - count)}min!`,
          tag: `gridflag-repeat-${count}`,
          requireInteraction: true,
        });
      }, 60000);
    }
  }, delay);
}
