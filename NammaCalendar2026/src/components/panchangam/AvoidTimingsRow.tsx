import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';
import { to12h } from '@utils/dateUtils';
import type { TimeRange } from '@types/index';

interface Props { rahuKalam: TimeRange; yamagandam: TimeRange; kuligai: TimeRange; }

export default function AvoidTimingsRow({ rahuKalam, yamagandam, kuligai }: Props) {
  const blocks = [
    { label: 'Rahu Kalam',  range: rahuKalam  },
    { label: 'Yamagandam',  range: yamagandam },
    { label: 'Kuligai',     range: kuligai    },
  ];
  return (
    <View style={s.row}>
      {blocks.map(b => (
        <View key={b.label} style={s.block}>
          <Text style={s.label}>{b.label.toUpperCase()}</Text>
          <Text style={s.time}>{to12h(b.range.start)}–{to12h(b.range.end)}</Text>
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row:   { flexDirection: 'row', gap: 8, marginBottom: 10 },
  block: { flex: 1, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: 'rgba(229,90,78,0.25)', borderRadius: 10, padding: 8, alignItems: 'center' },
  label: { fontSize: 9, color: COLORS.red, letterSpacing: 0.5, fontFamily: FONTS.medium },
  time:  { fontSize: FONT_SIZE.sm, color: COLORS.text, fontFamily: FONTS.medium, marginTop: 3 },
});
