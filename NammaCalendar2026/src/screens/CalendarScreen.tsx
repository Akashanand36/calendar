/**
 * CalendarScreen.tsx
 * நம்ம Calendar 2026 — Calendar Screen
 *
 * Paste into: src/screens/CalendarScreen.tsx
 */

import React, { useState, useMemo } from 'react';
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
  bg:       '#0D0D0D',
  surface:  '#1C1410',
  surface2: '#261C15',
  surface3: '#2E231A',
  text:     '#F5EDD8',
  muted:    '#A08060',
  border:   'rgba(232,96,10,0.20)',
  green:    '#4CAF7A',
  greenDim: 'rgba(76,175,122,0.14)',
  red:      '#E55A4E',
  blue:     '#5B9BD5',
  blueDim:  'rgba(91,155,213,0.14)',
  purple:   '#9B59B6',
  purpleDim:'rgba(155,89,182,0.14)',
} as const;

const F = {
  regular:  'System',
  medium:   'System',
  semiBold: 'System',
  bold:     'System',
  tamil:    'System',
  tamilBold:'System',
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const TAMIL_MONTHS = [
  'சித்திரை','வைகாசி','ஆனி','ஆடி',
  'ஆவணி','புரட்டாசி','ஐப்பசி','கார்த்திகை',
  'மார்கழி','தை','மாசி','பங்குனி',
];

const TAMIL_DIGITS = [
  '','௧','௨','௩','௪','௫','௬','௭','௮','௯','௧௦',
  '௧௧','௧௨','௧௩','௧௪','௧௫','௧௬','௧௭','௧௮','௧௯','௨௦',
  '௨௧','௨௨','௨௩','௨௪','௨௫','௨௬','௨௭','௨௮','௨௯','௩௦','௩௧',
];

// Tamil month index offset per Gregorian month (approximate solar entry)
const TAMIL_MONTH_MAP: Record<number, number> = {
  1: 9,  // Jan → தை
  2: 10, // Feb → மாசி
  3: 11, // Mar → பங்குனி
  4: 0,  // Apr → சித்திரை
  5: 1,  // May → வைகாசி
  6: 2,  // Jun → ஆனி
  7: 3,  // Jul → ஆடி
  8: 4,  // Aug → ஆவணி
  9: 5,  // Sep → புரட்டாசி
  10: 6, // Oct → ஐப்பசி
  11: 7, // Nov → கார்த்திகை
  12: 8, // Dec → மார்கழி
};

// Festival dates: 'YYYY-MM-DD' → { name, category, isHoliday }
const FESTIVAL_MAP: Record<string, { name: string; category: string; isHoliday: boolean }[]> = {
  '2026-01-14': [{ name: 'Thai Pongal',        category: 'Tamil',     isHoliday: true  }],
  '2026-01-26': [{ name: 'Republic Day',        category: 'National',  isHoliday: true  }],
  '2026-02-26': [{ name: 'Maha Shivaratri',     category: 'Hindu',     isHoliday: true  }],
  '2026-03-14': [{ name: 'Holi',                category: 'Hindu',     isHoliday: true  }],
  '2026-03-25': [{ name: 'Panguni Uthiram',     category: 'Hindu',     isHoliday: false }],
  '2026-04-03': [{ name: 'Good Friday',         category: 'Christian', isHoliday: true  }],
  '2026-04-14': [{ name: 'Tamil New Year',      category: 'Tamil',     isHoliday: true  },
                 { name: 'Dr. Ambedkar Jayanti',category: 'National',  isHoliday: true  }],
  '2026-04-20': [{ name: 'Eid al-Fitr',         category: 'Muslim',    isHoliday: true  }],
  '2026-05-01': [{ name: 'Labour Day',          category: 'National',  isHoliday: true  }],
  '2026-06-27': [{ name: 'Eid al-Adha',         category: 'Muslim',    isHoliday: true  }],
  '2026-08-15': [{ name: 'Independence Day',    category: 'National',  isHoliday: true  }],
  '2026-08-28': [{ name: 'Vinayaka Chaturthi',  category: 'Hindu',     isHoliday: true  }],
  '2026-10-02': [{ name: 'Gandhi Jayanti',      category: 'National',  isHoliday: true  }],
  '2026-10-21': [{ name: 'Vijayadasami',        category: 'Hindu',     isHoliday: true  }],
  '2026-11-03': [{ name: 'Diwali',              category: 'Hindu',     isHoliday: true  }],
  '2026-12-25': [{ name: 'Christmas',           category: 'Christian', isHoliday: true  }],
};

const CATEGORY_CONFIG: Record<string, { dot: string; bg: string; text: string }> = {
  Hindu:    { dot: C.purple, bg: C.purpleDim, text: '#C39BD3' },
  Muslim:   { dot: C.blue,   bg: C.blueDim,   text: '#7FB3E0' },
  Christian:{ dot: C.blue,   bg: C.blueDim,   text: '#7FB3E0' },
  Tamil:    { dot: C.green,  bg: C.greenDim,  text: '#6DC49A' },
  National: { dot: C.saffron,bg: 'rgba(232,96,10,0.14)', text: '#F0915A' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isLeapYear(y: number) {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}
function daysInMonth(y: number, m: number) {
  return [0,31,isLeapYear(y)?29:28,31,30,31,30,31,31,30,31,30,31][m];
}
function pad2(n: number) { return String(n).padStart(2,'0'); }
function dateStr(y: number, m: number, d: number) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}
function getTodayStr() {
  const d = new Date();
  return dateStr(d.getFullYear(), d.getMonth()+1, d.getDate());
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ label }: { label: string }) => (
  <Text style={styles.sectionTitle}>{label}</Text>
);

interface CalCellProps {
  day: number;
  current: boolean;
  isSunday: boolean;
  isToday: boolean;
  isFestival: boolean;
  isHoliday: boolean;
  tamilDigit: string;
  onPress: () => void;
}

const CalCell = ({
  day, current, isSunday, isToday, isFestival, isHoliday, tamilDigit, onPress,
}: CalCellProps) => (
  <TouchableOpacity
    style={[styles.cell, isToday && styles.cellToday, !current && styles.cellOther]}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={!current}
  >
    <Text style={[
      styles.cellNum,
      isSunday && !isToday && styles.cellSunday,
      isToday && styles.cellTodayText,
      !current && styles.cellOtherText,
    ]}>
      {day}
    </Text>
    {current && tamilDigit ? (
      <Text style={[styles.cellTamil, isToday && styles.cellTamilToday]}>
        {tamilDigit}
      </Text>
    ) : null}
    {current && (isFestival || isHoliday) ? (
      <View style={[styles.cellDot, isToday && styles.cellDotToday]} />
    ) : null}
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;
}

export default function CalendarScreen({ navigation }: Props) {
  const today = getTodayStr();
  const todayDate = new Date();

  const [year,  setYear]  = useState(todayDate.getFullYear());
  const [month, setMonth] = useState(todayDate.getMonth() + 1); // 1-based

  const firstDow  = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const numDays   = daysInMonth(year, month);
  const prevDays  = daysInMonth(year, month === 1 ? 12 : month - 1);

  // Build calendar grid: 42 cells (6 weeks)
  const cells = useMemo(() => {
    const arr: { day: number; current: boolean }[] = [];
    for (let i = firstDow - 1; i >= 0; i--)
      arr.push({ day: prevDays - i, current: false });
    for (let d = 1; d <= numDays; d++)
      arr.push({ day: d, current: true });
    const rem = 42 - arr.length;
    for (let d = 1; d <= rem; d++)
      arr.push({ day: d, current: false });
    return arr;
  }, [year, month, firstDow, numDays, prevDays]);

  // Festivals for this month
  const monthFestivals = useMemo(() => {
    const list: { date: string; name: string; category: string; isHoliday: boolean }[] = [];
    for (let d = 1; d <= numDays; d++) {
      const key = dateStr(year, month, d);
      const fests = FESTIVAL_MAP[key];
      if (fests) fests.forEach(f => list.push({ date: key, ...f }));
    }
    return list;
  }, [year, month, numDays]);

  const goMonth = (dir: 1 | -1) => {
    let m = month + dir, y = year;
    if (m > 12) { m = 1;  y++; }
    if (m < 1)  { m = 12; y--; }
    setMonth(m); setYear(y);
  };

  const tamilMonthIdx = TAMIL_MONTH_MAP[month] ?? 0;
  const tamilMonthName = TAMIL_MONTHS[tamilMonthIdx];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calendar 2026</Text>
        <TouchableOpacity onPress={() => navigation?.navigate('Home')}>
          <Text style={styles.headerIcon}>🏠</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Calendar card ── */}
        <View style={styles.calCard}>

          {/* Month navigator */}
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => goMonth(-1)}>
              <Text style={styles.navBtnText}>‹</Text>
            </TouchableOpacity>
            <View style={styles.monthCenter}>
              <Text style={styles.monthName}>{MONTH_NAMES[month - 1]} {year}</Text>
              <Text style={styles.monthTamil}>{tamilMonthName}</Text>
            </View>
            <TouchableOpacity style={styles.navBtn} onPress={() => goMonth(1)}>
              <Text style={styles.navBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day-name header */}
          <View style={styles.dayHeader}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
              <Text key={d} style={[styles.dayName, i === 0 && styles.dayNameSun]}>
                {d}
              </Text>
            ))}
          </View>

          {/* Grid */}
          <View style={styles.grid}>
            {cells.map((cell, idx) => {
              const ds   = cell.current ? dateStr(year, month, cell.day) : '';
              const fests = ds ? FESTIVAL_MAP[ds] : undefined;
              return (
                <CalCell
                  key={idx}
                  day={cell.day}
                  current={cell.current}
                  isSunday={idx % 7 === 0}
                  isToday={ds === today}
                  isFestival={!!fests}
                  isHoliday={!!fests?.some(f => f.isHoliday)}
                  tamilDigit={cell.current ? (TAMIL_DIGITS[cell.day] ?? '') : ''}
                  onPress={() => {
                    if (ds) navigation?.navigate('DayDetail', { date: ds });
                  }}
                />
              );
            })}
          </View>
        </View>

        {/* ── Month highlights ── */}
        <View style={styles.section}>
          <SectionTitle label={`${MONTH_NAMES[month - 1].toUpperCase()} HIGHLIGHTS`} />
          {monthFestivals.length === 0 ? (
            <Text style={styles.emptyText}>No festivals this month</Text>
          ) : (
            monthFestivals.map((f, i) => {
              const cfg = CATEGORY_CONFIG[f.category] ?? CATEGORY_CONFIG.National;
              return (
                <View key={i} style={styles.festRow}>
                  <View style={[styles.festDot, { backgroundColor: cfg.dot }]} />
                  <View style={styles.festInfo}>
                    <Text style={styles.festName}>{f.name}</Text>
                    <Text style={styles.festDate}>
                      {f.date.slice(8)} {MONTH_NAMES[month - 1]}
                      {f.isHoliday ? '  ·  Holiday' : ''}
                    </Text>
                  </View>
                  <View style={[styles.festTag, { backgroundColor: cfg.bg }]}>
                    <Text style={[styles.festTagText, { color: cfg.text }]}>
                      {f.category}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CELL_SIZE = (340 - 16) / 7; // approximate — adjust for your screen width

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
  headerIcon:  { fontSize: 20 },

  // Calendar card
  calCard: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    margin: 16,
    overflow: 'hidden',
  },

  // Month nav
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.surface3,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  navBtn:     { padding: 4 },
  navBtnText: { fontSize: 24, color: C.saffron, lineHeight: 28 },
  monthCenter:{ alignItems: 'center' },
  monthName:  { fontSize: 15, color: C.text, fontFamily: F.medium, fontWeight: '500' },
  monthTamil: { fontSize: 11, color: C.muted, fontFamily: F.tamil, marginTop: 1 },

  // Day header row
  dayHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 2,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: C.muted,
    fontFamily: F.medium,
    fontWeight: '500',
  },
  dayNameSun: { color: C.red },

  // Calendar grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    position: 'relative',
  },
  cellToday:    { backgroundColor: C.saffron },
  cellOther:    { opacity: 0.35 },
  cellNum:      { fontSize: 13, color: C.text, fontFamily: F.regular },
  cellSunday:   { color: C.red },
  cellTodayText:{ color: '#fff', fontFamily: F.bold, fontWeight: '700' },
  cellOtherText:{ color: C.muted },
  cellTamil: {
    fontSize: 7,
    color: C.gold,
    fontFamily: F.tamil,
    marginTop: -1,
    lineHeight: 9,
  },
  cellTamilToday: { color: 'rgba(255,255,255,0.7)' },
  cellDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.gold,
    position: 'absolute',
    bottom: 3,
  },
  cellDotToday: { backgroundColor: 'rgba(255,255,255,0.7)' },

  // Festival list
  section:   { paddingHorizontal: 16, paddingTop: 4 },
  sectionTitle: {
    fontFamily: F.semiBold,
    fontSize: 11,
    color: C.saffron,
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: '600',
  },
  emptyText: { fontSize: 13, color: C.muted, fontFamily: F.regular },
  festRow: {
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
  festDot:     { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  festInfo:    { flex: 1 },
  festName:    { fontSize: 13, color: C.text, fontFamily: F.medium, fontWeight: '500' },
  festDate:    { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2 },
  festTag:     { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  festTagText: { fontSize: 10, fontFamily: F.semiBold, fontWeight: '600' },

  bottomPad: { height: 24 },
});
