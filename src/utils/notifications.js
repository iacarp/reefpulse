// ============================================================
// REEFPULSE — Notifications
// Web: no-op (avoids native module errors)
// Native (EAS build): uses expo-notifications
// To enable native: npm install expo-notifications expo-device
// and add "expo-notifications" to plugins in app.json
// ============================================================
import { Platform } from 'react-native';

const IS_WEB = Platform.OS === 'web';

export async function requestNotificationPermissions() {
  if (IS_WEB) return false;
  try {
    const N = require('expo-notifications');
    const D = require('expo-device');
    if (!D.isDevice) return false;
    const { status } = await N.requestPermissionsAsync();
    if (status === 'granted' && Platform.OS === 'android') {
      await N.setNotificationChannelAsync('reefpulse', { name: 'ReefPulse', importance: 4 });
    }
    return status === 'granted';
  } catch { return false; }
}

export async function sendParamAlert(name, value, unit, dir) {
  if (IS_WEB) return;
  try {
    const N = require('expo-notifications');
    await N.scheduleNotificationAsync({
      content: { title: `⚠️ ${name}`, body: `${name}: ${value} ${unit} (${dir})`, sound: true },
      trigger: null,
    });
  } catch {}
}

export async function scheduleTestReminder(weekday, hour = 10) {
  if (IS_WEB) return 'web';
  try {
    const N = require('expo-notifications');
    return await N.scheduleNotificationAsync({
      content: { title: '🧪 Test Day!', body: 'Time to test water parameters.', sound: true },
      trigger: { type: 'weekly', weekday, hour, minute: 0, repeats: true },
    });
  } catch { return null; }
}

export async function scheduleMaintenanceReminder(name, days) {
  if (IS_WEB) return 'web';
  try {
    const N = require('expo-notifications');
    const d = new Date(); d.setDate(d.getDate() + days); d.setHours(9, 0, 0, 0);
    return await N.scheduleNotificationAsync({
      content: { title: `⚙️ ${name}`, body: `${name} maintenance due.`, sound: true },
      trigger: d,
    });
  } catch { return null; }
}

export async function cancelNotification(id) {
  if (IS_WEB) return;
  try { const N = require('expo-notifications'); await N.cancelScheduledNotificationAsync(id); } catch {}
}

export async function cancelAllNotifications() {
  if (IS_WEB) return;
  try { const N = require('expo-notifications'); await N.cancelAllScheduledNotificationsAsync(); } catch {}
}

export async function getScheduledNotifications() {
  if (IS_WEB) return [];
  try { const N = require('expo-notifications'); return await N.getAllScheduledNotificationsAsync(); } catch { return []; }
}

export async function scheduleTaskReminder(taskText, date, hour, minute = 0) {
  if (IS_WEB) return 'web';
  try {
    const N = require('expo-notifications');
    const trigger = new Date(date);
    trigger.setHours(hour, minute, 0, 0);
    if (trigger <= new Date()) return null; // past
    return await N.scheduleNotificationAsync({
      content: {
        title: '📋 Task Reminder',
        body: taskText,
        sound: true,
      },
      trigger,
    });
  } catch { return null; }
}
