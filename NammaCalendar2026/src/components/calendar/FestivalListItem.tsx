import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';
import { formatDisplayDate } from '@utils/dateUtils';

interface Props { name: string; date: string; isHoliday: boolean; category?: string; }

const CATEGORY_COLORS: Record<string, string> = {
  Hindu: COLORS.purple, Muslim: '#5B9BD5', Christian: COLORS.blue,
  Tamil: COLORS.green,  National: COLORS.saffron,
};

export default function FestivalListItem({ name, date, isHoliday, category = 'Hindu' }: Props) {
  const router = useRouter();
  const color  = CATEGORY_COLORS[category] ?? COLORS.gold;

  return (
    <TouchableOpacity
      style={s.item}
      onPress={() => router.push('/festival-detail')}
      activeOpacity={0.75}
    >
      <View style={[s.dot, { backgroundColor: color }]} />
      <View style={s.info}>
        <Text style={s.name}>{name}</Text>
        <Text style={s.date}>{formatDisplayDate(date)}{isHoliday ? ' · Holiday' : ''}</Text>
      </View>
      <View style={[s.tag, { backgroundColor: `${color}22` }]}>
        <Text style={[s.tagTxt, { color }]}>{category}</Text>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  item:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10, marginBottom: 8 },
  dot:    { width: 8, height: 8, borderRadius: 4 },
  info:   { flex: 1 },
  name:   { fontSize: FONT_SIZE.sm, color: COLORS.text, fontFamily: FONTS.medium },
  date:   { fontSize: FONT_SIZE.xs, color: COLORS.muted, marginTop: 2, fontFamily: FONTS.regular },
  tag:    { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  tagTxt: { fontSize: 9, fontFamily: FONTS.semiBold },
});
