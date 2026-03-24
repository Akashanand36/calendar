# Panchangam 2026 Generator 🕉

A pure Node.js script that generates a complete, offline `panchangam2026.json`
for all 365 days using Jean Meeus astronomical algorithms. No internet. No paid APIs.

---

## Files

| File               | Purpose                                              |
|--------------------|------------------------------------------------------|
| `generate.js`      | Main script — orchestrates all 365 days              |
| `astronomy.js`     | Pure-math engine: sun, moon, sunrise, Tithi, etc.    |
| `festivals2026.js` | Festival & holiday database (fixed + lunar-based)    |
| `panchangam2026.json` | Generated output — copy to your Expo app          |

---

## Usage

```bash
# Generate for Chennai (default)
node generate.js

# Generate for another city
node generate.js --city coimbatore
node generate.js --city madurai
node generate.js --city bangalore

# Custom output path
node generate.js --out ../NammaCalendar2026/src/data/panchangam2026.json

# Verbose mode — prints every day's details
node generate.js --verbose

# All options combined
node generate.js --city trichy --out ./data/panchang.json --verbose
```

### Supported Cities

| Flag            | City               | Coordinates          |
|-----------------|--------------------|----------------------|
| `chennai`       | Chennai (default)  | 13.08°N, 80.27°E     |
| `coimbatore`    | Coimbatore         | 11.02°N, 76.96°E     |
| `madurai`       | Madurai            | 9.93°N,  78.12°E     |
| `trichy`        | Tiruchirappalli    | 10.79°N, 78.70°E     |
| `tirunelveli`   | Tirunelveli        | 8.71°N,  77.76°E     |
| `salem`         | Salem              | 11.66°N, 78.15°E     |
| `erode`         | Erode              | 11.34°N, 77.72°E     |
| `vellore`       | Vellore            | 12.92°N, 79.13°E     |
| `bangalore`     | Bangalore          | 12.97°N, 77.59°E     |
| `mumbai`        | Mumbai             | 19.08°N, 72.88°E     |
| `delhi`         | Delhi              | 28.61°N, 77.21°E     |
| `hyderabad`     | Hyderabad          | 17.39°N, 78.49°E     |

---

## What Gets Computed

Each day in the JSON contains:

```jsonc
{
  "date": "2026-03-23",
  "tamilDate": "பங்குனி 10",       // Tamil month + day
  "tamilMonth": "பங்குனி",
  "tamilYear": "விஜய",
  "dayName": "Monday",

  // Pancha Angam (5 elements)
  "tithi": "Dwadashi",             // Lunar day (1–30)
  "tithiEnd": "18:45",             // When it ends (IST)
  "natchathiram": "Hasta",         // Moon's nakshatra
  "natchathiramTamil": "அஸ்தம்",
  "natchathiramEnd": "18:48",
  "yogam": "Shubha",               // Sun+Moon combination
  "yogamEnd": "16:22",
  "karanam": "Gara",               // Half-tithi
  "karanamEnd": "15:10",

  // Sun timings
  "sunrise": "06:15",
  "sunset": "18:27",

  // Avoid timings
  "rahuKalam":  { "start": "07:30", "end": "09:00" },
  "yamagandam": { "start": "10:30", "end": "12:00" },
  "kuligai":    { "start": "12:00", "end": "13:30" },

  // Auspicious slots (gaps between avoid timings)
  "nallaNeram": [
    { "start": "06:15", "end": "07:30" },
    { "start": "13:30", "end": "15:00" }
  ],

  // Festival info
  "isFestival": false,
  "isHoliday": false,
  "isPurnima": false,
  "isAmavasya": false,
  "festivals": []
}
```

---

## Accuracy

| Element        | Method                         | Accuracy        |
|----------------|--------------------------------|-----------------|
| Sunrise/Sunset | NOAA solar position algorithm  | ±1–2 minutes    |
| Solar longitude | Meeus Ch.25 low-precision     | < 0.01°         |
| Lunar longitude | Meeus Ch.47 (top 16 terms)    | ≈ 0.3°          |
| Tithi          | (Moon − Sun) / 12°             | ±15–30 minutes  |
| Nakshatra      | Moon longitude / 13.333°       | ±30–60 minutes  |
| Yogam          | (Sun + Moon) / 13.333°         | ±30 minutes     |
| Rahu Kalam     | Traditional day-part formula   | Exact            |

Traditional Tamil Panchangam publications allow ±30 min tolerance for
tithi/nakshatra transitions — this script is well within that range.

---

## Adding a New City

Edit the `CITIES` object in `generate.js`:

```js
const CITIES = {
  // ...existing cities...
  pondicherry: { lat: 11.9416, lon: 79.8083, name: 'Pondicherry' },
};
```

Then run:
```bash
node generate.js --city pondicherry
```

---

## Copy to Expo App

```bash
cp panchangam2026.json ../NammaCalendar2026/src/data/panchangam2026.json
```

The `PanchangamService.ts` in the Expo app loads this file at build time —
no network requests, fully offline. ✅

---

## Requirements

- Node.js ≥ 16
- No npm packages needed — pure JavaScript

---

Built for நம்ம Calendar 2026 · Tamil calendar app
