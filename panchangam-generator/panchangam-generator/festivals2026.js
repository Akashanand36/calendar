/**
 * festivals2026.js
 * Complete festival and holiday database for 2026 (Tamil Nadu focus).
 * Includes Hindu, Muslim, Christian, Tamil, and National holidays.
 *
 * Dates that depend on moon phase (Purnima, Amavasya, Ekadashi) are
 * computed dynamically by the generator. Fixed-date festivals are here.
 */

'use strict';

/**
 * Fixed-date festivals and holidays for 2026.
 * { date: 'MM-DD', name, tamilName, category, isHoliday }
 * 
 * Categories: 'Hindu' | 'Muslim' | 'Christian' | 'Tamil' | 'National'
 */
const FIXED_FESTIVALS = [
  // ─── January ───────────────────────────────────────────────────────────────
  { date: '01-01', name: "New Year's Day",       tamilName: 'புத்தாண்டு',         category: 'National',  isHoliday: true  },
  { date: '01-14', name: 'Thai Pongal',           tamilName: 'தை பொங்கல்',        category: 'Tamil',     isHoliday: true  },
  { date: '01-15', name: 'Mattu Pongal',          tamilName: 'மாட்டு பொங்கல்',    category: 'Tamil',     isHoliday: false },
  { date: '01-16', name: 'Kaanum Pongal',         tamilName: 'காணும் பொங்கல்',    category: 'Tamil',     isHoliday: false },
  { date: '01-26', name: 'Republic Day',          tamilName: 'குடியரசு நாள்',     category: 'National',  isHoliday: true  },

  // ─── February ──────────────────────────────────────────────────────────────
  { date: '02-14', name: "Valentine's Day",       tamilName: '',                  category: 'National',  isHoliday: false },
  { date: '02-19', name: 'Shivaji Jayanti',       tamilName: 'சிவாஜி ஜெயந்தி',  category: 'National',  isHoliday: false },
  { date: '02-26', name: 'Maha Shivaratri',       tamilName: 'மகா சிவராத்திரி',  category: 'Hindu',     isHoliday: true  },

  // ─── March ─────────────────────────────────────────────────────────────────
  { date: '03-14', name: 'Holi',                  tamilName: 'ஹோலி',              category: 'Hindu',     isHoliday: true  },
  { date: '03-20', name: 'Ugadi (Kannada/Telugu)',tamilName: 'உகாதி',              category: 'Hindu',     isHoliday: false },
  { date: '03-25', name: 'Panguni Uthiram',       tamilName: 'பங்குனி உத்திரம்', category: 'Hindu',     isHoliday: false },
  { date: '03-30', name: 'Ram Navami',            tamilName: 'ராம நவமி',          category: 'Hindu',     isHoliday: false },

  // ─── April ─────────────────────────────────────────────────────────────────
  { date: '04-03', name: 'Good Friday',           tamilName: 'குட் ஃப்ரைடே',     category: 'Christian', isHoliday: true  },
  { date: '04-05', name: 'Easter Sunday',         tamilName: 'ஈஸ்டர்',            category: 'Christian', isHoliday: false },
  { date: '04-13', name: 'Vishu',                 tamilName: 'விஷு',              category: 'Hindu',     isHoliday: false },
  { date: '04-14', name: 'Tamil New Year',        tamilName: 'தமிழ் புத்தாண்டு', category: 'Tamil',     isHoliday: true  },
  { date: '04-14', name: 'Dr. Ambedkar Jayanti',  tamilName: 'அம்பேத்கர் ஜெயந்தி',category:'National',  isHoliday: true  },

  // ─── May ───────────────────────────────────────────────────────────────────
  { date: '05-01', name: 'Labour Day',            tamilName: 'உழைப்பாளர் நாள்',  category: 'National',  isHoliday: true  },
  { date: '05-14', name: 'Akshaya Tritiya',       tamilName: 'அட்சய திருதியை',   category: 'Hindu',     isHoliday: false },

  // ─── June ──────────────────────────────────────────────────────────────────
  { date: '06-06', name: 'Vaikasi Visakam',       tamilName: 'வைகாசி விசாகம்',   category: 'Hindu',     isHoliday: false },

  // ─── July ──────────────────────────────────────────────────────────────────
  { date: '07-18', name: 'Aadi Perukku',          tamilName: 'ஆடி பெருக்கு',     category: 'Tamil',     isHoliday: false },

  // ─── August ────────────────────────────────────────────────────────────────
  { date: '08-01', name: 'Aadi Velli',            tamilName: 'ஆடி வெள்ளி',       category: 'Tamil',     isHoliday: false },
  { date: '08-15', name: 'Independence Day',      tamilName: 'சுதந்திர தினம்',   category: 'National',  isHoliday: true  },
  { date: '08-16', name: 'Varalakshmi Vratham',   tamilName: 'வரலட்சுமி விரதம்', category: 'Hindu',     isHoliday: false },
  { date: '08-21', name: 'Krishna Jayanti',       tamilName: 'கிருஷ்ண ஜெயந்தி', category: 'Hindu',     isHoliday: true  },
  { date: '08-22', name: 'Onam',                  tamilName: 'ஓணம்',              category: 'Hindu',     isHoliday: false },
  { date: '08-28', name: 'Vinayaka Chaturthi',    tamilName: 'விநாயக சதுர்த்தி', category: 'Hindu',     isHoliday: true  },

  // ─── September ─────────────────────────────────────────────────────────────
  { date: '09-05', name: "Teachers' Day",         tamilName: 'ஆசிரியர் தினம்',   category: 'National',  isHoliday: false },
  { date: '09-17', name: 'Mahalaya Amavasya',     tamilName: 'மகாளய அமாவாசை',   category: 'Hindu',     isHoliday: false },

  // ─── October ───────────────────────────────────────────────────────────────
  { date: '10-02', name: 'Gandhi Jayanti',        tamilName: 'காந்தி ஜெயந்தி',  category: 'National',  isHoliday: true  },
  { date: '10-20', name: 'Ayudha Puja',           tamilName: 'ஆயுத பூஜை',        category: 'Hindu',     isHoliday: true  },
  { date: '10-21', name: 'Vijayadasami',          tamilName: 'விஜயதசமி',         category: 'Hindu',     isHoliday: true  },

  // ─── November ──────────────────────────────────────────────────────────────
  { date: '11-01', name: 'Kannada Rajyotsava',    tamilName: '',                  category: 'National',  isHoliday: false },
  { date: '11-03', name: 'Diwali',                tamilName: 'தீபாவளி',          category: 'Hindu',     isHoliday: true  },
  { date: '11-06', name: 'Skanda Sashti',         tamilName: 'சுவாமி சஷ்டி',    category: 'Hindu',     isHoliday: false },

  // ─── December ──────────────────────────────────────────────────────────────
  { date: '12-22', name: 'Winter Solstice',       tamilName: 'உத்தராயண புண்யகாலம்', category: 'Hindu', isHoliday: false },
  { date: '12-25', name: 'Christmas',             tamilName: 'கிறிஸ்துமஸ்',     category: 'Christian', isHoliday: true  },
  { date: '12-31', name: "New Year's Eve",        tamilName: '',                  category: 'National',  isHoliday: false },
];

/**
 * Moon-phase-based festivals — computed dynamically by the generator
 * based on Tithi. These names are matched and added when the tithi matches.
 */
const LUNAR_FESTIVALS = [
  // Purnima (Full Moon) festivals
  { month: 1,  tithi: 'Purnima',    name: 'Thai Purnima',        tamilName: 'தை பௌர்ணமி',       category: 'Hindu', isHoliday: false },
  { month: 2,  tithi: 'Purnima',    name: 'Masi Purnima',        tamilName: 'மாசி மகம்',          category: 'Tamil', isHoliday: false },
  { month: 3,  tithi: 'Purnima',    name: 'Panguni Pournami',    tamilName: 'பங்குனி பௌர்ணமி',  category: 'Hindu', isHoliday: false },
  { month: 4,  tithi: 'Purnima',    name: 'Chithirai Pournami',  tamilName: 'சித்திரை பௌர்ணமி', category: 'Tamil', isHoliday: false },
  { month: 5,  tithi: 'Purnima',    name: 'Vaikasi Pournami',    tamilName: 'வைகாசி பௌர்ணமி',  category: 'Tamil', isHoliday: false },
  { month: 6,  tithi: 'Purnima',    name: 'Guru Purnima',        tamilName: 'குரு பௌர்ணமி',     category: 'Hindu', isHoliday: false },
  { month: 7,  tithi: 'Purnima',    name: 'Aadi Pournami',       tamilName: 'ஆடி பௌர்ணமி',      category: 'Tamil', isHoliday: false },
  { month: 8,  tithi: 'Purnima',    name: 'Raksha Bandhan',      tamilName: 'ரக்ஷா பந்தன்',     category: 'Hindu', isHoliday: false },
  { month: 10, tithi: 'Purnima',    name: 'Sharad Purnima',      tamilName: 'சரத் பௌர்ணமி',    category: 'Hindu', isHoliday: false },
  // Amavasya (New Moon)
  { month: 9,  tithi: 'Amavasya',   name: 'Mahalaya Amavasya',   tamilName: 'மகாளய அமாவாசை',   category: 'Hindu', isHoliday: false },
  // Ekadashi (11th day)
  { month: null, tithi: 'Ekadashi', name: 'Ekadashi',            tamilName: 'ஏகாதசி',            category: 'Hindu', isHoliday: false },
];

/**
 * Approximate Muslim holidays for 2026 (dates shift yearly based on moon sighting).
 * These are estimated dates — actual dates may differ by ±1 day.
 */
const MUSLIM_FESTIVALS = [
  { date: '01-06', name: 'Milad-un-Nabi',   tamilName: 'நபிகள் நாயகம் பிறந்த நாள்', category: 'Muslim', isHoliday: true  },
  { date: '03-21', name: 'Ramadan begins',   tamilName: 'ரமஜான் தொடக்கம்',          category: 'Muslim', isHoliday: false },
  { date: '04-20', name: 'Eid al-Fitr',      tamilName: 'ஈத் உல் ஃபித்ர்',          category: 'Muslim', isHoliday: true  },
  { date: '06-27', name: 'Eid al-Adha',      tamilName: 'பக்ரீத்',                   category: 'Muslim', isHoliday: true  },
  { date: '07-18', name: 'Muharram',         tamilName: 'முஹர்ரம்',                  category: 'Muslim', isHoliday: true  },
];

/**
 * Build a lookup Map: 'MM-DD' → array of festival objects
 */
function buildFestivalMap() {
  const map = new Map();
  const addFest = (mmdd, fest) => {
    if (!map.has(mmdd)) map.set(mmdd, []);
    map.get(mmdd).push(fest);
  };
  for (const f of [...FIXED_FESTIVALS, ...MUSLIM_FESTIVALS]) {
    addFest(f.date, f);
  }
  return map;
}

module.exports = { FIXED_FESTIVALS, LUNAR_FESTIVALS, MUSLIM_FESTIVALS, buildFestivalMap };
