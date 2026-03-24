/**
 * MuhurthamScreen.tsx
 * நம்ம Calendar 2026 — Muhurtham Finder Screen
 *
 * Paste into: src/screens/MuhurthamScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  saffron:    '#E8600A',
  saffronDark:'#B84A05',
  gold:       '#F5A623',
  goldDim:    'rgba(245,166,35,0.18)',
  premGold:   '#FFD166',
  premAmber:  '#F0A500',
  bg:         '#0D0D0D',
  surface:    '#1C1410',
  surface2:   '#261C15',
  surface3:   '#2E231A',
  text:       '#F5EDD8',
  muted:      '#A08060',
  border:     'rgba(232,96,10,0.20)',
  green:      '#4CAF7A',
  greenDim:   'rgba(76,175,122,0.14)',
  blue:       '#5B9BD5',
  blueDim:    'rgba(91,155,213,0.14)',
  purple:     '#9B59B6',
  purpleDim:  'rgba(155,89,182,0.14)',
} as const;

const F = {
  regular:  'System',
  medium:   'System',
  semiBold: 'System',
  bold:     'System',
  tamil:    'System',
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

type EventType = 'Marriage' | 'GruhaPravesh' | 'BabyNaming' | 'Vehicle' | 'Business' | 'Travel';
type Quality   = 'Excellent' | 'Very Good' | 'Good' | 'Average';

const EVENT_LABELS: Record<EventType, { label: string; emoji: string }> = {
  Marriage:     { label: 'Marriage',      emoji: '💍' },
  GruhaPravesh: { label: 'Gruha Pravesh', emoji: '🏠' },
  BabyNaming:   { label: 'Baby Naming',   emoji: '👶' },
  Vehicle:      { label: 'Vehicle',       emoji: '🚗' },
  Business:     { label: 'Business',      emoji: '💼' },
  Travel:       { label: 'Travel',        emoji: '✈️' },
};

const QUALITY_CFG: Record<Quality, { bg: string; text: string }> = {
  Excellent:  { bg: C.greenDim,  text: '#6DC49A' },
  'Very Good':{ bg: C.greenDim,  text: '#6DC49A' },
  Good:       { bg: C.blueDim,   text: '#7FB3E0' },
  Average:    { bg: C.goldDim,   text: C.gold    },
};

interface MuhurthamDate {
  rank: number;
  date: string;
  tamilDate: string;
  day: string;
  natchathiram: string;
  yogam: string;
  quality: Quality;
  score: number;
  timeSlots: string[];
}

// Muhurtham data per event type
const MUHURTHAM_DATA: Record<EventType, MuhurthamDate[]> = {
  Marriage: [
    { rank:1, date:'April 18, 2026',  tamilDate:'Panguni 5',    day:'Friday',    natchathiram:'Rohini',   yogam:'Siddha Yogam',  quality:'Excellent',  score:96, timeSlots:['06:15–08:30','10:45–12:00'] },
    { rank:2, date:'May 6, 2026',     tamilDate:'Chithirai 23', day:'Wednesday', natchathiram:'Mrigasira',yogam:'Amrita Yogam',  quality:'Very Good',  score:88, timeSlots:['07:00–09:15'] },
    { rank:3, date:'June 12, 2026',   tamilDate:'Vaikasi 29',   day:'Friday',    natchathiram:'Uttara',   yogam:'Shubha Yogam',  quality:'Good',       score:79, timeSlots:['06:45–08:00'] },
    { rank:4, date:'August 21, 2026', tamilDate:'Aadi 6',       day:'Friday',    natchathiram:'Rohini',   yogam:'Amrita Yogam',  quality:'Excellent',  score:93, timeSlots:['06:00–08:15','09:30–11:00'] },
    { rank:5, date:'October 9, 2026', tamilDate:'Purattasi 23', day:'Friday',    natchathiram:'Hasta',    yogam:'Siddha Yogam',  quality:'Very Good',  score:85, timeSlots:['07:30–09:00'] },
  ],
  GruhaPravesh: [
    { rank:1, date:'April 14, 2026',  tamilDate:'Chithirai 1',  day:'Tuesday',   natchathiram:'Ashwini',  yogam:'Shubha Yogam',  quality:'Excellent',  score:95, timeSlots:['07:00–09:00'] },
    { rank:2, date:'May 14, 2026',    tamilDate:'Vaikasi 1',    day:'Thursday',  natchathiram:'Rohini',   yogam:'Amrita Yogam',  quality:'Very Good',  score:89, timeSlots:['08:00–10:00'] },
    { rank:3, date:'July 4, 2026',    tamilDate:'Aani 20',      day:'Saturday',  natchathiram:'Hasta',    yogam:'Siddhi Yogam',  quality:'Good',       score:75, timeSlots:['06:30–08:00'] },
  ],
  BabyNaming: [
    { rank:1, date:'May 3, 2026',     tamilDate:'Chithirai 20', day:'Sunday',    natchathiram:'Punarvasu',yogam:'Amrita Yogam',  quality:'Excellent',  score:94, timeSlots:['09:00–11:00'] },
    { rank:2, date:'June 7, 2026',    tamilDate:'Vaikasi 24',   day:'Sunday',    natchathiram:'Pushya',   yogam:'Shubha Yogam',  quality:'Very Good',  score:87, timeSlots:['10:00–12:00'] },
    { rank:3, date:'July 19, 2026',   tamilDate:'Aani 5',       day:'Sunday',    natchathiram:'Rohini',   yogam:'Siddha Yogam',  quality:'Very Good',  score:86, timeSlots:['08:30–10:30'] },
  ],
  Vehicle: [
    { rank:1, date:'April 25, 2026',  tamilDate:'Chithirai 12', day:'Saturday',  natchathiram:'Rohini',   yogam:'Shubha Yogam',  quality:'Excellent',  score:92, timeSlots:['09:00–11:00'] },
    { rank:2, date:'May 23, 2026',    tamilDate:'Vaikasi 10',   day:'Saturday',  natchathiram:'Mrigasira',yogam:'Amrita Yogam',  quality:'Very Good',  score:84, timeSlots:['10:00–12:00'] },
    { rank:3, date:'June 20, 2026',   tamilDate:'Aani 7',       day:'Saturday',  natchathiram:'Hasta',    yogam:'Siddha Yogam',  quality:'Good',       score:78, timeSlots:['08:00–10:00'] },
  ],
  Business: [
    { rank:1, date:'April 7, 2026',   tamilDate:'Panguni 25',   day:'Tuesday',   natchathiram:'Uttara',   yogam:'Shubha Yogam',  quality:'Excellent',  score:91, timeSlots:['09:30–11:00'] },
    { rank:2, date:'May 12, 2026',    tamilDate:'Chithirai 29', day:'Tuesday',   natchathiram:'Rohini',   yogam:'Amrita Yogam',  quality:'Very Good',  score:86, timeSlots:['10:00–12:00'] },
    { rank:3, date:'June 16, 2026',   tamilDate:'Vaikasi 3',    day:'Tuesday',   natchathiram:'Pushya',   yogam:'Siddhi Yogam',  quality:'Good',       score:77, timeSlots:['07:00–09:00'] },
  ],
  Travel: [
    { rank:1, date:'April 9, 2026',   tamilDate:'Panguni 27',   day:'Thursday',  natchathiram:'Ashwini',  yogam:'Shubha Yogam',  quality:'Excellent',  score:90, timeSlots:['06:00–08:00'] },
    { rank:2, date:'May 7, 2026',     tamilDate:'Chithirai 24', day:'Thursday',  natchathiram:'Rohini',   yogam:'Amrita Yogam',  quality:'Very Good',  score:83, timeSlots:['07:00–09:00'] },
    { rank:3, date:'June 4, 2026',    tamilDate:'Vaikasi 21',   day:'Thursday',  natchathiram:'Mrigasira',yogam:'Siddha Yogam',  quality:'Good',       score:76, timeSlots:['06:30–08:30'] },
  ],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const MuhurthamCard = ({
  item,
  onPress,
}: {
  item: MuhurthamDate;
  onPress: () => void;
}) => {
  const qcfg = QUALITY_CFG[item.quality];
  return (
    <TouchableOpacity style={styles.mCard} onPress={onPress} activeOpacity={0.8}>
      {/* Rank badge */}
      <View style={[styles.rankBox, item.rank === 1 && styles.rankBoxGold]}>
        <Text style={[styles.rankNum, item.rank === 1 && styles.rankNumGold]}>
          {item.rank}
        </Text>
      </View>

      {/* Date info */}
      <View style={styles.mInfo}>
        <Text style={styles.mDate}>{item.date}</Text>
        <Text style={styles.mSub}>{item.day}  ·  {item.tamilDate}</Text>
        <Text style={styles.mStar}>
          ★  {item.natchathiram}  ·  {item.yogam}
        </Text>
        {/* Time slots */}
        <View style={styles.mSlots}>
          {item.timeSlots.map((t, i) => (
            <View key={i} style={styles.mSlotPill}>
              <Text style={styles.mSlotText}>⏰ {t}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quality + score */}
      <View style={styles.mRight}>
        <View style={[styles.qualBadge, { backgroundColor: qcfg.bg }]}>
          <Text style={[styles.qualText, { color: qcfg.text }]}>{item.quality}</Text>
        </View>
        <Text style={styles.scoreText}>{item.score}/100</Text>
        {/* Score bar */}
        <View style={styles.scoreBar}>
          <View style={[styles.scoreFill, { width: `${item.score}%` as any, backgroundColor: qcfg.text }]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;
  isPremium?: boolean;
}

export default function MuhurthamScreen({ navigation, isPremium = false }: Props) {
  const [eventType, setEventType] = useState<EventType>('Marriage');

  const EVENT_TYPES = Object.keys(EVENT_LABELS) as EventType[];
  const results = MUHURTHAM_DATA[eventType];

  // Gate screen for non-premium users
  if (!isPremium) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={C.surface} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Muhurtham Finder</Text>
          <View style={styles.premBadge}>
            <Text style={styles.premBadgeText}>★ Premium</Text>
          </View>
        </View>
        <View style={styles.gateContainer}>
          <Text style={styles.gateEmoji}>⭐</Text>
          <Text style={styles.gateTitle}>Premium Feature</Text>
          <Text style={styles.gateSub}>
            Muhurtham AI Finder is available to Premium subscribers.
            Upgrade to get the best auspicious dates ranked by
            Panchangam quality score.
          </Text>
          <TouchableOpacity
            style={styles.gateBtn}
            onPress={() => navigation?.navigate('Premium')}
            activeOpacity={0.88}
          >
            <Text style={styles.gateBtnText}>Unlock with Premium  👑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation?.navigate('Home')}
            style={styles.gateBackBtn}
          >
            <Text style={styles.gateBackText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Muhurtham Finder</Text>
        <View style={styles.premBadge}>
          <Text style={styles.premBadgeText}>★ Premium</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* AI Feature banner */}
        <View style={styles.aiBanner}>
          <View style={styles.aiTag}>
            <Text style={styles.aiTagText}>AI FEATURE</Text>
          </View>
          <Text style={styles.aiTitle}>Smart Muhurtham Suggestion</Text>
          <Text style={styles.aiSub}>
            Pick event type → get best auspicious dates ranked by
            Panchangam quality score
          </Text>
        </View>

        {/* Event type selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EVENT TYPE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeRow}
          >
            {EVENT_TYPES.map(t => {
              const { label, emoji } = EVENT_LABELS[t];
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.typePill, eventType === t && styles.typePillActive]}
                  onPress={() => setEventType(t)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.typeEmoji}>{emoji}</Text>
                  <Text style={[styles.typeText, eventType === t && styles.typeTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            TOP DATES FOR {EVENT_LABELS[eventType].label.toUpperCase()}
          </Text>
          {results.map(item => (
            <MuhurthamCard
              key={item.rank}
              item={item}
              onPress={() => navigation?.navigate('MuhurthamResult', { item })}
            />
          ))}
        </View>

        {/* Info note */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Dates are ranked using Tithi, Natchathiram, Yogam, and Karanam
            quality scores from the offline Panchangam data. Consult a
            traditional Jothidar for final confirmation.
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

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
  headerTitle: { fontSize: 15, color: C.text, fontFamily: F.medium, fontWeight: '500' },
  premBadge: {
    backgroundColor: C.goldDim,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  premBadgeText: { fontSize: 11, color: C.gold, fontFamily: F.semiBold, fontWeight: '600' },

  // AI Banner
  aiBanner: {
    backgroundColor: C.purpleDim,
    borderWidth: 1,
    borderColor: 'rgba(155,89,182,0.3)',
    borderRadius: 14,
    margin: 16,
    marginBottom: 4,
    padding: 14,
  },
  aiTag: {
    backgroundColor: 'rgba(155,89,182,0.25)',
    borderRadius: 20,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  aiTagText:  { fontSize: 9, color: '#C39BD3', fontFamily: F.bold, fontWeight: '700', letterSpacing: 0.5 },
  aiTitle:    { fontSize: 15, color: C.text, fontFamily: F.semiBold, fontWeight: '600' },
  aiSub:      { fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 18, fontFamily: F.regular },

  // Section
  section:      { paddingHorizontal: 16, marginTop: 12 },
  sectionTitle: {
    fontFamily: F.semiBold,
    fontSize: 11,
    color: C.saffron,
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '600',
  },

  // Event type pills
  typeRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
  },
  typePillActive:  { backgroundColor: C.saffron, borderColor: C.saffron },
  typeEmoji:       { fontSize: 14 },
  typeText:        { fontSize: 13, color: C.muted, fontFamily: F.medium, fontWeight: '500' },
  typeTextActive:  { color: '#fff' },

  // Muhurtham cards
  mCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  rankBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: C.surface3,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  rankBoxGold: { borderColor: C.gold, backgroundColor: C.goldDim },
  rankNum:     { fontSize: 18, color: C.muted, fontFamily: F.bold, fontWeight: '700' },
  rankNumGold: { color: C.gold },

  mInfo:  { flex: 1 },
  mDate:  { fontSize: 14, color: C.text, fontFamily: F.semiBold, fontWeight: '600' },
  mSub:   { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2 },
  mStar:  { fontSize: 11, color: C.gold, fontFamily: F.regular, marginTop: 3 },
  mSlots: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  mSlotPill: {
    backgroundColor: C.surface3,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.border,
  },
  mSlotText: { fontSize: 10, color: C.muted, fontFamily: F.regular },

  mRight:    { alignItems: 'flex-end', gap: 4 },
  qualBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  qualText:  { fontSize: 11, fontFamily: F.semiBold, fontWeight: '600' },
  scoreText: { fontSize: 11, color: C.muted, fontFamily: F.regular },
  scoreBar:  {
    width: 56,
    height: 3,
    backgroundColor: C.surface3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreFill: { height: 3, borderRadius: 2 },

  // Info box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: C.surface2,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  infoIcon: { fontSize: 16, marginTop: 1 },
  infoText: { flex: 1, fontSize: 12, color: C.muted, lineHeight: 18, fontFamily: F.regular },

  // Gate screen
  gateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  gateEmoji: { fontSize: 52 },
  gateTitle: { fontSize: 22, color: C.text, fontFamily: F.bold, fontWeight: '700' },
  gateSub: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: F.regular,
  },
  gateBtn: {
    backgroundColor: C.premAmber,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
  },
  gateBtnText: { fontSize: 15, color: '#1A0800', fontFamily: F.bold, fontWeight: '700' },
  gateBackBtn: { marginTop: 4, padding: 8 },
  gateBackText:{ fontSize: 13, color: C.muted, fontFamily: F.regular },

  bottomPad: { height: 24 },
});
