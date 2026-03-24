import * as SQLite from 'expo-sqlite';
import { PlannerNote, Reminder, UserProfile } from '@types/index';

const db = SQLite.openDatabaseSync('namma_calendar.db');

export const DatabaseService = {
  init() {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        body TEXT,
        createdAt TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reminders (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        type TEXT NOT NULL,
        repeat TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 1
      );
      CREATE TABLE IF NOT EXISTS profile (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);
  },

  // ── Notes ──────────────────────────────────────────────
  getNotes(): PlannerNote[] {
    return db.getAllSync<PlannerNote>('SELECT * FROM notes ORDER BY date DESC');
  },
  saveNote(note: PlannerNote) {
    db.runSync(
      'INSERT OR REPLACE INTO notes VALUES (?,?,?,?,?)',
      [note.id, note.date, note.title, note.body, note.createdAt]
    );
  },
  deleteNote(id: string) {
    db.runSync('DELETE FROM notes WHERE id = ?', [id]);
  },

  // ── Reminders ──────────────────────────────────────────
  getReminders(): Reminder[] {
    const rows = db.getAllSync<any>('SELECT * FROM reminders ORDER BY date ASC');
    return rows.map(r => ({ ...r, enabled: r.enabled === 1 }));
  },
  saveReminder(r: Reminder) {
    db.runSync(
      'INSERT OR REPLACE INTO reminders VALUES (?,?,?,?,?,?,?)',
      [r.id, r.title, r.date, r.time, r.type, r.repeat, r.enabled ? 1 : 0]
    );
  },
  deleteReminder(id: string) {
    db.runSync('DELETE FROM reminders WHERE id = ?', [id]);
  },

  // ── Profile ────────────────────────────────────────────
  getProfile(): UserProfile | null {
    const row = db.getFirstSync<{ data: string }>('SELECT data FROM profile WHERE id = "user"');
    return row ? JSON.parse(row.data) : null;
  },
  saveProfile(profile: UserProfile) {
    db.runSync(
      'INSERT OR REPLACE INTO profile VALUES (?,?)',
      ['user', JSON.stringify(profile)]
    );
  },
};
