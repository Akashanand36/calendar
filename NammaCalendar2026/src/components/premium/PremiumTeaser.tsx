import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/index';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';

interface Props { onPress: () => void; }

export default function PremiumTeaser({ onPress }: Props) {
  const isPremium = useSelector((s: RootState) => s.premium.activePlan !== 'free');
  if (isPremium) return null;

  return (
    <TouchableOpacity style={s.banner} onPress={onPress} activeOpacity={0.85}>
      <Text style={s.icon}>👑</Text>
      <View style={s.text}>
        <Text style={s.title}>Upgrade to Namma Premium</Text>
        <Text style={s.sub}>Muhurtham AI · Family Profiles · Ad-free</Text>
      </View>
      <Text style={s.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,209,102,0.08)', borderWidth: 1, borderColor: 'rgba(255,209,102,0.25)', borderRadius: 14, padding: 14, marginTop: 8 },
  icon:   { fontSize: 26 },
  text:   { flex: 1 },
  title:  { fontSize: FONT_SIZE.base, color: COLORS.premiumGold, fontFamily: FONTS.semiBold },
  sub:    { fontSize: FONT_SIZE.xs, color: COLORS.muted, marginTop: 2, fontFamily: FONTS.regular },
  arrow:  { fontSize: 20, color: COLORS.premiumGold },
});
