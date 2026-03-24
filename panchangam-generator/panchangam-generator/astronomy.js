/**
 * astronomy.js
 * Pure-JS astronomical calculation engine for Tamil Panchangam.
 * Algorithms from Jean Meeus "Astronomical Algorithms" (2nd ed.)
 * and the Wikipedia Solar Calculator (NOAA method).
 *
 * Accuracy: ±1–2 minutes for sunrise/sunset, ±0.5° for lunar longitude.
 * Good enough for Panchangam purposes (traditional texts allow ±30 min).
 */

'use strict';

const DEG = Math.PI / 180;

// ─── Julian Day ──────────────────────────────────────────────────────────────

/**
 * Convert calendar date + fractional UT hour to Julian Day Number.
 * Meeus Ch.7, valid for all dates after 1582-Oct-15 (Gregorian).
 */
function julianDay(year, month, day, utHour = 0) {
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day + utHour / 24 + B - 1524.5
  );
}

// ─── Solar Longitude ─────────────────────────────────────────────────────────

/**
 * Apparent solar longitude (degrees, 0–360).
 * Meeus Ch.25 (low-precision version, <0.01° error).
 */
function solarLongitude(jd) {
  const T  = (jd - 2451545.0) / 36525;
  const L0 = 280.46646  + 36000.76983 * T + 0.0003032 * T * T;
  const M  = 357.52911  + 35999.05029 * T - 0.0001537 * T * T;
  const Mr = M * DEG;
  const C  = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
           + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
           +  0.000289 * Math.sin(3 * Mr);
  const sunLon = L0 + C;
  const omega  = 125.04 - 1934.136 * T;
  const apparent = sunLon - 0.00569 - 0.00478 * Math.sin(omega * DEG);
  return ((apparent % 360) + 360) % 360;
}

// ─── Lunar Longitude ─────────────────────────────────────────────────────────

/**
 * Moon's geocentric longitude (degrees, 0–360).
 * Meeus Ch.47 – truncated to top-10 periodic terms (~0.3° error).
 * Sufficient for nakshatra/tithi determination.
 */
function lunarLongitude(jd) {
  const T  = (jd - 2451545.0) / 36525;
  // Fundamental arguments (degrees)
  const D  = ((297.85036 + 445267.111480 * T - 0.0019142 * T * T) % 360 + 360) % 360;
  const M  = ((357.52772 + 35999.050340  * T - 0.0001603 * T * T) % 360 + 360) % 360;
  const Mp = ((134.96298 + 477198.867398 * T + 0.0086972 * T * T) % 360 + 360) % 360;
  const F  = (( 93.27191 + 483202.017538 * T - 0.0036825 * T * T) % 360 + 360) % 360;
  // Mean longitude
  const Lr = ((218.3165 + 481267.8813 * T) % 360 + 360) % 360;

  // Periodic sum (units: 0.000001 degrees)
  const sumL =
     6288774 * Math.sin(Mp * DEG) +
     1274027 * Math.sin((2*D - Mp) * DEG) +
      658314 * Math.sin(2*D * DEG) +
      213618 * Math.sin(2*Mp * DEG) -
      185116 * Math.sin(M  * DEG) -
      114332 * Math.sin(2*F  * DEG) +
       58793 * Math.sin((2*D - 2*Mp) * DEG) +
       57066 * Math.sin((2*D - M - Mp) * DEG) +
       53322 * Math.sin((2*D + Mp) * DEG) +
       45758 * Math.sin((2*D - M) * DEG) +
      -40923 * Math.sin((M - Mp) * DEG) +
      -34720 * Math.sin(D * DEG) +
      -30383 * Math.sin((M + Mp) * DEG) +
       15327 * Math.sin((2*D - 2*F) * DEG) +
      -12528 * Math.sin(Mp + 2*F * DEG) +
       10980 * Math.sin(Mp - 2*F * DEG);

  return ((Lr + sumL / 1000000) % 360 + 360) % 360;
}

// ─── Sunrise / Sunset ────────────────────────────────────────────────────────

/**
 * Calculate sunrise and sunset in IST ("HH:MM") for a given date and location.
 * Uses the Wikipedia / NOAA solar position algorithm.
 *
 * @param {number} year
 * @param {number} month  1-based
 * @param {number} day
 * @param {number} lat    latitude  (positive = North)
 * @param {number} lon    longitude (positive = East)
 * @returns {{ sunrise: string, sunset: string, transitMins: number }}
 */
function calcSunriseSunset(year, month, day, lat, lon) {
  const jd = julianDay(year, month, day, 12); // Approximate noon
  const n  = jd - 2451545.0 + 0.0008;
  const Js = n - lon / 360;

  const M    = ((357.5291 + 0.98560028 * Js) % 360 + 360) % 360;
  const Mr   = M * DEG;
  const C    = 1.9148 * Math.sin(Mr) + 0.0200 * Math.sin(2 * Mr) + 0.0003 * Math.sin(3 * Mr);
  const lam  = (M + C + 180 + 102.9372) % 360;
  const Jtr  = 2451545.0 + Js + 0.0053 * Math.sin(Mr) - 0.0069 * Math.sin(2 * lam * DEG);

  const sinD = Math.sin(lam * DEG) * Math.sin(23.4397 * DEG);
  const decl = Math.asin(sinD);
  const cosH = (Math.sin(-0.8333 * DEG) - Math.sin(lat * DEG) * sinD) /
               (Math.cos(lat * DEG) * Math.cos(decl));

  // Clamp to avoid NaN at extreme latitudes
  const cosHc = Math.max(-1, Math.min(1, cosH));
  const H     = Math.acos(cosHc) * 180 / Math.PI;

  const Jrise = Jtr - H / 360;
  const Jset  = Jtr + H / 360;

  /**
   * Convert Julian Day fraction to IST "HH:MM"
   * IST = UTC + 5h 30m = UTC + 330 minutes
   */
  const jdToIST = (jdVal) => {
    const fracUTC     = ((jdVal + 0.5) % 1 + 1) % 1; // 0–1 fraction of UTC day
    let   totalMinIST = fracUTC * 1440 + 330;
    if (totalMinIST >= 1440) totalMinIST -= 1440;
    const h = Math.floor(totalMinIST / 60);
    const m = Math.round(totalMinIST % 60);
    // Handle minute rounding to 60
    if (m === 60) return `${String(h + 1).padStart(2, '0')}:00`;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const sunriseStr = jdToIST(Jrise);
  const sunsetStr  = jdToIST(Jset);

  // Transit in IST minutes (for avoid-timing calculations)
  const fracUTC    = ((Jtr + 0.5) % 1 + 1) % 1;
  const transitIST = fracUTC * 1440 + 330;

  return { sunrise: sunriseStr, sunset: sunsetStr, transitMins: transitIST % 1440 };
}

// ─── Time utilities ──────────────────────────────────────────────────────────

function timeToMins(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minsToTime(totalMins) {
  let t = ((totalMins % 1440) + 1440) % 1440;
  const h = Math.floor(t / 60);
  const m = Math.round(t % 60);
  if (m === 60) return `${String(h + 1).padStart(2, '0')}:00`;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ─── Avoid Timings ───────────────────────────────────────────────────────────

/**
 * Calculate Rahu Kalam, Yamagandam, and Kuligai for a given day.
 * The day is divided into 8 equal parts from sunrise to sunset.
 * Traditional part assignments (1-indexed) by day of week:
 *
 *  Day   Rahu  Yama  Kuligai
 *  Sun    8     5      7
 *  Mon    2     4      1
 *  Tue    7     3      6
 *  Wed    5     2      4
 *  Thu    6     1      5
 *  Fri    4     8      3
 *  Sat    3     7      2
 */
function calcAvoidTimings(sunriseStr, sunsetStr, dayOfWeek) {
  const riseMins  = timeToMins(sunriseStr);
  const setMins   = timeToMins(sunsetStr);
  const duration  = setMins - riseMins;
  const part      = duration / 8;

  const RAHU    = [8, 2, 7, 5, 6, 4, 3]; // Sun=0 … Sat=6
  const YAMA    = [5, 4, 3, 2, 1, 8, 7];
  const KULIGAI = [7, 1, 6, 4, 5, 3, 2];

  const slot = (partNum) => ({
    start: minsToTime(riseMins + (partNum - 1) * part),
    end:   minsToTime(riseMins +  partNum      * part),
  });

  return {
    rahuKalam:  slot(RAHU[dayOfWeek]),
    yamagandam: slot(YAMA[dayOfWeek]),
    kuligai:    slot(KULIGAI[dayOfWeek]),
  };
}

// ─── Nalla Neram ─────────────────────────────────────────────────────────────

/**
 * Calculate Nalla Neram (auspicious time slots) as the gaps between
 * the three avoid-timing blocks, plus the slot after the last one.
 * Gaps shorter than 45 minutes are skipped.
 */
function calcNallaNeram(sunriseStr, sunsetStr, avoidTimings) {
  const riseMins = timeToMins(sunriseStr);
  const setMins  = timeToMins(sunsetStr);

  // Collect all avoid blocks and sort by start time
  const blocks = [
    avoidTimings.rahuKalam,
    avoidTimings.yamagandam,
    avoidTimings.kuligai,
  ]
    .map(b => ({ start: timeToMins(b.start), end: timeToMins(b.end) }))
    .sort((a, b) => a.start - b.start);

  const good = [];
  let cursor = riseMins;

  for (const block of blocks) {
    if (block.start - cursor >= 45) {
      good.push({ start: minsToTime(cursor), end: minsToTime(block.start) });
    }
    cursor = block.end;
  }
  // Final slot after last avoid block
  if (setMins - cursor >= 45) {
    good.push({ start: minsToTime(cursor), end: minsToTime(setMins) });
  }

  return good;
}

// ─── Tithi ───────────────────────────────────────────────────────────────────

const TITHIS = [
  'Pratipada', 'Dvitiya',   'Tritiya',    'Chaturthi', 'Panchami',
  'Shashti',   'Saptami',   'Ashtami',    'Navami',    'Dashami',
  'Ekadashi',  'Dwadashi',  'Trayodashi', 'Chaturdashi',
  'Purnima',   // 15th (Shukla)
  'Pratipada', 'Dvitiya',   'Tritiya',    'Chaturthi', 'Panchami',
  'Shashti',   'Saptami',   'Ashtami',    'Navami',    'Dashami',
  'Ekadashi',  'Dwadashi',  'Trayodashi', 'Chaturdashi',
  'Amavasya',  // 30th (Krishna)
];

/**
 * Calculate Tithi at a given Julian Day (IST sunrise moment).
 * Returns { tithi, tithiEnd } where tithiEnd is when the next tithi begins (IST "HH:MM").
 */
function calcTithi(jd, sunriseStr) {
  const sunLon  = solarLongitude(jd);
  const moonLon = lunarLongitude(jd);
  const diff    = ((moonLon - sunLon) % 360 + 360) % 360;
  const idx     = Math.floor(diff / 12); // 0–29

  // Approximate when this tithi ends: find when diff crosses next 12° boundary
  // Rate of change: Moon moves ~13.2°/day, Sun ~1°/day → ~12.2°/day relative
  const degToNextTithi  = 12 - (diff % 12);
  const hoursToEnd      = degToNextTithi / (12.2 / 24); // approx hours
  const endMins         = timeToMins(sunriseStr) + hoursToEnd * 60;

  return {
    tithi:    TITHIS[idx] ?? 'Amavasya',
    tithiEnd: minsToTime(endMins),
    isPurnima: idx === 14,
    isAmavasya: idx === 29,
  };
}

// ─── Nakshatra ───────────────────────────────────────────────────────────────

const NAKSHATRAS = [
  'Ashwini',         'Bharani',          'Krittika',
  'Rohini',          'Mrigashira',       'Ardra',
  'Punarvasu',       'Pushya',           'Ashlesha',
  'Magha',           'Purva Phalguni',   'Uttara Phalguni',
  'Hasta',           'Chitra',           'Swati',
  'Vishakha',        'Anuradha',         'Jyeshtha',
  'Mula',            'Purva Ashadha',    'Uttara Ashadha',
  'Shravana',        'Dhanishtha',       'Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati',
];

// Tamil names for the 27 Nakshatras
const NAKSHATRAS_TAMIL = [
  'அஸ்வினி',       'பரணி',            'கார்த்திகை',
  'ரோகிணி',        'மிருகசீரிஷம்',    'திருவாதிரை',
  'புனர்பூசம்',    'பூசம்',            'ஆயில்யம்',
  'மகம்',           'பூரம்',            'உத்திரம்',
  'அஸ்தம்',        'சித்திரை',         'சுவாதி',
  'விசாகம்',       'அனுஷம்',          'கேட்டை',
  'மூலம்',         'பூராடம்',          'உத்திராடம்',
  'திருவோணம்',     'அவிட்டம்',        'சதயம்',
  'பூரட்டாதி',     'உத்தரட்டாதி',     'ரேவதி',
];

/**
 * Calculate Nakshatra at sunrise.
 * Each nakshatra spans 360/27 = 13.333° of lunar longitude.
 */
function calcNakshatra(jd, sunriseStr) {
  const moonLon   = lunarLongitude(jd);
  const idx       = Math.floor(moonLon / (360 / 27)); // 0–26
  const degInNak  = moonLon % (360 / 27);
  const remaining = (360 / 27) - degInNak;

  // Moon moves ~13.2°/day
  const hoursToEnd = (remaining / 13.2) * 24;
  const endMins    = timeToMins(sunriseStr) + hoursToEnd * 60;

  return {
    natchathiram:     NAKSHATRAS[idx],
    natchathiramTamil: NAKSHATRAS_TAMIL[idx],
    natchathiramEnd:  minsToTime(endMins),
  };
}

// ─── Yogam ───────────────────────────────────────────────────────────────────

const YOGAMS = [
  'Vishkambha', 'Priti',    'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda',   'Sukarma',  'Dhriti',   'Shula',     'Ganda',
  'Vriddhi',    'Dhruva',   'Vyaghata', 'Harshana',  'Vajra',
  'Siddhi',     'Vyatipata','Variyana',  'Parigha',   'Shiva',
  'Siddha',     'Sadhya',   'Shubha',   'Shukla',    'Brahma',
  'Mahendra',   'Vaidhriti',
];

/**
 * Yogam = (Sun longitude + Moon longitude) / (360/27)
 * Each yogam spans 13.333°.
 */
function calcYogam(jd, sunriseStr) {
  const sunLon  = solarLongitude(jd);
  const moonLon = lunarLongitude(jd);
  const sum     = (sunLon + moonLon) % 360;
  const idx     = Math.floor(sum / (360 / 27)); // 0–26

  const degInYog  = sum % (360 / 27);
  const remaining = (360 / 27) - degInYog;
  // Combined rate: sun ~1°/day, moon ~13.2°/day → ~14.2°/day
  const hoursToEnd = (remaining / 14.2) * 24;
  const endMins    = timeToMins(sunriseStr) + hoursToEnd * 60;

  return {
    yogam:    YOGAMS[idx],
    yogamEnd: minsToTime(endMins),
  };
}

// ─── Karanam ─────────────────────────────────────────────────────────────────

const KARANAS = [
  'Bava',    'Balava',  'Kaulava', 'Taitula', 'Garaja',
  'Vanija',  'Vishti',  'Shakuni', 'Chatushpada', 'Naga',
  'Kimstughna',
];

/**
 * Karanam = half a tithi (6° of moon–sun diff).
 * Index cycles through 60 karanas per lunar month.
 */
function calcKaranam(jd, sunriseStr) {
  const sunLon  = solarLongitude(jd);
  const moonLon = lunarLongitude(jd);
  const diff    = ((moonLon - sunLon) % 360 + 360) % 360;
  const karana  = Math.floor(diff / 6); // 0–59

  // Fixed karanas (1st and last 4 are special, rest cycle through 7)
  let idx;
  if      (karana === 0)  idx = 10; // Kimstughna
  else if (karana >= 57)  idx = 7 + (karana - 57); // Shakuni, Chatushpada, Naga
  else    idx = ((karana - 1) % 7); // Bava … Vishti repeating

  const degInKar  = diff % 6;
  const remaining = 6 - degInKar;
  const hoursToEnd = (remaining / (12.2 / 2)) * 24; // half tithi rate
  const endMins    = timeToMins(sunriseStr) + hoursToEnd * 60;

  return {
    karanam:    KARANAS[idx] ?? KARANAS[0],
    karanamEnd: minsToTime(endMins),
  };
}

// ─── Tamil Calendar ──────────────────────────────────────────────────────────

const TAMIL_MONTHS = [
  'சித்திரை', 'வைகாசி', 'ஆனி',      'ஆடி',
  'ஆவணி',    'புரட்டாசி','ஐப்பசி',   'கார்த்திகை',
  'மார்கழி',  'தை',      'மாசி',     'பங்குனி',
];

// Tamil year names (60-year cycle), starting from Prabhava (cycle starting ~1987)
const TAMIL_YEARS = [
  'பிரபவ','விபவ','சுக்கல','பிரமோதூத','பிரஜோத்பத்தி',
  'ஆங்கீரச','ஸ்ரீமுக','பவ','யுவ','தாது',
  'ஈஸ்வர','வெகுதான்ய','பிரமதி','விக்கிரம','விஷு',
  'சித்ரபானு','சுபானு','தாரண','பார்த்திப','வியய',
  'சர்வஜித்','சர்வதாரி','விரோதி','விக்ருதி','கர',
  'நந்தன','விஜய','ஜய','மன்மத','துர்முகி',
  'ஹேவிளம்பி','விளம்பி','விகாரி','சார்வரி','பிலவ',
  'சுபகிருது','சோபகிருது','குரோதி','விஸ்வாவசு','பராபவ',
  'பிலவங்க','கீலக','சௌம்ய','சாதாரண','விரோதகிருது',
  'பரிதாபி','பிரமாதீச','ஆனந்த','ராட்சச','நள',
  'பிங்கல','காளயுக்தி','சித்தார்த்தி','ரௌத்திரி','துன்மதி',
  'துந்துபி','ருத்ரோத்காரி','ரக்தாட்சி','குரோதன','அட்சய',
];

/**
 * Get the Tamil month and year name for a Gregorian date.
 * Tamil months start when the Sun enters each rashi (zodiac sign).
 * Simplified: map solar longitude to Tamil month.
 */
function getTamilDate(year, month, day, sunLon) {
  // Tamil month = which rashi the Sun is in
  const tamilMonthIdx = Math.floor(sunLon / 30) % 12;

  // Tamil date = day within the month (approximate: day of month cycling)
  // For accurate Tamil date we'd need to track month boundaries
  // Using solar longitude progression within the rashi
  const degInRashi  = sunLon % 30;
  const tamilDay    = Math.floor(degInRashi / (30 / 30)) + 1; // ~1 day per degree

  // Tamil year: Vikrama starts mid-April. 2026 Gregorian ≈ Tamil year 2026-57 = Vikrama era
  // The 60-year cycle: 2026 Gregorian ≈ Vikrama year 2082 → cycle pos = 2082 % 60 = 42
  // Actually: Tamil Kali year. Simpler: 2025-26 = விஜய (Vijaya), year index 19 in cycle
  const tamilYearIdx  = (year - 1987 + 60 * 10) % 60; // anchored to Prabhava in 1987
  const tamilYearName = TAMIL_YEARS[tamilYearIdx] || 'விஜய';

  const tamilDayNum = Math.max(1, Math.min(30, tamilDay));

  return {
    tamilDate:  `${TAMIL_MONTHS[tamilMonthIdx]} ${tamilDayNum}`,
    tamilMonth: TAMIL_MONTHS[tamilMonthIdx],
    tamilYear:  tamilYearName,
  };
}

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  julianDay,
  solarLongitude,
  lunarLongitude,
  calcSunriseSunset,
  calcAvoidTimings,
  calcNallaNeram,
  calcTithi,
  calcNakshatra,
  calcYogam,
  calcKaranam,
  getTamilDate,
  timeToMins,
  minsToTime,
};
