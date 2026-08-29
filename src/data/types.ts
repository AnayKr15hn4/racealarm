export interface Series {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  sessionTypes: string[];
  featured?: boolean;
}

export interface RaceEvent {
  id: string;
  seriesId: string;
  name: string;
  country: string;
  countryCode: string;
  circuit: string;
  sessions: Session[];
}

export interface Session {
  id: string;
  eventId: string;
  seriesId: string;
  type: string;
  dateUTC: string; // ISO string
  durationMinutes: number;
}

export interface AlarmConfig {
  sessionId: string;
  offsetMinutes: number;
  alarmType: 'soft' | 'moderate' | 'aggressive';
  enabled: boolean;
}

export interface UserSettings {
  oddHoursStart: number; // 0-23
  oddHoursEnd: number;   // 0-23
  defaultOffset: number;
  defaultAlarmType: 'soft' | 'moderate' | 'aggressive';
  oddTimeAlarmType: 'soft' | 'moderate' | 'aggressive';
  normalTimeAlarmType: 'soft' | 'moderate' | 'aggressive';
  timezone: string;
  enabledSeries: string[];
  sessionTypeFilters: string[];
  alarms: AlarmConfig[];
}

export type ViewMode = 'series' | 'calendar' | 'settings';
