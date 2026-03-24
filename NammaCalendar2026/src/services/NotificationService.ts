/**
 * NotificationService.ts
 * ⚠️  setNotificationHandler() is NOT here — it lives in app/_layout.tsx
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface Reminder {
  id: string; title: string; date: string; time: string;
  type: 'festival' | 'personal' | 'muhurtham';
  repeat: 'none' | 'daily' | 'weekly' | 'yearly';
  enabled: boolean;
}

export const NotificationService = {
  async init(): Promise<boolean> {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return false;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('namma-calendar', {
        name: 'Namma Calendar', importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250], lightColor: '#E8600A', sound: 'default',
      });
    }
    return true;
  },

  async scheduleReminder(reminder: Reminder): Promise<string> {
    const [hour, minute] = reminder.time.split(':').map(Number);
    const [year, month, day] = reminder.date.split('-').map(Number);
    let trigger: Notifications.NotificationTriggerInput;
    if (reminder.repeat === 'daily') {
      trigger = { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute };
    } else if (reminder.repeat === 'weekly') {
      const weekday = new Date(year, month - 1, day).getDay() + 1;
      trigger = { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, weekday, hour, minute };
    } else if (reminder.repeat === 'yearly') {
      trigger = { type: Notifications.SchedulableTriggerInputTypes.YEARLY, month, day, hour, minute };
    } else {
      trigger = { type: Notifications.SchedulableTriggerInputTypes.CALENDAR, year, month, day, hour, minute, second: 0, repeats: false };
    }
    return Notifications.scheduleNotificationAsync({
      content: { title: '🕉 நம்ம Calendar', body: reminder.title, data: { reminderId: reminder.id, type: reminder.type }, color: '#E8600A', sound: 'default', ...(Platform.OS === 'android' && { channelId: 'namma-calendar' }) },
      trigger,
    });
  },

  async scheduleDailyPanchangam(): Promise<string> {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    for (const n of all) {
      if ((n.content.data as any)?.type === 'daily_panchangam')
        await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
    return Notifications.scheduleNotificationAsync({
      content: { title: '🌙 நாளை நல்ல நேரம்', body: "Tap to view tomorrow's auspicious timings", data: { type: 'daily_panchangam' }, color: '#E8600A', sound: 'default', ...(Platform.OS === 'android' && { channelId: 'namma-calendar' }) },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: 20, minute: 0 },
    });
  },

  async cancelReminder(id: string) { await Notifications.cancelScheduledNotificationAsync(id); },
  async cancelAll()                { await Notifications.cancelAllScheduledNotificationsAsync(); },
  async getAll()                   { return Notifications.getAllScheduledNotificationsAsync(); },
};