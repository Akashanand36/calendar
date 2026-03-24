#!/usr/bin/env node
/**
 * generate.js
 * ============================================================
 * Generates a complete panchangam2026.json with all 365 days.
 *
 * Usage:
 *   node generate.js
 *   node generate.js --city chennai
 *   node generate.js --city coimbatore --out ./my-panchangam.json
 *   node generate.js --validate
 *
 * Output:  panchangam2026.json  (copy to src/data/ in Expo project)
 * ============================================================
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const {
  julianDay, solarLongitude, lunarLongitude,
  calcSunriseSunset, calcAvoidTimings, calcNallaNeram,
  calcTithi, calcNakshatra, calcYogam, calcKaranam,
  getTamilDate, timeToMins,
} = require('./astronomy');

const { buildFestivalMap, LUNAR_FESTIVALS } = require('./festivals2026');

// ─── CLI Arguments ────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const getArg  = (flag, def) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};
const hasFlag = (flag) => args.includes(flag);

const CITY_NAME  = getArg('--city', 'chennai').toLowerCase();
const OUTPUT_FILE = getArg('--out', path.join(__dirname, 'panchangam2026.json'));
const VALIDATE   = hasFlag('--validate');
const VERBOSE    = hasFlag('--verbose');

// ─── City Coordinates ─────────────────────────────────────────────────────────

const CITIES = {
  chennai:      { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
  coimbatore:   { lat: 11.0168, lon: 76.9558, name: 'Coimbatore' },
  madurai:      { lat:  9.9252, lon: 78.1198, name: 'Madurai' },
  trichy:       { lat: 10.7905, lon: 78.7047, name: 'Tiruchirappalli' },
  tirunelveli:  { lat:  8.7139, lon: 77.7567, name: 'Tirunelveli' },
  salem:        { lat: 11.6643, lon: 78.1460, name: 'Salem' },
  erode:        { lat: 11.3410, lon: 77.7172, name: 'Erode' },
  vellore:      { lat: 12.9165, lon: 79.1325, name: 'Vellore' },
  tiruppur:     { lat: 11.1085, lon: 77.3411, name: 'Tiruppur' },
  bangalore:    { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
  mumbai:       { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
  delhi:        { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
  hyderabad:    { lat: 17.3850, lon: 78.4867, name: 'Hyderabad' },
};

const city = CITIES[CITY_NAME] ?? CITIES.chennai;

// ─── Festival Lookup ──────────────────────────────────────────────────────────

const festivalMap = buildFestivalMap();

/**
 * Get festivals for a date string "YYYY-MM-DD".
 * Returns array of festival name strings.
 */
function getFestivalsForDate(dateStr, tithi, month) {
  const mmdd = dateStr.slice(5); // "MM-DD"
  const result = [];

  // Fixed-date festivals
  const fixed = festivalMap.get(mmdd) ?? [];
  for (const f of fixed) result.push(f.name);

  // Lunar festivals matched by tithi
  for (const lf of LUNAR_FESTIVALS) {
    if (lf.tithi === tithi) {
      if (lf.month === null || lf.month === month) {
        result.push(lf.name);
      }
    }
  }

  return [...new Set(result)]; // deduplicate
}

/**
 * Check if a date is a public holiday (government holiday).
 */
function isPublicHoliday(dateStr) {
  const mmdd   = dateStr.slice(5);
  const fests  = festivalMap.get(mmdd) ?? [];
  return fests.some(f => f.isHoliday);
}

// ─── Day-of-week ──────────────────────────────────────────────────────────────

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getDayOfWeek(year, month, day) {
  const d = new Date(year, month - 1, day);
  return d.getDay(); // 0=Sun, 6=Sat
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

function pad2(n) { return String(n).padStart(2, '0'); }

function dateToStr(year, month, day) {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(year, month) {
  return [0, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

// ─── Generate one day ─────────────────────────────────────────────────────────

function generateDay(year, month, day) {
  const dateStr = dateToStr(year, month, day);
  const dow     = getDayOfWeek(year, month, day);

  // Sunrise & sunset (IST)
  const { sunrise, sunset } = calcSunriseSunset(year, month, day, city.lat, city.lon);

  // Julian Day at IST sunrise (sunrise hours → UT = sunrise - 5.5)
  const sunriseHour = timeToMins(sunrise) / 60;
  const utHour      = sunriseHour - 5.5;
  const jd          = julianDay(year, month, day, utHour);

  // Solar longitude (for Tamil month)
  const sunLon = solarLongitude(jd);

  // All Panchangam elements
  const { tithi, tithiEnd, isPurnima, isAmavasya } = calcTithi(jd, sunrise);
  const { natchathiram, natchathiramTamil, natchathiramEnd }  = calcNakshatra(jd, sunrise);
  const { yogam, yogamEnd }    = calcYogam(jd, sunrise);
  const { karanam, karanamEnd }= calcKaranam(jd, sunrise);
  const avoidTimings           = calcAvoidTimings(sunrise, sunset, dow);
  const nallaNeram             = calcNallaNeram(sunrise, sunset, avoidTimings);
  const { tamilDate, tamilMonth, tamilYear } = getTamilDate(year, month, day, sunLon);

  // Festivals
  const festivals  = getFestivalsForDate(dateStr, tithi, month);
  const isHoliday  = isPublicHoliday(dateStr);
  const isFestival = festivals.length > 0;

  return {
    date:            dateStr,
    tamilDate,
    tamilMonth,
    tamilYear,
    dayName:         DAY_NAMES[dow],

    // Panchangam five elements
    tithi,
    tithiEnd,
    natchathiram,
    natchathiramTamil,
    natchathiramEnd,
    yogam,
    yogamEnd,
    karanam,
    karanamEnd,

    // Sun & moon
    sunrise,
    sunset,

    // Avoid timings
    rahuKalam:   avoidTimings.rahuKalam,
    yamagandam:  avoidTimings.yamagandam,
    kuligai:     avoidTimings.kuligai,

    // Auspicious times
    nallaNeram,

    // Festival info
    isFestival,
    isHoliday,
    festivals,
    isPurnima,
    isAmavasya,
  };
}

// ─── Generate all 365 days ───────────────────────────────────────────────────

function generateYear(year) {
  const days = [];
  let count = 0;

  for (let month = 1; month <= 12; month++) {
    const numDays = daysInMonth(year, month);
    for (let day = 1; day <= numDays; day++) {
      try {
        const entry = generateDay(year, month, day);
        days.push(entry);
        count++;
        if (VERBOSE) {
          process.stdout.write(`  ✓ ${entry.date}  ${entry.tamilDate.padEnd(16)}  ${entry.tithi.padEnd(14)}  ${entry.natchathiram}\n`);
        } else {
          // Progress bar
          const pct = Math.round((count / 365) * 40);
          const bar = '█'.repeat(pct) + '░'.repeat(40 - pct);
          process.stdout.write(`\r  [${bar}] ${count}/365`);
        }
      } catch (err) {
        console.error(`\n  ERROR on ${year}-${pad2(month)}-${pad2(day)}:`, err.message);
      }
    }
  }

  process.stdout.write('\n');
  return days;
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(days) {
  const errors = [];

  for (const d of days) {
    // Required fields
    for (const field of ['date','tamilDate','tithi','natchathiram','yogam','karanam','sunrise','sunset']) {
      if (!d[field]) errors.push(`${d.date}: missing field "${field}"`);
    }
    // Time format check (HH:MM)
    const timeRe = /^\d{2}:\d{2}$/;
    for (const t of [d.sunrise, d.sunset, d.tithiEnd, d.natchathiramEnd, d.yogamEnd, d.karanamEnd]) {
      if (!timeRe.test(t)) errors.push(`${d.date}: invalid time format "${t}"`);
    }
    // Nalla Neram: at least one slot
    if (!d.nallaNeram || d.nallaNeram.length === 0) {
      errors.push(`${d.date}: no Nalla Neram slots`);
    }
    // Avoid timings present
    if (!d.rahuKalam?.start) errors.push(`${d.date}: missing rahuKalam`);
    if (!d.yamagandam?.start) errors.push(`${d.date}: missing yamagandam`);
    if (!d.kuligai?.start) errors.push(`${d.date}: missing kuligai`);
  }

  return errors;
}

// ─── Statistics report ────────────────────────────────────────────────────────

function printStats(days) {
  const festivals = days.filter(d => d.isFestival);
  const holidays  = days.filter(d => d.isHoliday);
  const purnimas  = days.filter(d => d.isPurnima);
  const amavasyas = days.filter(d => d.isAmavasya);

  // Unique tithi distribution
  const tithiCounts = {};
  days.forEach(d => { tithiCounts[d.tithi] = (tithiCounts[d.tithi] || 0) + 1; });

  console.log('\n  ┌─────────────────────────────────────────┐');
  console.log('  │         PANCHANGAM 2026 STATISTICS      │');
  console.log('  ├─────────────────────────────────────────┤');
  console.log(`  │  Total days generated:    ${String(days.length).padStart(4)}           │`);
  console.log(`  │  Festival days:           ${String(festivals.length).padStart(4)}           │`);
  console.log(`  │  Public holidays:         ${String(holidays.length).padStart(4)}           │`);
  console.log(`  │  Purnima (full moon):     ${String(purnimas.length).padStart(4)}           │`);
  console.log(`  │  Amavasya (new moon):     ${String(amavasyas.length).padStart(4)}           │`);
  console.log(`  │  City:                    ${city.name.padEnd(14)}     │`);
  console.log(`  │  Coordinates:             ${String(city.lat).padEnd(8)} N        │`);
  console.log('  └─────────────────────────────────────────┘');

  console.log('\n  Sample entries:');
  [0, 31, 59, 90, 181, 364].forEach(i => {
    if (days[i]) {
      const d = days[i];
      console.log(`  ${d.date}  ${d.tamilMonth.padEnd(12)}  ${d.tithi.padEnd(14)}  ☀ ${d.sunrise}  🌙 ${d.natchathiram}`);
    }
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

console.log('\n  🕉  Namma Calendar — Panchangam 2026 Generator');
console.log(`  📍 City: ${city.name} (${city.lat}°N, ${city.lon}°E)`);
console.log(`  📁 Output: ${OUTPUT_FILE}\n`);
console.log('  Generating 365 days...\n');

const startTime = Date.now();
const days      = generateYear(2026);
const elapsed   = ((Date.now() - startTime) / 1000).toFixed(1);

console.log(`\n  ✅ Generated ${days.length} days in ${elapsed}s`);

// Validate
if (VALIDATE || true) {
  const errors = validate(days);
  if (errors.length === 0) {
    console.log('  ✅ Validation passed — all fields present and correctly formatted');
  } else {
    console.warn(`\n  ⚠️  ${errors.length} validation issue(s):`);
    errors.slice(0, 10).forEach(e => console.warn(`     ${e}`));
    if (errors.length > 10) console.warn(`     ... and ${errors.length - 10} more`);
  }
}

// Stats
printStats(days);

// Write JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(days, null, 2), 'utf8');
const fileSizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
console.log(`\n  📦 Saved: ${OUTPUT_FILE} (${fileSizeKB} KB)\n`);
console.log('  Copy to your Expo project:');
console.log('  cp panchangam2026.json ../NammaCalendar2026/src/data/\n');
