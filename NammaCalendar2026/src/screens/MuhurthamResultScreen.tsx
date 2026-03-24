import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';

// TODO: Implement MuhurthamResultScreen
export default function MuhurthamResultScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>MuhurthamResultScreen</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={s.body}>
        <Text style={s.placeholder}>🚧 Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.bg },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  back:        { fontSize: 22, color: COLORS.saffron },
  title:       { fontSize: FONT_SIZE.base, color: COLORS.text, fontFamily: FONTS.medium },
  body:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholder: { fontSize: FONT_SIZE.lg, color: COLORS.muted, fontFamily: FONTS.regular },
});
