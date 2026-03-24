// src/components/panchangam/PanchangamCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';
import { to12h } from '@utils/dateUtils';

interface Props { label: string; value: string; time: string; }

export default function PanchangamCard({ label, value, time }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.label}>{label.toUpperCase()}</Text>
      <Text style={s.value}>{value}</Text>
      <Text style={s.time}>Until {to12h(time)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  card:  { width: '48%', backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 10 },
  label: { fontSize: FONT_SIZE.xs, color: COLORS.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3, fontFamily: FONTS.medium },
  value: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontFamily: FONTS.medium },
  time:  { fontSize: FONT_SIZE.xs, color: COLORS.gold, marginTop: 2, fontFamily: FONTS.regular },
});
