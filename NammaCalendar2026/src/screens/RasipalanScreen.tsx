/**
 * RasipalanScreen.tsx
 * நம்ம Calendar 2026 — Rasipalan (Horoscope) Screen
 *
 * Paste into: src/screens/RasipalanScreen.tsx
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
  saffron:  '#E8600A',
  gold:     '#F5A623',
  goldDim:  'rgba(245,166,35,0.18)',
  premGold: '#FFD166',
  bg:       '#0D0D0D',
  surface:  '#1C1410',
  surface2: '#261C15',
  surface3: '#2E231A',
  text:     '#F5EDD8',
  muted:    '#A08060',
  border:   'rgba(232,96,10,0.20)',
  green:    '#4CAF7A',
  red:      '#E55A4E',
  lockBg:   'rgba(232,96,10,0.08)',
  lockBorder:'rgba(255,209,102,0.25)',
} as const;

const F = {
  regular:  'System',
  medium:   'System',
  semiBold: 'System',
  bold:     'System',
  tamil:    'System',
} as const;

// ─── Rasi Data ────────────────────────────────────────────────────────────────

type Period   = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
type RasiName =
  | 'Mesham' | 'Rishabam' | 'Midhunam' | 'Kadagam'
  | 'Simmam' | 'Kanni'    | 'Thulam'   | 'Viruchigam'
  | 'Thanusu'| 'Magaram'  | 'Kumbam'   | 'Meenam';

const RASIS: { name: RasiName; symbol: string; tamil: string }[] = [
  { name: 'Mesham',     symbol: '♈', tamil: 'மேஷம்'       },
  { name: 'Rishabam',   symbol: '♉', tamil: 'ரிஷபம்'      },
  { name: 'Midhunam',   symbol: '♊', tamil: 'மிதுனம்'     },
  { name: 'Kadagam',    symbol: '♋', tamil: 'கடகம்'       },
  { name: 'Simmam',     symbol: '♌', tamil: 'சிம்மம்'     },
  { name: 'Kanni',      symbol: '♍', tamil: 'கன்னி'       },
  { name: 'Thulam',     symbol: '♎', tamil: 'துலாம்'      },
  { name: 'Viruchigam', symbol: '♏', tamil: 'விருச்சிகம்' },
  { name: 'Thanusu',    symbol: '♐', tamil: 'தனுசு'       },
  { name: 'Magaram',    symbol: '♑', tamil: 'மகரம்'       },
  { name: 'Kumbam',     symbol: '♒', tamil: 'கும்பம்'     },
  { name: 'Meenam',     symbol: '♓', tamil: 'மீனம்'       },
];

const PREDICTIONS: Record<RasiName, Record<Period, string>> = {
  Mesham: {
    Daily:   'Today is highly favorable for financial decisions. Mars gives you courage to tackle long-pending matters. Family harmony prevails. Career prospects look bright.',
    Weekly:  'This week brings opportunities in career and finance. Mid-week may bring a minor challenge — stay patient. Weekend is excellent for family bonding.',
    Monthly: 'March brings growth in professional life. Relationships need nurturing. Avoid major financial risks in the first two weeks. Health is stable.',
    Yearly:  '2026 is a transformative year for Mesham. Career advancements, possible relocation, and new financial opportunities await. Family life is harmonious.',
  },
  Rishabam: {
    Daily:   'Venus blesses relationships today. A pleasant surprise from a loved one is likely. Focus on health — avoid heavy meals. Good day for creative work.',
    Weekly:  'Relationships are in focus this week. A long-standing issue at work gets resolved. Financial gains possible through a side project.',
    Monthly: 'A month of stability and comfort. Romance is favored. Career moves benefit from patience rather than haste.',
    Yearly:  'Rishabam enjoys a year of steady progress. Love life blossoms. Investments made this year will yield returns in 2027.',
  },
  Midhunam: {
    Daily:   'Mercury favors communication today. Ideal for meetings, contracts, and travel. A misunderstanding from last week will resolve naturally.',
    Weekly:  'Your words carry extra power this week. A business proposal gains traction. Travel plans come together smoothly.',
    Monthly: 'March favors learning, travel, and communication. A new skill or course can open doors. Siblings play an important role.',
    Yearly:  'Midhunam thrives in 2026 through networking and learning. Multiple income sources develop. Health requires attention mid-year.',
  },
  Kadagam: {
    Daily:   'Moon energy is strong. Emotional intelligence is your superpower. Help someone in need — good karma flows back. Avoid impulsive spending.',
    Weekly:  'Home and family take priority. A property-related matter gets clarity. Thursday and Friday are particularly auspicious.',
    Monthly: 'Family events and home renovations dominate March. Emotionally fulfilling month. Career is stable but not exciting.',
    Yearly:  'Kadagam experiences deep personal growth in 2026. Spiritual inclination increases. Mid-year brings an unexpected financial windfall.',
  },
  Simmam: {
    Daily:   'Sun is in a strong position. Leadership opportunities arise. Health is excellent. A past investment may show positive returns.',
    Weekly:  'You command attention this week. New responsibilities at work. A creative project gets appreciated. Avoid arrogance.',
    Monthly: 'March is your time to shine. Recognition and appreciation come your way. Guard against overconfidence in financial decisions.',
    Yearly:  'Simmam rules 2026 with confidence. Career peaks around June–August. Romance is vibrant. Health is robust throughout.',
  },
  Kanni: {
    Daily:   'Detail-oriented tasks go smoothly. Perfect day to clear backlogs. Romance is in the air for single folks. Stomach health needs attention.',
    Weekly:  'Precision and hard work pay off this week. A colleague becomes a valuable ally. Weekend brings needed rest.',
    Monthly: 'March rewards diligence. A meticulous approach to finances helps. Health checkup recommended.',
    Yearly:  'Kanni makes significant career progress through dedication in 2026. A methodical approach to savings yields results by year-end.',
  },
  Thulam: {
    Daily:   'Venus-ruled day favors partnerships. Balance in decisions is key. Avoid signing important documents in the afternoon. Evening brings good news.',
    Weekly:  'Business partnerships and personal relationships both need balancing. Wednesday is ideal for negotiations.',
    Monthly: 'March highlights partnerships and legal matters. A collaborative project succeeds. Social life is active.',
    Yearly:  'Thulam finds balance in all areas of life in 2026. Marriage or committed relationships strengthen. Career benefits from teamwork.',
  },
  Viruchigam: {
    Daily:   'Mars gives intensity today. Avoid arguments with family. Career achievements are on the horizon. Stay patient and focused.',
    Weekly:  'Deep research and investigation yield results. An old enemy becomes neutral. Financial discipline is crucial.',
    Monthly: 'March brings transformation. Hidden matters come to light. A health concern resolves after long delay.',
    Yearly:  'Viruchigam undergoes powerful transformation in 2026. Career changes bring long-term benefits. Spiritual practice provides stability.',
  },
  Thanusu: {
    Daily:   'Jupiter blesses learning and growth. A long journey may be on the cards. Health is stable. Younger ones in the family need attention.',
    Weekly:  'Expansion and optimism characterize this week. Higher education or training pays off. Travel plans are favorable.',
    Monthly: 'March broadens your horizons. Foreign connections benefit career. Philosophy and spirituality attract you.',
    Yearly:  'Thanusu expands horizons in 2026 through travel, education, and spiritual growth. Financial luck is above average.',
  },
  Magaram: {
    Daily:   'Saturn rewards discipline today. Stick to schedules. Financial gains possible through careful planning. Avoid shortcuts in important work.',
    Weekly:  'Hard work and persistence bring recognition. A senior at work shows appreciation. Weekend offers much-needed relaxation.',
    Monthly: 'March rewards patience and discipline. Government-related matters resolve favorably. Health needs consistent attention.',
    Yearly:  'Magaram reaps rewards of past efforts in 2026. Career reaches a milestone. Property investments are favorable.',
  },
  Kumbam: {
    Daily:   'Rahu aspects favor technology and innovation. A unique solution to an old problem strikes you. Friendships are strengthened today.',
    Weekly:  'Innovative ideas get recognition. Social media or digital work brings opportunities. A reunion with old friends is refreshing.',
    Monthly: 'March is unconventional and exciting. A sudden opportunity appears from an unexpected source. Health improves significantly.',
    Yearly:  'Kumbam thrives through innovation and social connections in 2026. Technology-related work prospers. Friendships deepen into lifelong bonds.',
  },
  Meenam: {
    Daily:   'Neptune brings spiritual insight. Meditation or temple visits are highly rewarding. Avoid major financial decisions until evening.',
    Weekly:  'Intuition guides you well this week. Creative and spiritual pursuits are fulfilling. A dream or intuition reveals something important.',
    Monthly: 'March deepens spiritual awareness. Creative projects flourish. Be cautious of over-idealism in financial matters.',
    Yearly:  'Meenam finds profound fulfillment in 2026 through creativity and spirituality. A creative project gains unexpected recognition mid-year.',
  },
};

const LUCKY_DATA: Record<RasiName, { number: number; color: string; direction: string; rating: number }> = {
  Mesham:     { number: 6,  color: 'Red',       direction: 'East',  rating: 4 },
  Rishabam:   { number: 2,  color: 'White',     direction: 'South', rating: 5 },
  Midhunam:   { number: 5,  color: 'Green',     direction: 'West',  rating: 3 },
  Kadagam:    { number: 4,  color: 'Silver',    direction: 'North', rating: 4 },
  Simmam:     { number: 1,  color: 'Gold',      direction: 'East',  rating: 5 },
  Kanni:      { number: 3,  color: 'Grey',      direction: 'South', rating: 3 },
  Thulam:     { number: 7,  color: 'Blue',      direction: 'West',  rating: 4 },
  Viruchigam: { number: 9,  color: 'Maroon',    direction: 'North', rating: 3 },
  Thanusu:    { number: 8,  color: 'Yellow',    direction: 'East',  rating: 4 },
  Magaram:    { number: 10, color: 'Black',      direction: 'South', rating: 5 },
  Kumbam:     { number: 11, color: 'Violet',    direction: 'West',  rating: 4 },
  Meenam:     { number: 3,  color: 'Sea Green', direction: 'North', rating: 4 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const RatingStars = ({ rating }: { rating: number }) => (
  <View style={styles.starsRow}>
    {[1,2,3,4,5].map(i => (
      <Text key={i} style={{ color: i <= rating ? C.gold : C.muted, fontSize: 12 }}>★</Text>
    ))}
  </View>
);

const LockedOverlay = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.lockedBanner} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.lockedIcon}>👑</Text>
    <View style={styles.lockedText}>
      <Text style={styles.lockedTitle}>Premium Feature</Text>
      <Text style={styles.lockedSub}>Upgrade to access Weekly, Monthly & Yearly Rasipalan</Text>
    </View>
    <Text style={styles.lockedArrow}>›</Text>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;
  defaultRasi?: RasiName;
  isPremium?: boolean;
}

export default function RasipalanScreen({
  navigation,
  defaultRasi = 'Mesham',
  isPremium = false,
}: Props) {
  const [selectedRasi, setSelectedRasi] = useState<RasiName>(defaultRasi);
  const [period, setPeriod] = useState<Period>('Daily');

  const PERIODS: Period[] = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  const rasi    = RASIS.find(r => r.name === selectedRasi)!;
  const lucky   = LUCKY_DATA[selectedRasi];
  const predText = PREDICTIONS[selectedRasi][period];
  const isLocked = !isPremium && period !== 'Daily';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rasipalan · ராசிபலன்</Text>
        <Text style={styles.headerDate}>March 23, 2026</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Period tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {PERIODS.map(p => {
            const locked = !isPremium && p !== 'Daily';
            return (
              <TouchableOpacity
                key={p}
                style={[styles.tab, period === p && styles.tabActive]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.75}
              >
                <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                  {p}{locked ? ' 👑' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Rasi grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT YOUR RASI</Text>
          <View style={styles.rasiGrid}>
            {RASIS.map(r => (
              <TouchableOpacity
                key={r.name}
                style={[styles.rasiCard, selectedRasi === r.name && styles.rasiCardSel]}
                onPress={() => setSelectedRasi(r.name)}
                activeOpacity={0.75}
              >
                <Text style={styles.rasiSymbol}>{r.symbol}</Text>
                <Text style={styles.rasiName}>{r.name}</Text>
                <Text style={styles.rasiTamil}>{r.tamil}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prediction panel */}
        <View style={styles.predPanel}>
          <View style={styles.predHeader}>
            <View style={styles.predHeaderLeft}>
              <Text style={styles.predSign}>
                {rasi.symbol}  {rasi.name}
              </Text>
              <Text style={styles.predTamil}>{rasi.tamil}</Text>
              <View style={styles.predMeta}>
                <Text style={styles.predPeriod}>{period}</Text>
                <RatingStars rating={lucky.rating} />
              </View>
            </View>
            <Text style={styles.predSymbolBig}>{rasi.symbol}</Text>
          </View>

          <View style={styles.predDivider} />

          {isLocked ? (
            <LockedOverlay onPress={() => navigation?.navigate('Premium')} />
          ) : (
            <>
              <Text style={styles.predText}>{predText}</Text>
              <View style={styles.luckyRow}>
                <View style={styles.luckyPill}>
                  <Text style={styles.luckyLabel}>Number</Text>
                  <Text style={styles.luckyVal}>{lucky.number}</Text>
                </View>
                <View style={styles.luckyPill}>
                  <Text style={styles.luckyLabel}>Color</Text>
                  <Text style={styles.luckyVal}>{lucky.color}</Text>
                </View>
                <View style={styles.luckyPill}>
                  <Text style={styles.luckyLabel}>Direction</Text>
                  <Text style={styles.luckyVal}>{lucky.direction}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* All Rasis quick summary */}
        {!isLocked && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ALL RASI OVERVIEW — {period.toUpperCase()}</Text>
            {RASIS.map(r => {
              const l = LUCKY_DATA[r.name];
              return (
                <TouchableOpacity
                  key={r.name}
                  style={styles.overviewRow}
                  onPress={() => setSelectedRasi(r.name)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.overviewSymbol}>{r.symbol}</Text>
                  <View style={styles.overviewInfo}>
                    <Text style={styles.overviewName}>{r.name}</Text>
                    <Text style={styles.overviewTamil}>{r.tamil}</Text>
                  </View>
                  <RatingStars rating={l.rating} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
  headerDate:  { fontSize: 12, color: C.muted, fontFamily: F.regular },

  // Period tabs
  tabScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8, flexDirection: 'row' },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
  },
  tabActive:    { backgroundColor: C.saffron, borderColor: C.saffron },
  tabText:      { fontSize: 13, color: C.muted, fontFamily: F.medium, fontWeight: '500' },
  tabTextActive:{ color: '#fff' },

  // Section
  section:      { paddingHorizontal: 16, marginBottom: 4 },
  sectionTitle: {
    fontFamily: F.semiBold,
    fontSize: 11,
    color: C.saffron,
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '600',
  },

  // Rasi grid
  rasiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  rasiCard: {
    width: '22%',
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  rasiCardSel:   { borderColor: C.saffron },
  rasiSymbol:    { fontSize: 20, marginBottom: 3 },
  rasiName:      { fontSize: 11, color: C.text, fontFamily: F.medium, fontWeight: '500', textAlign: 'center' },
  rasiTamil:     { fontSize: 9, color: C.muted, fontFamily: F.tamil, textAlign: 'center', marginTop: 1 },

  // Prediction panel
  predPanel: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  predHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  predHeaderLeft: { flex: 1 },
  predSign:       { fontSize: 16, color: C.text, fontFamily: F.semiBold, fontWeight: '600' },
  predTamil:      { fontSize: 12, color: C.muted, fontFamily: F.tamil, marginTop: 2 },
  predMeta:       { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  predPeriod: {
    fontSize: 10,
    color: C.saffron,
    backgroundColor: 'rgba(232,96,10,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    fontFamily: F.medium,
    fontWeight: '600',
  },
  starsRow:       { flexDirection: 'row', gap: 2 },
  predSymbolBig:  { fontSize: 32, marginLeft: 8 },
  predDivider:    { height: 1, backgroundColor: C.border, marginVertical: 12 },
  predText:       { fontSize: 13, color: C.muted, lineHeight: 21, fontFamily: F.regular },

  // Lucky row
  luckyRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  luckyPill: {
    backgroundColor: C.surface3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  luckyLabel: { fontSize: 9, color: C.muted, fontFamily: F.medium, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  luckyVal:   { fontSize: 13, color: C.gold, fontFamily: F.medium, fontWeight: '500', marginTop: 2 },

  // Locked banner
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.lockBg,
    borderWidth: 1,
    borderColor: C.lockBorder,
    borderRadius: 12,
    padding: 14,
  },
  lockedIcon:  { fontSize: 24 },
  lockedText:  { flex: 1 },
  lockedTitle: { fontSize: 14, color: C.premGold, fontFamily: F.semiBold, fontWeight: '600' },
  lockedSub:   { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2, lineHeight: 16 },
  lockedArrow: { fontSize: 20, color: C.premGold },

  // All rasi overview
  overviewRow: {
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
  overviewSymbol: { fontSize: 22, width: 30, textAlign: 'center' },
  overviewInfo:   { flex: 1 },
  overviewName:   { fontSize: 13, color: C.text, fontFamily: F.medium, fontWeight: '500' },
  overviewTamil:  { fontSize: 10, color: C.muted, fontFamily: F.tamil, marginTop: 1 },

  bottomPad: { height: 24 },
});
