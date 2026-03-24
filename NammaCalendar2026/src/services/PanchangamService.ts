/**
 * PanchangamService
 * Loads pre-computed 2026 Panchangam data from local JSON (fully offline).
 * The data/panchangam2026.json file holds all 365 days.
 */
import { PanchangamDay } from '@types/index';

// Bundled at build-time — no network required
const RAW_DATA = require('../data/panchangam2026.json') as PanchangamDay[];

class PanchangamServiceClass {
  private cache: Map<string, PanchangamDay> = new Map();

  constructor() {
    RAW_DATA.forEach(day => this.cache.set(day.date, day));
  }

  getDay(date: string): PanchangamDay | null {
    return this.cache.get(date) ?? null;
  }

  getMonth(yearMonth: string): PanchangamDay[] {
    return RAW_DATA.filter(d => d.date.startsWith(yearMonth));
  }

  getFestivalDays(): PanchangamDay[] {
    return RAW_DATA.filter(d => d.isFestival || d.isHoliday);
  }

  searchFestivals(query: string): PanchangamDay[] {
    const q = query.toLowerCase();
    return RAW_DATA.filter(d =>
      d.festivals.some(f => f.toLowerCase().includes(q))
    );
  }
}

export const PanchangamService = new PanchangamServiceClass();
