import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@store/index';
import { purchaseStart, purchaseSuccess } from '@store/premiumSlice';
import { setPremiumStatus } from '@store/userSlice';
import { PremiumService, IAP_SKUS } from '@services/PremiumService';
import { COLORS } from '@constants/colors';
import { FONTS, FONT_SIZE } from '@constants/fonts';

type BillingCycle = 'monthly' | 'yearly';

const PLANS = {
  monthly: { price: '₹99',  per: '/month',              sku: IAP_SKUS.monthly },
  yearly:  { price: '₹799', per: '/year · ₹67/mo',      sku: IAP_SKUS.yearly  },
};

const PREMIUM_FEATURES = [
  { text: 'Everything in Free',                    included: true  },
  { text: 'Muhurtham AI Finder — all event types', included: true,  highlight: true },
  { text: 'Family Rasi Profiles — up to 6 members',included: true,  highlight: true },
  { text: 'Daily, Weekly, Monthly & Yearly Rasipalan', included: true },
  { text: 'Ad-free experience',                    included: true  },
  { text: 'Export Panchangam as PDF',              included: true  },
  { text: 'Priority customer support',             included: true  },
];

const FREE_FEATURES = [
  { text: 'Daily Panchangam (Tithi, Star, Yogam)', included: true  },
  { text: 'Monthly Calendar view',                 included: true  },
  { text: 'Festival & holiday list',               included: true  },
  { text: 'Muhurtham Finder',                      included: false },
  { text: 'Family Rasi Profiles',                  included: false },
  { text: 'Weekly / Yearly Rasipalan',             included: false },
];

const COMPARE_ROWS = [
  { feature: 'Panchangam',      free: '✓',      premium: '✓'   },
  { feature: 'Festivals',       free: '✓',      premium: '✓'   },
  { feature: 'Rasipalan',       free: 'Daily',  premium: 'All' },
  { feature: 'Muhurtham AI',    free: '✕',      premium: '✓'   },
  { feature: 'Family Profiles', free: '✕',      premium: '6'   },
  { feature: 'PDF Export',      free: '✕',      premium: '✓'   },
  { feature: 'Ads',             free: 'Yes',    premium: 'None'},
];

export default function PremiumScreen() {
  const router    = useRouter();
  const dispatch  = useDispatch();
  const { loading, activePlan } = useSelector((s: RootState) => s.premium);
  const isPremium = activePlan !== 'free';

  const [billing,     setBilling]     = useState<BillingCycle>('yearly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('premium');

  const plan = PLANS[billing];

  const handleSubscribe = async () => {
    if (selectedPlan === 'free') { router.back(); return; }
    try {
      await PremiumService.subscribe(plan.sku);
    } catch (e: any) {
      Alert.alert('Purchase Failed', e.message ?? 'Please try again.');
    }
  };

  const handleRestore = async () => {
    Alert.alert('Restore Purchases', 'Checking your previous purchases…');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Namma Premium</Text>
        <TouchableOpacity onPress={handleRestore}>
          <Text style={s.restore}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.crown}>👑</Text>
          <View style={s.limitedBadge}>
            <Text style={s.limitedText}>LIMITED OFFER · SAVE 40%</Text>
          </View>
          <Text style={s.heroTitle}>Unlock Full Tamil{'\n'}Calendar Experience</Text>
          <Text style={s.heroSub}>
            Muhurtham AI · Family Profiles · Ad-free{'\n'}
            Offline Panchangam · Priority Updates
          </Text>
        </View>

        {/* Billing toggle */}
        <View style={s.toggleRow}>
          {(['monthly', 'yearly'] as BillingCycle[]).map(cycle => (
            <TouchableOpacity
              key={cycle}
              style={[s.toggleBtn, billing === cycle && s.toggleBtnActive]}
              onPress={() => setBilling(cycle)}
            >
              <Text style={[s.toggleText, billing === cycle && s.toggleTextActive]}>
                {cycle === 'yearly' ? 'Yearly · Save 40%' : 'Monthly'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Free plan card ── */}
        <TouchableOpacity
          style={[s.planCard, selectedPlan === 'free' && s.planCardSelected]}
          onPress={() => setSelectedPlan('free')}
          activeOpacity={0.85}
        >
          <View style={s.planRow}>
            <View>
              <Text style={s.planName}>Free</Text>
              <Text style={s.planDesc}>Basic calendar & Panchangam</Text>
            </View>
            <View style={s.planPriceBox}>
              <Text style={[s.planPrice, { color: COLORS.muted }]}>₹0</Text>
              <Text style={s.planPer}>forever</Text>
            </View>
          </View>
          <View style={s.divider} />
          {FREE_FEATURES.map((f, i) => (
            <View key={i} style={s.featRow}>
              <View style={[s.featCheck, f.included ? s.featCheckYes : s.featCheckNo]}>
                <Text style={[s.featCheckTxt, { color: f.included ? COLORS.green : COLORS.muted }]}>
                  {f.included ? '✓' : '✕'}
                </Text>
              </View>
              <Text style={[s.featText, !f.included && s.featTextDisabled]}>{f.text}</Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* ── Premium plan card ── */}
        <TouchableOpacity
          style={[s.planCard, s.planCardGold, selectedPlan === 'premium' && s.planCardSelected]}
          onPress={() => setSelectedPlan('premium')}
          activeOpacity={0.85}
        >
          <View style={s.bestBadge}>
            <Text style={s.bestBadgeTxt}>⭐ Most Popular</Text>
          </View>

          <View style={[s.planRow, { marginTop: 6 }]}>
            <View>
              <Text style={[s.planName, { color: COLORS.premiumGold }]}>Namma Premium</Text>
              <Text style={s.planDesc}>Everything, unlocked</Text>
            </View>
            <View style={s.planPriceBox}>
              <Text style={[s.planPrice, { color: COLORS.premiumGold }]}>{plan.price}</Text>
              <Text style={s.planPer}>{plan.per}</Text>
              {billing === 'yearly' && (
                <View style={s.saveBadge}>
                  <Text style={s.saveBadgeTxt}>Save ₹389 vs monthly</Text>
                </View>
              )}
            </View>
          </View>

          <View style={s.divider} />
          {PREMIUM_FEATURES.map((f, i) => (
            <View key={i} style={s.featRow}>
              <View style={[s.featCheck, s.featCheckYes]}>
                <Text style={[s.featCheckTxt, { color: COLORS.green }]}>✓</Text>
              </View>
              <Text style={[s.featText, f.highlight && { color: COLORS.premiumGold, fontFamily: FONTS.medium }]}>
                {f.text}
              </Text>
            </View>
          ))}
        </TouchableOpacity>

        {/* ── Comparison table ── */}
        <Text style={[s.sectionTitle, { marginHorizontal: 20 }]}>QUICK COMPARISON</Text>
        <View style={s.compareTable}>
          {/* Header */}
          <View style={[s.compareRow, s.compareHeader]}>
            <Text style={[s.compareCell, s.compareCellFeature, { color: COLORS.muted }]}>Feature</Text>
            <Text style={[s.compareCell, s.compareCellPlan, { color: COLORS.muted }]}>Free</Text>
            <Text style={[s.compareCell, s.compareCellPlan, { color: COLORS.premiumGold }]}>Premium</Text>
          </View>
          {COMPARE_ROWS.map((row, i) => (
            <View key={i} style={s.compareRow}>
              <Text style={[s.compareCell, s.compareCellFeature, { color: COLORS.muted }]}>{row.feature}</Text>
              <Text style={[s.compareCell, s.compareCellPlan, {
                color: row.free === '✕' ? COLORS.red : row.free === '✓' ? COLORS.green : COLORS.muted,
              }]}>{row.free}</Text>
              <Text style={[s.compareCell, s.compareCellPlan, {
                color: row.premium === '✕' ? COLORS.red : row.premium === '✓' || row.premium !== 'None' ? COLORS.green : COLORS.muted,
              }]}>{row.premium}</Text>
            </View>
          ))}
        </View>

        {/* ── CTA ── */}
        <View style={s.ctaArea}>
          <TouchableOpacity
            style={[s.ctaBtn, selectedPlan === 'free' ? s.ctaBtnFree : s.ctaBtnGold]}
            onPress={handleSubscribe}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading
              ? <ActivityIndicator color={selectedPlan === 'free' ? COLORS.text : '#1A0800'} />
              : <Text style={[s.ctaBtnTxt, { color: selectedPlan === 'free' ? COLORS.text : '#1A0800' }]}>
                  {selectedPlan === 'free' ? 'Continue with Free' : 'Start 7-Day Free Trial 👑'}
                </Text>
            }
          </TouchableOpacity>

          {selectedPlan === 'premium' && (
            <TouchableOpacity style={s.ctaBtnSecondary} onPress={() => router.back()}>
              <Text style={s.ctaBtnSecondaryTxt}>Maybe later</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={s.legalTxt}>
          Cancel anytime · Auto-renews · By subscribing you agree to our Terms & Privacy Policy
        </Text>
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:               { flex: 1, backgroundColor: COLORS.bg },
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  back:               { fontSize: 22, color: COLORS.saffron, fontFamily: FONTS.regular },
  headerTitle:        { fontSize: FONT_SIZE.base, color: COLORS.text, fontFamily: FONTS.medium },
  restore:            { fontSize: FONT_SIZE.sm, color: COLORS.muted, fontFamily: FONTS.regular },
  scroll:             { paddingBottom: 16 },

  // Hero
  hero:               { alignItems: 'center', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: 'rgba(255,209,102,0.12)' },
  crown:              { fontSize: 36, marginBottom: 8 },
  limitedBadge:       { backgroundColor: 'rgba(255,209,102,0.15)', borderWidth: 1, borderColor: 'rgba(255,209,102,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 3, marginBottom: 10 },
  limitedText:        { fontSize: FONT_SIZE.xs, color: COLORS.premiumGold, fontFamily: FONTS.semiBold, letterSpacing: 0.5 },
  heroTitle:          { fontSize: 22, fontFamily: FONTS.bold, color: COLORS.premiumGold, textAlign: 'center', lineHeight: 28, marginBottom: 8 },
  heroSub:            { fontSize: FONT_SIZE.sm, color: COLORS.muted, textAlign: 'center', lineHeight: 18, fontFamily: FONTS.regular },

  // Toggle
  toggleRow:          { flexDirection: 'row', margin: 20, marginBottom: 16, backgroundColor: COLORS.surface2, borderRadius: 30, borderWidth: 1, borderColor: COLORS.border, padding: 3 },
  toggleBtn:          { flex: 1, paddingVertical: 8, borderRadius: 26, alignItems: 'center' },
  toggleBtnActive:    { backgroundColor: COLORS.saffron },
  toggleText:         { fontSize: FONT_SIZE.sm, color: COLORS.muted, fontFamily: FONTS.medium },
  toggleTextActive:   { color: '#fff' },

  // Plan cards
  planCard:           { marginHorizontal: 20, marginBottom: 10, borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.surface2 },
  planCardGold:       { borderColor: COLORS.premiumGold, backgroundColor: 'rgba(255,209,102,0.05)' },
  planCardSelected:   { borderColor: COLORS.saffron },
  bestBadge:          { position: 'absolute', top: -11, alignSelf: 'center', backgroundColor: COLORS.premiumAmber, paddingHorizontal: 14, paddingVertical: 3, borderRadius: 20 },
  bestBadgeTxt:       { fontSize: 10, fontFamily: FONTS.bold, color: '#1A0800', letterSpacing: 0.5 },
  planRow:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName:           { fontSize: FONT_SIZE.base, color: COLORS.text, fontFamily: FONTS.semiBold },
  planDesc:           { fontSize: FONT_SIZE.sm, color: COLORS.muted, fontFamily: FONTS.regular, marginTop: 2 },
  planPriceBox:       { alignItems: 'flex-end' },
  planPrice:          { fontSize: 22, fontFamily: FONTS.bold },
  planPer:            { fontSize: FONT_SIZE.xs, color: COLORS.muted, fontFamily: FONTS.regular },
  saveBadge:          { backgroundColor: COLORS.greenDim, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  saveBadgeTxt:       { fontSize: 10, color: COLORS.green, fontFamily: FONTS.medium },
  divider:            { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  featRow:            { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  featCheck:          { width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  featCheckYes:       { backgroundColor: COLORS.greenDim },
  featCheckNo:        { backgroundColor: COLORS.surface3 },
  featCheckTxt:       { fontSize: 9, fontFamily: FONTS.bold },
  featText:           { fontSize: FONT_SIZE.sm, color: COLORS.text, fontFamily: FONTS.regular, flex: 1 },
  featTextDisabled:   { textDecorationLine: 'line-through', opacity: 0.45, color: COLORS.muted },

  // Comparison table
  sectionTitle:       { fontFamily: FONTS.semiBold, fontSize: FONT_SIZE.xs, color: COLORS.saffron, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  compareTable:       { marginHorizontal: 20, marginBottom: 4 },
  compareHeader:      { borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 6 },
  compareRow:         { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  compareCell:        { paddingVertical: 7, fontSize: FONT_SIZE.sm, fontFamily: FONTS.regular },
  compareCellFeature: { flex: 2, color: COLORS.muted },
  compareCellPlan:    { flex: 1, textAlign: 'center' },

  // CTA
  ctaArea:            { paddingHorizontal: 20, paddingTop: 16, gap: 8 },
  ctaBtn:             { paddingVertical: 15, borderRadius: 14, alignItems: 'center' },
  ctaBtnGold:         { backgroundColor: COLORS.premiumAmber },
  ctaBtnFree:         { backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border },
  ctaBtnTxt:          { fontSize: FONT_SIZE.md, fontFamily: FONTS.bold, letterSpacing: 0.3 },
  ctaBtnSecondary:    { paddingVertical: 12, alignItems: 'center' },
  ctaBtnSecondaryTxt: { fontSize: FONT_SIZE.sm, color: COLORS.muted, fontFamily: FONTS.regular },
  legalTxt:           { fontSize: 10, color: COLORS.muted, textAlign: 'center', paddingHorizontal: 28, marginTop: 12, lineHeight: 16, fontFamily: FONTS.regular },
});
