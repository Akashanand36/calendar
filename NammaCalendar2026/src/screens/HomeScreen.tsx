/**
 * HomeScreen.tsx
 * நம்ம Calendar 2026 — Home Screen
 *
 * Paste into: src/screens/HomeScreen.tsx
 * Dependencies (already in package.json):
 *   - react-native-safe-area-context
 *   - @react-navigation/native  (for useNavigation)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimeRange {
  start: string;
  end: string;
}

interface PanchangamDay {
  date: string;
  tamilDate: string;
  tamilMonth: string;
  tamilYear: string;
  dayName: string;
  tithi: string;
  tithiEnd: string;
  natchathiram: string;
  natchathiramEnd: string;
  yogam: string;
  yogamEnd: string;
  karanam: string;
  karanamEnd: string;
  sunrise: string;
  sunset: string;
  rahuKalam: TimeRange;
  yamagandam: TimeRange;
  kuligai: TimeRange;
  nallaNeram: TimeRange[];
  isFestival: boolean;
  isHoliday: boolean;
  festivals: string[];
  isPurnima: boolean;
  isAmavasya: boolean;
}

interface FestivalItem {
  name: string;
  date: string;
  isHoliday: boolean;
  category: 'Hindu' | 'Muslim' | 'Christian' | 'Tamil' | 'National';
}

// ─── Mock Data (replace with panchangam2026.json + PanchangamService) ────────

const TODAY_DATA: PanchangamDay = {
  date: '2026-03-23',
  tamilDate: 'பங்குனி 10',
  tamilMonth: 'பங்குனி',
  tamilYear: 'விஜய',
  dayName: 'Monday',
  tithi: 'Dwadashi',
  tithiEnd: '18:45',
  natchathiram: 'Hasta',
  natchathiramEnd: '18:48',
  yogam: 'Shubha',
  yogamEnd: '16:22',
  karanam: 'Gara',
  karanamEnd: '15:10',
  sunrise: '06:15',
  sunset: '18:27',
  rahuKalam: { start: '07:30', end: '09:00' },
  yamagandam: { start: '10:30', end: '12:00' },
  kuligai: { start: '12:00', end: '13:30' },
  nallaNeram: [
    { start: '06:15', end: '07:30' },
    { start: '13:30', end: '15:00' },
    { start: '16:30', end: '18:00' },
  ],
  isFestival: false,
  isHoliday: false,
  festivals: [],
  isPurnima: false,
  isAmavasya: false,
};

const UPCOMING_FESTIVALS: FestivalItem[] = [
  { name: 'Panguni Uthiram',  date: 'March 25 · Tue',     isHoliday: false, category: 'Hindu'    },
  { name: 'Good Friday',      date: 'April 3 · Fri',      isHoliday: true,  category: 'Christian' },
  { name: 'Tamil New Year',   date: 'April 14 · Tue',     isHoliday: true,  category: 'Tamil'    },
  { name: 'Eid al-Fitr',      date: 'April 20 · Mon',     isHoliday: true,  category: 'Muslim'   },
];

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  saffron:     '#E8600A',
  saffronDark: '#B84A05',
  gold:        '#F5A623',
  goldDim:     'rgba(245,166,35,0.18)',
  premGold:    '#FFD166',
  bg:          '#0D0D0D',
  surface:     '#1C1410',
  surface2:    '#261C15',
  surface3:    '#2E231A',
  text:        '#F5EDD8',
  muted:       '#A08060',
  border:      'rgba(232,96,10,0.20)',
  green:       '#4CAF7A',
  greenDim:    'rgba(76,175,122,0.14)',
  red:         '#E55A4E',
  redDim:      'rgba(229,90,78,0.14)',
  blue:        '#5B9BD5',
  blueDim:     'rgba(91,155,213,0.14)',
  purple:      '#9B59B6',
  purpleDim:   'rgba(155,89,182,0.14)',
} as const;

const F = {
  regular:      'System',   // replace with 'Outfit-Regular'   after adding font
  medium:       'System',   // replace with 'Outfit-Medium'
  semiBold:     'System',   // replace with 'Outfit-SemiBold'
  bold:         'System',   // replace with 'Outfit-Bold'
  tamil:        'System',   // replace with 'NotoSerifTamil-Regular'
  tamilBold:    'System',   // replace with 'NotoSerifTamil-SemiBold'
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<
  FestivalItem['category'],
  { dot: string; bg: string; text: string; label: string }
> = {
  Hindu:    { dot: C.purple, bg: C.purpleDim, text: '#C39BD3', label: 'Hindu'    },
  Muslim:   { dot: C.blue,   bg: C.blueDim,   text: '#7FB3E0', label: 'Muslim'   },
  Christian:{ dot: C.blue,   bg: C.blueDim,   text: '#7FB3E0', label: 'Christian'},
  Tamil:    { dot: C.green,  bg: C.greenDim,  text: '#6DC49A', label: 'Tamil'    },
  National: { dot: C.saffron,bg: 'rgba(232,96,10,0.14)', text: '#F0915A', label: 'National'},
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ label }: { label: string }) => (
  <Text style={styles.sectionTitle}>{label}</Text>
);

const PanchangamCard = ({
  label,
  value,
  until,
}: {
  label: string;
  value: string;
  until: string;
}) => (
  <View style={styles.pCard}>
    <Text style={styles.pCardLabel}>{label.toUpperCase()}</Text>
    <Text style={styles.pCardValue}>{value}</Text>
    <Text style={styles.pCardTime}>Until {until}</Text>
  </View>
);

const AvoidBlock = ({
  label,
  start,
  end,
}: {
  label: string;
  start: string;
  end: string;
}) => (
  <View style={styles.avoidBlock}>
    <Text style={styles.avoidLabel}>{label.toUpperCase()}</Text>
    <Text style={styles.avoidTime}>
      {start}–{end}
    </Text>
  </View>
);

const NallaNeramBanner = ({ slots }: { slots: TimeRange[] }) => (
  <View style={styles.nallaBanner}>
    <Text style={styles.nallaIcon}>✨</Text>
    <View>
      <Text style={styles.nallaLabel}>NALLA NERAM</Text>
      <Text style={styles.nallaTimes}>
        {slots.map(s => `${s.start}–${s.end}`).join('  ·  ')}
      </Text>
    </View>
  </View>
);

const FestivalRow = ({ item }: { item: FestivalItem }) => {
  const cfg = CATEGORY_CONFIG[item.category];
  return (
    <View style={styles.festivalRow}>
      <View style={[styles.festivalDot, { backgroundColor: cfg.dot }]} />
      <View style={styles.festivalInfo}>
        <Text style={styles.festivalName}>{item.name}</Text>
        <Text style={styles.festivalDate}>
          {item.date}
          {item.isHoliday ? '  ·  Holiday' : ''}
        </Text>
      </View>
      <View style={[styles.festivalTag, { backgroundColor: cfg.bg }]}>
        <Text style={[styles.festivalTagText, { color: cfg.text }]}>
          {cfg.label}
        </Text>
      </View>
    </View>
  );
};

const PremiumTeaser = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.premBanner} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.premIcon}>👑</Text>
    <View style={styles.premText}>
      <Text style={styles.premTitle}>Upgrade to Namma Premium</Text>
      <Text style={styles.premSub}>Muhurtham AI · Family Profiles · Ad-free</Text>
    </View>
    <Text style={styles.premArrow}>›</Text>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;   // replace with NativeStackNavigationProp when using typed nav
  isPremium?: boolean;
}

export default function HomeScreen({ navigation, isPremium = false }: Props) {
  const p = TODAY_DATA;

  const goToPremium = () => navigation?.navigate('Premium');
  const goToCalendar = () => navigation?.navigate('Calendar');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🕉</Text>
          </View>
          <Text style={styles.logoText}>நம்ம Calendar</Text>
        </View>
        <View style={styles.headerRight}>
          {!isPremium && (
            <TouchableOpacity onPress={goToPremium} style={styles.headerBtn}>
              <Text style={styles.headerIcon}>👑</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation?.navigate('Profile')}
            style={styles.headerBtn}
          >
            <Text style={styles.headerIcon}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Today strip ── */}
      <View style={styles.todayStrip}>
        <View>
          <Text style={styles.stripTamilDate}>{p.tamilDate}</Text>
          <Text style={styles.stripEngDate}>
            March 23, 2026  ·  {p.dayName}
          </Text>
        </View>
        <View style={styles.stripRight}>
          <Text style={styles.stripTithiLabel}>Tithi</Text>
          <Text style={styles.stripTithiValue}>{p.tithi}</Text>
          <Text style={styles.stripTamilYear}>{p.tamilYear}</Text>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Panchangam grid */}
        <SectionTitle label="TODAY'S PANCHANGAM" />
        <View style={styles.pGrid}>
          <PanchangamCard label="Natchathiram" value={p.natchathiram} until={p.natchathiramEnd} />
          <PanchangamCard label="Yogam"        value={p.yogam}        until={p.yogamEnd} />
          <PanchangamCard label="Karanam"      value={p.karanam}      until={p.karanamEnd} />
          <PanchangamCard label="Sunrise"      value={p.sunrise}      until={`Sunset ${p.sunset}`} />
        </View>

        {/* Avoid timings */}
        <SectionTitle label="AVOID TIMINGS" />
        <View style={styles.avoidRow}>
          <AvoidBlock label="Rahu Kalam"  start={p.rahuKalam.start}  end={p.rahuKalam.end} />
          <AvoidBlock label="Yamagandam" start={p.yamagandam.start} end={p.yamagandam.end} />
          <AvoidBlock label="Kuligai"    start={p.kuligai.start}    end={p.kuligai.end} />
        </View>

        {/* Nalla Neram */}
        <NallaNeramBanner slots={p.nallaNeram} />

        {/* Upcoming festivals */}
        <View style={styles.festivalHeader}>
          <SectionTitle label="UPCOMING FESTIVALS" />
          <TouchableOpacity onPress={goToCalendar}>
            <Text style={styles.viewAll}>View all →</Text>
          </TouchableOpacity>
        </View>
        {UPCOMING_FESTIVALS.map((item, i) => (
          <FestivalRow key={i} item={item} />
        ))}

        {/* Premium teaser */}
        {!isPremium && <PremiumTeaser onPress={goToPremium} />}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.saffron,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: { fontSize: 16 },
  logoText: {
    fontFamily: F.tamilBold,
    fontSize: 15,
    color: C.saffron,
    letterSpacing: 0.3,
  },
  headerRight: { flexDirection: 'row', gap: 6 },
  headerBtn:   { padding: 4 },
  headerIcon:  { fontSize: 20 },

  // Today strip
  todayStrip: {
    backgroundColor: C.saffron,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stripTamilDate: {
    fontFamily: F.tamilBold,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  stripEngDate: {
    fontFamily: F.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  stripRight:      { alignItems: 'flex-end' },
  stripTithiLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontFamily: F.regular },
  stripTithiValue: { fontSize: 15, color: '#fff', fontFamily: F.medium, fontWeight: '500' },
  stripTamilYear:  { fontSize: 10, color: 'rgba(255,255,255,0.65)', fontFamily: F.tamil, marginTop: 1 },

  // Scroll
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Section title
  sectionTitle: {
    fontFamily: F.semiBold,
    fontSize: 11,
    color: C.saffron,
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '600',
  },

  // Panchangam grid
  pGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  pCard: {
    width: '48%',
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 10,
  },
  pCardLabel: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 0.5,
    fontFamily: F.medium,
    fontWeight: '500',
    marginBottom: 3,
  },
  pCardValue: {
    fontSize: 13,
    color: C.text,
    fontFamily: F.medium,
    fontWeight: '500',
  },
  pCardTime: {
    fontSize: 10,
    color: C.gold,
    fontFamily: F.regular,
    marginTop: 2,
  },

  // Avoid timings
  avoidRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  avoidBlock: {
    flex: 1,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: 'rgba(229,90,78,0.25)',
    borderRadius: 10,
    padding: 9,
    alignItems: 'center',
  },
  avoidLabel: {
    fontSize: 9,
    color: C.red,
    letterSpacing: 0.4,
    fontFamily: F.medium,
    fontWeight: '600',
    textAlign: 'center',
  },
  avoidTime: {
    fontSize: 12,
    color: C.text,
    fontFamily: F.medium,
    fontWeight: '500',
    marginTop: 4,
  },

  // Nalla Neram
  nallaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.greenDim,
    borderWidth: 1,
    borderColor: 'rgba(76,175,122,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  nallaIcon:   { fontSize: 22 },
  nallaLabel:  {
    fontSize: 10,
    color: C.green,
    letterSpacing: 0.5,
    fontFamily: F.semiBold,
    fontWeight: '600',
  },
  nallaTimes: {
    fontSize: 12,
    color: C.text,
    fontFamily: F.medium,
    fontWeight: '500',
    marginTop: 2,
  },

  // Festival section
  festivalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAll: {
    fontSize: 12,
    color: C.saffron,
    fontFamily: F.medium,
    fontWeight: '500',
  },
  festivalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  festivalDot:     { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  festivalInfo:    { flex: 1 },
  festivalName:    { fontSize: 13, color: C.text, fontFamily: F.medium, fontWeight: '500' },
  festivalDate:    { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2 },
  festivalTag:     { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  festivalTagText: { fontSize: 10, fontFamily: F.semiBold, fontWeight: '600' },

  // Premium teaser
  premBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,209,102,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.25)',
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  premIcon:  { fontSize: 26 },
  premText:  { flex: 1 },
  premTitle: { fontSize: 14, color: C.premGold, fontFamily: F.semiBold, fontWeight: '600' },
  premSub:   { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2 },
  premArrow: { fontSize: 20, color: C.premGold },

  bottomPad: { height: 24 },
});
