import AsyncStorage from '@react-native-async-storage/async-storage';

const get = async (k) => { try { const d = await AsyncStorage.getItem(k); return d ? JSON.parse(d) : null; } catch { return null; } };
const set = async (k, v) => { try { await AsyncStorage.setItem(k, JSON.stringify(v)); } catch {} };

export async function getDatabase() { return true; }
export async function addEntry(entry) { const e = (await get('entries')) || []; entry.id = Date.now(); e.push(entry); await set('entries', e); return entry.id; }
export async function getAllEntries() { const e = (await get('entries')) || []; return e.sort((a, b) => new Date(a.date) - new Date(b.date)); }
export async function deleteEntry(id) { const e = (await get('entries')) || []; await set('entries', e.filter(x => x.id !== id)); }
export async function addLivestock(refId, type) { const l = (await get('livestock')) || []; l.push({ id: Date.now(), ref_id: refId, type, added_date: new Date().toISOString() }); await set('livestock', l); }
export async function removeLivestock(refId, type) { const l = (await get('livestock')) || []; await set('livestock', l.filter(x => !(x.ref_id === refId && x.type === type))); }
export async function getMyLivestock() { return (await get('livestock')) || []; }
export async function addEquipment(eq) { const l = (await get('equipment')) || []; eq.id = Date.now(); l.push(eq); await set('equipment', l); return eq.id; }
export async function getMyEquipment() { return (await get('equipment')) || []; }
export async function removeEquipment(id) { const l = (await get('equipment')) || []; await set('equipment', l.filter(e => e.id !== id)); }
export async function logMaintenance(id) { const l = (await get('equipment')) || []; const i = l.findIndex(e => e.id === id); if (i >= 0) { l[i].last_maintenance = new Date().toISOString(); await set('equipment', l); } }
export async function getMaintenanceLog() { return []; }
export async function getAlertSettings() { return (await get('alert_settings')) || []; }
export async function acknowledgeAlert(p, d) { const s = (await get('alert_settings')) || []; const i = s.findIndex(x => x.param === p && x.direction === d); if (i >= 0) s[i] = { ...s[i], status: 'acknowledged' }; else s.push({ param: p, direction: d, status: 'acknowledged', ignore_count: 0 }); await set('alert_settings', s); }
export async function ignoreAlert(p, d) { const s = (await get('alert_settings')) || []; const i = s.findIndex(x => x.param === p && x.direction === d); let c = 1; if (i >= 0) { c = (s[i].ignore_count || 0) + 1; s[i] = { ...s[i], status: 'ignored', ignore_count: c }; } else s.push({ param: p, direction: d, status: 'ignored', ignore_count: 1 }); await set('alert_settings', s); return c; }
export async function resetAlertSetting(p, d) { const s = (await get('alert_settings')) || []; await set('alert_settings', s.filter(x => !(x.param === p && x.direction === d))); }
export async function getActiveExtraParams() { return (await get('extra_params')) || []; }
export async function toggleExtraParam(key, active) { let p = (await get('extra_params')) || []; if (active) { if (!p.includes(key)) p.push(key); } else p = p.filter(k => k !== key); await set('extra_params', p); }
export async function getPreference(k, def = null) { const p = (await get('prefs')) || {}; return p[k] !== undefined ? p[k] : def; }
export async function setPreference(k, v) { const p = (await get('prefs')) || {}; p[k] = v; await set('prefs', p); }
export async function getReminders() { return (await get('reminders')) || []; }
export async function addReminder(r) { const list = (await get('reminders')) || []; r.id = Date.now(); list.push(r); await set('reminders', list); return r; }
export async function removeReminder(id) { const list = (await get('reminders')) || []; await set('reminders', list.filter(r => r.id !== id)); }

// ── DOSING CALCULATOR ──
export async function getTankConfig() { return (await get('tank_config')) || null; }
export async function setTankConfig(cfg) { await set('tank_config', cfg); }
export async function getDosingLog() { return (await get('dosing_log')) || []; }
export async function addDosingEntry(entry) { const l = (await get('dosing_log')) || []; entry.id = Date.now(); entry.date = new Date().toISOString(); l.unshift(entry); await set('dosing_log', l.slice(0, 200)); }
export async function deleteDosingEntry(id) { const l = (await get('dosing_log')) || []; await set('dosing_log', l.filter(e => e.id !== id)); }
export async function getCustomDoses() { return (await get('custom_doses')) || {}; }
export async function setCustomDose(key, val) { const d = (await get('custom_doses')) || {}; d[key] = val; await set('custom_doses', d); }
