# நம்ம Calendar 2026 🕉

A complete Tamil Calendar app for daily life, astrology, and festival tracking.  
Built with **React Native + Expo Router** — works fully **OFFLINE**.

---

## Tech Stack

| Layer         | Library                          |
|---------------|----------------------------------|
| Framework     | Expo SDK 51 + Expo Router 3      |
| Navigation    | Expo Router (file-based)         |
| State         | Redux Toolkit                    |
| Database      | expo-sqlite (offline notes/prefs)|
| Notifications | expo-notifications               |
| Purchases     | react-native-iap                 |
| Fonts         | Outfit + Noto Serif Tamil        |
| List perf     | @shopify/flash-list              |

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install babel-plugin-module-resolver for path aliases
npm install --save-dev babel-plugin-module-resolver

# 3. Start dev server
npx expo start

# 4. Scan QR with Expo Go (Android/iOS) or press i/a for simulator
```

---

## Project Structure

```
NammaCalendar2026/
├── app/                          ← Expo Router (URL = file path)
│   ├── _layout.tsx               ← Root layout: fonts, Redux, StatusBar
│   ├── (tabs)/
│   │   ├── _layout.tsx           ← Bottom tab navigator
│   │   ├── index.tsx             → HomeScreen
│   │   ├── calendar.tsx          → CalendarScreen
│   │   ├── rasipalan.tsx         → RasipalanScreen
│   │   ├── muhurtham.tsx         → MuhurthamScreen
│   │   └── profile.tsx           → ProfileScreen
│   ├── premium.tsx               → PremiumScreen (modal)
│   ├── day-detail.tsx            → DayDetailScreen
│   ├── festival-detail.tsx       → FestivalDetailScreen
│   ├── muhurtham-result.tsx      → MuhurthamResultScreen
│   ├── planner.tsx               → PlannerScreen
│   ├── reminders.tsx             → RemindersScreen
│   └── family-profiles.tsx       → FamilyProfilesScreen
│
├── src/
│   ├── screens/                  ← Actual screen components
│   │   ├── HomeScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── RasipalanScreen.tsx
│   │   ├── MuhurthamScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── PremiumScreen.tsx     ← Subscription + IAP
│   │   ├── DayDetailScreen.tsx
│   │   └── ...stubs
│   │
│   ├── components/
│   │   ├── panchangam/
│   │   │   ├── PanchangamCard.tsx
│   │   │   ├── AvoidTimingsRow.tsx
│   │   │   └── NallaNeramBanner.tsx
│   │   ├── calendar/
│   │   │   └── FestivalListItem.tsx
│   │   └── premium/
│   │       └── PremiumTeaser.tsx
│   │
│   ├── store/                    ← Redux slices
│   │   ├── index.ts              ← Store config
│   │   ├── calendarSlice.ts
│   │   ├── userSlice.ts
│   │   ├── premiumSlice.ts
│   │   └── plannerSlice.ts
│   │
│   ├── services/
│   │   ├── PanchangamService.ts  ← Loads offline JSON
│   │   ├── NotificationService.ts
│   │   ├── DatabaseService.ts    ← SQLite CRUD
│   │   └── PremiumService.ts     ← react-native-iap
│   │
│   ├── hooks/
│   │   ├── usePanchangam.ts
│   │   └── usePremium.ts
│   │
│   ├── data/
│   │   └── panchangam2026.json   ← 365-day offline dataset
│   │
│   ├── constants/
│   │   ├── colors.ts             ← Brand tokens
│   │   └── fonts.ts
│   │
│   ├── utils/
│   │   └── dateUtils.ts
│   │
│   └── types/
│       └── index.ts              ← All TypeScript interfaces
│
├── assets/
│   ├── fonts/                    ← Outfit + NotoSerifTamil TTFs
│   ├── icons/
│   └── images/
│
├── app.json                      ← Expo config (bundle IDs, permissions)
├── babel.config.js               ← Path alias config
├── tsconfig.json                 ← TS paths
└── package.json
```

---

## Screens

| Screen             | Route                  | Description                              |
|--------------------|------------------------|------------------------------------------|
| Home               | `/(tabs)/`             | Today's Panchangam, Nalla Neram, festivals|
| Calendar           | `/(tabs)/calendar`     | Monthly grid with Tamil dates            |
| Rasipalan          | `/(tabs)/rasipalan`    | All 12 Rasi predictions (Daily–Yearly)   |
| Muhurtham Finder   | `/(tabs)/muhurtham`    | AI-ranked auspicious dates (Premium)     |
| Profile            | `/(tabs)/profile`      | User settings, family members, stats     |
| **Premium**        | `/premium`             | Subscription screen with IAP             |
| Day Detail         | `/day-detail`          | Full Panchangam for selected date        |
| Festival Detail    | `/festival-detail`     | Festival info page                       |
| Muhurtham Result   | `/muhurtham-result`    | Detailed muhurtham breakdown             |
| Planner            | `/planner`             | Daily notes and tasks                    |
| Reminders          | `/reminders`           | Reminder management                      |
| Family Profiles    | `/family-profiles`     | Add/manage family members (Premium)      |

---

## Premium Features (react-native-iap)

| SKU                                  | Price  | Period  |
|--------------------------------------|--------|---------|
| `namma_calendar_premium_monthly`     | ₹99    | Monthly |
| `namma_calendar_premium_yearly`      | ₹799   | Yearly  |

Configure these SKUs in:
- **Google Play Console** → Subscriptions
- **App Store Connect** → In-App Purchases

---

## Adding Full Panchangam Data

The file `src/data/panchangam2026.json` currently has sample days.  
To populate all 365 days, either:

1. **Use a Panchangam API** (Drik Panchang, AstroSage) during build time and save as JSON
2. **Manual computation** using Swiss Ephemeris (`swisseph` npm package)
3. **Purchase pre-computed data** from Tamil Panchangam publishers

Each entry follows the `PanchangamDay` TypeScript interface in `src/types/index.ts`.

---

## Build for Production

```bash
# Configure EAS
npx eas build:configure

# Android APK / AAB
npx eas build --platform android

# iOS IPA
npx eas build --platform ios
```

---

## Design Tokens

All colors are in `src/constants/colors.ts`.  
Primary brand palette: Saffron `#E8600A` · Gold `#F5A623` · Dark `#0D0D0D`  
Premium palette: `#FFD166` · `#F0A500`

Font: **Outfit** (UI) + **Noto Serif Tamil** (Tamil text)

---

Built with ❤️ for Tamil culture · நம்ம Calendar 2026
