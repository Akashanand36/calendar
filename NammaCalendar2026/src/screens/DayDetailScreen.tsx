// DayDetailScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';
import { PanchangamService } from '@services/PanchangamService';
import { formatDisplayDate, formatDayName, to12h } from '@utils/dateUtils';

export default function DayDetailScreen() {
  const router       = useRouter();
  const selectedDate = useSelector((s: RootState) => s.calendar.selectedDate);
  const panchang     = PanchangamService.getDay(selectedDate);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>{formatDisplayDate(selectedDate)}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        {panchang ? (
          <>
            <View style={s.dayStrip}>
              <Text style={s.stripTamilDate}>{panchang.tamilDate}</Text>
              <Text style={s.stripDay}>{formatDayName(selectedDate)}</Text>
            </View>
            {[
              { label: 'Tithi',        value: panchang.tithi,        time: panchang.tithiEnd },
              { label: 'Natchathiram', value: panchang.natchathiram, time: panchang.natchathiramEnd },
              { label: 'Yogam',        value: panchang.yogam,        time: panchang.yogamEnd },
              { label: 'Karanam',      value: panchang.karanam,      time: panchang.karanamEnd },
            ].map(item => (
              <View key={item.label} style={s.row}>
                <Text style={s.rowLabel}>{item.label}</Text>
                <Text style={s.rowValue}>{item.value}</Text>
                <Text style={s.rowTime}>Until {to12h(item.time)}</Text>
              </View>
            ))}
            <View style={s.row}>
              <Text style={s.rowLabel}>Sunrise</Text>
              <Text style={s.rowValue}>{to12h(panchang.sunrise)}</Text>
              <Text style={s.rowTime}>Sunset {to12h(panchang.sunset)}</Text>
            </View>
            {panchang.festivals.length > 0 && (
              <View style={s.festivalBox}>
                <Text style={s.festivalTitle}>🎉 Festivals Today</Text>
                {panchang.festivals.map(f => (
                  <Text key={f} style={s.festivalName}>{f}</Text>
                ))}
              </View>
            )}
          </>
        ) : (
          <Text style={{ color: COLORS.muted, padding: 20, fontFamily: FONTS.regular }}>No data for this date.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.bg },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  back:          { fontSize: 22, color: COLORS.saffron },
  title:         { fontSize: FONT_SIZE.base, color: COLORS.text, fontFamily: FONTS.medium },
  scroll:        { padding: 20 },
  dayStrip:      { backgroundColor: COLORS.saffron, borderRadius: 12, padding: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between' },
  stripTamilDate:{ fontFamily: FONTS.tamilSemiBold, fontSize: 16, color: '#fff' },
  stripDay:      { fontSize: FONT_SIZE.base, color: 'rgba(255,255,255,0.85)', fontFamily: FONTS.medium },
  row:           { backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel:      { fontSize: FONT_SIZE.sm, color: COLORS.muted, fontFamily: FONTS.regular, width: 100 },
  rowValue:      { fontSize: FONT_SIZE.sm, color: COLORS.text, fontFamily: FONTS.medium, flex: 1 },
  rowTime:       { fontSize: FONT_SIZE.xs, color: COLORS.gold, fontFamily: FONTS.regular },
  festivalBox:   { backgroundColor: 'rgba(155,89,182,0.12)', borderWidth: 1, borderColor: 'rgba(155,89,182,0.3)', borderRadius: 12, padding: 14, marginTop: 8 },
  festivalTitle: { fontSize: FONT_SIZE.base, color: COLORS.text, fontFamily: FONTS.medium, marginBottom: 6 },
  festivalName:  { fontSize: FONT_SIZE.sm, color: '#C39BD3', fontFamily: FONTS.regular, marginTop: 3 },
});
