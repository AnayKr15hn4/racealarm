import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERIES } from './data/series';
import { EVENTS, FLAGS, LANDMARK_EVENTS } from './data/events';
import { UserSettings, ViewMode, RaceEvent, Session, AlarmConfig } from './data/types';
import { loadSettings, saveSettings, isOddTime, toggleAlarm, updateAlarm, getAlarmForSession, formatLocalTime, formatTimeOnly, getRelativeTime, scheduleNotification } from './data/store';

// --- Icons (Apple SF Symbol Style) ---
function IconRaces({ active }: { active?: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
  );
}

function IconCalendar({ active }: { active?: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  );
}

function IconSettings({ active }: { active?: boolean }) {
  return active ? (
    <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  );
}

function IconChevronRight() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>;
}

function IconClose() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function IconBell({ active, filled }: { active?: boolean; filled?: boolean }) {
  if (filled) return <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="100%" height="100%"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
}

const OFFSETS = [0, 5, 10, 15, 30, 45, 60];

function getAliases(name: string, shortName: string) {
  const aliases = [name.toLowerCase(), shortName.toLowerCase()];
  if (shortName === 'F1') aliases.push('formula 1', 'f one', 'formula one');
  if (shortName === 'WEC') aliases.push('world endurance championship');
  return aliases;
}

// --- Detail Sheet Component ---
function EventDetailSheet({ event, settings, onClose, onSettings }: { event: RaceEvent; settings: UserSettings; onClose: () => void; onSettings: (s: UserSettings) => void }) {
  const series = SERIES.find(s => s.id === event.seriesId);
  const flag = FLAGS[event.countryCode] || '🏁';
  const isLandmark = LANDMARK_EVENTS.has(event.id);
  // Show all sessions if no filters, or filter by session type
  const filtered = event.sessions.filter(s => settings.sessionTypeFilters.length === 0 || settings.sessionTypeFilters.some(f => s.type.toLowerCase().includes(f.toLowerCase())));

  return (
    <>
      <motion.div className="detail-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="detail-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={(e, info) => { if (info.offset.y > 100) onClose(); }}>
        <div className="detail-handle" />
        <div className="detail-header">
          <div className="detail-hero">
            <span style={{ fontSize: 40, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>{flag}</span>
            <div className="detail-hero-badge" style={{ background: series?.color || '#000' }}>{series?.shortName}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="detail-title" style={isLandmark ? { color: 'var(--gold)' } : {}}>{event.name} {isLandmark && <span className="landmark-star">★</span>}</h2>
            <p className="detail-sub">{event.circuit}</p>
            <div className="detail-meta">
              <span className="detail-meta-item">{event.country}</span>
              <span className="detail-meta-item" style={{ color: 'var(--tint)', fontWeight: 500 }}>{filtered.length} Sessions</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-grouped)', border: 'none', borderRadius: '50%', width: 30, height: 30, color: 'var(--label-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><IconClose /></button>
        </div>

        {filtered.length > 0 && (
          <div className="session-group-title">
            {formatLocalTime(filtered[0]?.dateUTC || '', settings.timezone).split(',')[0]}
          </div>
        )}

        <div style={{ paddingBottom: 20 }}>
          {filtered.map(s => {
            const alarm = getAlarmForSession(s.id, settings);
            const odd = isOddTime(s.dateUTC, settings);
            const isPast = new Date(s.dateUTC).getTime() < Date.now();
            
            return (
              <div key={s.id} style={{ opacity: isPast ? 0.4 : 1 }}>
                <div className={`session-item ${odd && !isPast ? 'odd' : ''}`}>
                  <div className="session-dot" style={{ background: series?.color || 'var(--tint)' }} />
                  <div className="session-label">{s.type}</div>
                  {odd && !isPast && <span className="odd-tag">Odd Time</span>}
                  <div className={`session-time ${odd ? 'odd-time' : ''}`}>{formatTimeOnly(s.dateUTC, settings.timezone)}</div>
                  {!isPast && (
                    <button className={`alarm-btn ${alarm ? 'set' : ''}`} onClick={(e) => {
                      const ns = toggleAlarm(s.id, s.seriesId, s.dateUTC, settings);
                      onSettings(ns);
                      const a = getAlarmForSession(s.id, ns);
                      if (a) scheduleNotification(s, event.name, a);
                    }}>
                      <IconBell active={!!alarm} filled={!!alarm} />
                    </button>
                  )}
                </div>
                
                <AnimatePresence>
                  {alarm && !isPast && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                      <div className="alarm-popover">
                        <div className="alarm-row">
                          <span className="alarm-label">Alert before</span>
                          <div className="offset-ctrl">
                            <button className="offset-step" onClick={() => { const i = OFFSETS.indexOf(alarm.offsetMinutes); if (i > 0) onSettings(updateAlarm(s.id, { offsetMinutes: OFFSETS[i - 1] }, settings)); }}>−</button>
                            <span className="offset-val">{alarm.offsetMinutes === 0 ? 'Now' : `${alarm.offsetMinutes}m`}</span>
                            <button className="offset-step" onClick={() => { const i = OFFSETS.indexOf(alarm.offsetMinutes); if (i < OFFSETS.length - 1) onSettings(updateAlarm(s.id, { offsetMinutes: OFFSETS[i + 1] }, settings)); }}>+</button>
                          </div>
                        </div>
                        <div className="alarm-row">
                          <span className="alarm-label">Intensity</span>
                          <div className="intensity-row">
                            {(['soft', 'moderate', 'aggressive'] as const).map(t => (
                              <button key={t} className={`intensity-btn ${alarm.alarmType === t ? 'active' : ''}`} onClick={() => onSettings(updateAlarm(s.id, { alarmType: t }, settings))}>{t}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

// --- Main App Component ---
export default function App() {
  const [settings, setSettingsState] = useState<UserSettings>(loadSettings);
  const [view, setView] = useState<ViewMode>('series');
  const [activeSeries, setActiveSeries] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<RaceEvent | null>(null);
  const [notifAsked, setNotifAsked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const setSettings = useCallback((s: UserSettings) => { setSettingsState(s); saveSettings(s); }, []);

  useEffect(() => { if ('Notification' in window && Notification.permission === 'granted') setNotifAsked(true); }, []);

  // Dynamic Session Types based on active series
  const activeSeriesObj = SERIES.find(s => s.id === activeSeries);
  const availableSessionTypes = activeSeriesObj 
    ? activeSeriesObj.sessionTypes 
    : Array.from(new Set(SERIES.flatMap(s => s.sessionTypes)));

  const filteredEvents = EVENTS.filter(e => {
    // Remove events older than 2 weeks
    if (e.sessions.length > 0) {
      const lastSessionDate = new Date(e.sessions[e.sessions.length - 1].dateUTC).getTime();
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      if (lastSessionDate < twoWeeksAgo) return false;
    }
    
    if (activeSeries !== 'all' && e.seriesId !== activeSeries) return false;
    if (!settings.enabledSeries.includes(e.seriesId)) return false;
    
    // Filter out events that don't have the selected session types
    if (settings.sessionTypeFilters.length > 0 && settings.sessionTypeFilters.length !== availableSessionTypes.length) {
      const hasMatchingSession = e.sessions.some(s => 
        settings.sessionTypeFilters.some(f => s.type.toLowerCase() === f.toLowerCase())
      );
      if (!hasMatchingSession) return false;
    }

    // Filter by search query (Series only)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const s = SERIES.find(x => x.id === e.seriesId);
      const aliases = s ? getAliases(s.name, s.shortName) : [];
      if (!aliases.some(a => a.includes(q))) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    const aNext = a.sessions.find(s => new Date(s.dateUTC) > new Date())?.dateUTC || 'z';
    const bNext = b.sessions.find(s => new Date(s.dateUTC) > new Date())?.dateUTC || 'z';
    return aNext.localeCompare(bNext);
  });

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return SERIES.filter(s => {
       const aliases = getAliases(s.name, s.shortName);
       return aliases.some(a => a.includes(q));
    }).slice(0, 8);
  }, [searchQuery]);

  const toggleFilter = (type: string) => {
    const current = settings.sessionTypeFilters;
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    setSettings({ ...settings, sessionTypeFilters: next });
  };

  const handleSelectAll = () => {
    if (settings.sessionTypeFilters.length === availableSessionTypes.length) {
      setSettings({ ...settings, sessionTypeFilters: [] });
    } else {
      setSettings({ ...settings, sessionTypeFilters: [...availableSessionTypes] });
    }
  };

  const totalAlarms = settings.alarms.length;
  const isSeasonOver = filteredEvents.length === 0 && activeSeries !== 'all';
  
  // Quick Alarm Logic
  const activeFilters = settings.sessionTypeFilters;
  const showQuickAlarm = activeFilters.length === 1;
  const quickAlarmTarget = showQuickAlarm ? activeFilters[0] : null;

  return (
    <>
      <header className="app-header">
        <div className="header-inner" style={{ display: 'block', maxWidth: 600, margin: '0 auto', paddingBottom: 10 }}>
          <div className="header-top" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4 }}>
            <h1 className="large-title" style={{ padding: 0 }}>{view === 'series' ? 'Race Alarm' : view === 'calendar' ? 'Upcoming' : 'Settings'}</h1>
            <div className="header-avatar">RA</div>
          </div>
          {view === 'series' && <div style={{ fontSize: 13, color: 'var(--label-secondary)', fontWeight: 500, marginTop: 2 }}>Top Picks for You</div>}
        </div>
      </header>

      <main className="main">
        {view === 'series' || view === 'calendar' ? (
          <motion.div key="races" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            
            {!notifAsked && 'Notification' in window && (
              <div className="notif-banner">
                <div className="notif-icon"><IconBell filled /></div>
                <div className="notif-text">
                  <h4>Turn on Notifications</h4>
                  <p>Get alerted right before sessions start.</p>
                </div>
                <button className="notif-action" onClick={() => { Notification.requestPermission().then(() => setNotifAsked(true)); }}>Enable</button>
              </div>
            )}

            {/* Search Bar with Dropdown */}
            <div className="search-bar-container" style={{ position: 'relative' }}>
              <div className="search-bar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  placeholder="Search races, circuits, or series..." 
                  value={searchQuery} 
                  onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => { setSearchQuery(''); setShowDropdown(false); }}>
                    <IconClose />
                  </button>
                )}
              </div>
              
              <AnimatePresence>
                {showDropdown && searchQuery && (
                  <motion.div 
                    className="search-dropdown"
                    initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map(s => {
                        return (
                          <div key={s.id} className="search-result-item" onClick={() => { setActiveSeries(s.id); setSearchQuery(''); setShowDropdown(false); }}>
                            <div className="search-result-thumb" style={{ fontSize: 18 }}>{s.icon || '🏎️'}</div>
                            <div className="search-result-info">
                              <div className="search-result-title">{s.name}</div>
                              <div className="search-result-sub">{s.shortName}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--label-secondary)', fontSize: 13 }}>
                        No series found
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apple Music Style Series Cards */}
            <div className="scroll-row">
              <div className={`series-card ${activeSeries === 'all' ? 'active' : ''}`} onClick={() => setActiveSeries('all')}>
                <div className="series-card-bg" style={{ background: 'linear-gradient(135deg, #1c1c1e, #2c2c2e)' }} />
                <span className="series-card-count">{EVENTS.length} Events</span>
                <span className="series-card-name">All Series</span>
              </div>
              {SERIES.filter(s => s.featured).map(s => {
                const count = EVENTS.filter(e => e.seriesId === s.id).length;
                return (
                  <div key={s.id} className={`series-card ${activeSeries === s.id ? 'active' : ''}`} onClick={() => setActiveSeries(s.id)}>
                    <div className="series-card-bg" style={{ background: `linear-gradient(135deg, ${s.color}88, ${s.color})` }} />
                    <span className="series-card-count">{count} Events</span>
                    <span className="series-card-name">{s.name}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="section-header">Upcoming Events</h2>
            <p className="section-sub">{activeSeriesObj ? `${activeSeriesObj.name} Schedule` : 'Current 2026 season schedule.'}</p>

            {/* Dynamic Session Type Filters */}
            <div className="filter-section">
              <div className="filter-row">
                <button className={`filter-pill all-pill ${settings.sessionTypeFilters.length === availableSessionTypes.length ? 'active' : ''}`} onClick={handleSelectAll}>
                  {settings.sessionTypeFilters.length === availableSessionTypes.length ? 'All Sessions' : 'Select All'}
                </button>
                {availableSessionTypes.map(t => (
                  <button key={t} className={`filter-pill ${settings.sessionTypeFilters.includes(t) ? 'active' : ''}`} onClick={() => toggleFilter(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Event List */}
            {isSeasonOver ? (
              <div className="empty">
                <h3>Waiting for calendar</h3>
                <p>The 2026 season has concluded or the calendar has not yet been announced for this series.</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="empty">
                <h3>No Events Found</h3>
                <p>Adjust your session filters to see upcoming events.</p>
              </div>
            ) : (
              <div className="list-group">
                {filteredEvents.map(e => {
                  const flag = FLAGS[e.countryCode] || '🏁';
                  const series = SERIES.find(s => s.id === e.seriesId);
                  const isLandmark = LANDMARK_EVENTS.has(e.id);
                  const eventSessions = e.sessions.filter(s => settings.sessionTypeFilters.length === 0 || settings.sessionTypeFilters.some(f => s.type.toLowerCase().includes(f.toLowerCase())));
                  const nextSession = eventSessions.find(s => new Date(s.dateUTC).getTime() > Date.now());
                  const activeAlarmCount = eventSessions.filter(s => getAlarmForSession(s.id, settings)).length;

                  // Quick alarm target session
                  let quickAlarmSession = null;
                  let hasQuickAlarmSet = false;
                  if (showQuickAlarm && quickAlarmTarget) {
                    quickAlarmSession = e.sessions.find(s => s.type.toLowerCase() === quickAlarmTarget.toLowerCase() && new Date(s.dateUTC).getTime() > Date.now());
                    if (quickAlarmSession) {
                      hasQuickAlarmSet = !!getAlarmForSession(quickAlarmSession.id, settings);
                    }
                  }

                  return (
                    <div key={e.id} className={`event-row ${isLandmark ? 'landmark' : ''}`} onClick={(evt) => {
                      // Prevent opening detail sheet if quick alarm was clicked
                      if ((evt.target as HTMLElement).closest('.quick-alarm-btn')) return;
                      setSelectedEvent(e);
                    }}>
                      <div className="event-thumb">
                        <span style={{ fontSize: 32, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}>{flag}</span>
                        <div className="event-thumb-badge" style={{ background: series?.color || '#000' }}>{series?.shortName}</div>
                      </div>
                      <div className="event-info">
                        <div className="event-title">{e.name} {isLandmark && <span className="landmark-star">★</span>}</div>
                        <div className="event-subtitle">{e.circuit}</div>
                      </div>
                      <div className="event-right">
                        {quickAlarmSession && (
                          <button 
                            className={`quick-alarm-btn ${hasQuickAlarmSet ? 'set' : ''}`} 
                            title={`Alert for ${quickAlarmTarget}`}
                            onClick={(evt) => {
                              evt.stopPropagation();
                              const ns = toggleAlarm(quickAlarmSession!.id, quickAlarmSession!.seriesId, quickAlarmSession!.dateUTC, settings);
                              setSettings(ns);
                              const a = getAlarmForSession(quickAlarmSession!.id, ns);
                              if (a) scheduleNotification(quickAlarmSession!, e.name, a);
                            }}
                          >
                            <IconBell active={hasQuickAlarmSet} filled={hasQuickAlarmSet} />
                          </button>
                        )}
                        {!quickAlarmSession && activeAlarmCount > 0 && <span style={{ width: 16, height: 16, color: 'var(--tint)' }}><IconBell active filled /></span>}
                        {nextSession ? (
                          <span className="event-time-badge">{getRelativeTime(nextSession.dateUTC)}</span>
                        ) : (
                          <span className="event-time-badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--label-tertiary)' }}>Past</span>
                        )}
                        <span className="event-chevron"><IconChevronRight /></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <h2 className="section-header">Odd Hours Window</h2>
            <p className="section-sub">Sessions starting during these hours will be highlighted and use your preferred odd-time alert intensity.</p>
            <div className="list-group">
              <div className="setting-item">
                <div>
                  <div className="setting-name">Start Hour</div>
                  <div className="setting-detail">When odd hours begin</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min="0" max="23" value={settings.oddHoursStart} onChange={e => setSettings({ ...settings, oddHoursStart: +e.target.value })} />
                  <span className="setting-val accent">{settings.oddHoursStart}:00</span>
                </div>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-name">End Hour</div>
                  <div className="setting-detail">When odd hours end</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min="0" max="23" value={settings.oddHoursEnd} onChange={e => setSettings({ ...settings, oddHoursEnd: +e.target.value })} />
                  <span className="setting-val accent">{settings.oddHoursEnd}:00</span>
                </div>
              </div>
            </div>

            <h2 className="section-header">Alert Defaults</h2>
            <div className="list-group">
              <div className="setting-item">
                <div className="setting-name">Default Offset</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input type="range" min="0" max="60" step="5" value={settings.defaultOffset} onChange={e => setSettings({ ...settings, defaultOffset: +e.target.value })} />
                  <span className="setting-val accent">{settings.defaultOffset}m</span>
                </div>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-name">Odd Time Intensity</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['soft', 'moderate', 'aggressive'] as const).map(t => (
                    <button key={t} className={`intensity-btn ${settings.oddTimeAlarmType === t ? 'active' : ''}`} onClick={() => setSettings({ ...settings, oddTimeAlarmType: t })} style={{ padding: '4px 10px', fontSize: 11 }}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="setting-item">
                <div>
                  <div className="setting-name">Normal Time Intensity</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {(['soft', 'moderate', 'aggressive'] as const).map(t => (
                    <button key={t} className={`intensity-btn ${settings.normalTimeAlarmType === t ? 'active' : ''}`} onClick={() => setSettings({ ...settings, normalTimeAlarmType: t })} style={{ padding: '4px 10px', fontSize: 11 }}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            <h2 className="section-header">System Info</h2>
            <div className="list-group">
              <div className="setting-item">
                <div className="setting-name">Timezone</div>
                <span className="setting-val" style={{ fontSize: 14 }}>{settings.timezone}</span>
              </div>
              <div className="setting-item">
                <div className="setting-name">Total Active Alerts</div>
                <span className="setting-val">{totalAlarms}</span>
              </div>
            </div>

            {totalAlarms > 0 && (
              <button className="clear-btn" onClick={() => setSettings({ ...settings, alarms: [] })}>Clear All Alerts</button>
            )}
          </motion.div>
        )}
      </main>

      {/* Detail Sheet Overlay */}
      <AnimatePresence>
        {selectedEvent && (
          <EventDetailSheet event={selectedEvent} settings={settings} onClose={() => setSelectedEvent(null)} onSettings={setSettings} />
        )}
      </AnimatePresence>

      <nav className="tab-bar">
        <button className={`tab-btn ${view === 'series' ? 'active' : ''}`} onClick={() => setView('series')}>
          <IconRaces active={view === 'series'} /><span>Home</span>
        </button>
        <button className={`tab-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>
          <IconCalendar active={view === 'calendar'} /><span>Calendar</span>
          {totalAlarms > 0 && <span className="tab-badge">{totalAlarms}</span>}
        </button>
        <button className={`tab-btn ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}>
          <IconSettings active={view === 'settings'} /><span>Settings</span>
        </button>
      </nav>
    </>
  );
}
