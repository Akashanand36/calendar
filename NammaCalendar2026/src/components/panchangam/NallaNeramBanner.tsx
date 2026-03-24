import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';
import { to12h } from '@utils/dateUtils';
import type { TimeRange } from '@types/index';

interface Props { slots: TimeRange[]; }

export default function NallaNeramBanner({ slots }: Props) {
  const slotText = slots.map(s => `${to12h(s.start)}–${to12h(s.end)}`).join(' · ');
  return (
    <View style={s.banner}>
      <Text style={s.icon}>✨</Text>
      <View>
        <Text style={s.label}>NALLA NERAM</Text>
        <Text style={s.times}>{slotText}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(76,175,122,0.12)', borderWidth: 1, borderColor: 'rgba(76,175,122,0.3)', borderRadius: 10, padding: 10, marginBottom: 14 },
  icon:   { fontSize: 20 },
  label:  { fontSize: FONT_SIZE.xs, color: COLORS.green, textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: FONTS.medium },
  times:  { fontSize: FONT_SIZE.sm, color: COLORS.text, fontFamily: FONTS.medium, marginTop: 2 },
});
