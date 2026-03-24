/**
 * ProfileScreen.tsx
 * நம்ம Calendar 2026 — Profile Screen
 *
 * Paste into: src/screens/ProfileScreen.tsx
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Design Tokens ────────────────────────────────────────────────────────────

const C = {
  saffron:    '#E8600A',
  saffronDark:'#B84A05',
  saffronLight:'rgba(232,96,10,0.12)',
  gold:       '#F5A623',
  goldDim:    'rgba(245,166,35,0.18)',
  premGold:   '#FFD166',
  premAmber:  '#F0A500',
  bg:         '#0D0D0D',
  surface:    '#1C1410',
  surface2:   '#261C15',
  surface3:   '#2E231A',
  text:       '#F5EDD8',
  muted:      '#A08060',
  border:     'rgba(232,96,10,0.20)',
  green:      '#4CAF7A',
  greenDim:   'rgba(76,175,122,0.14)',
  red:        '#E55A4E',
  blue:       '#5B9BD5',
  blueDim:    'rgba(91,155,213,0.14)',
  purple:     '#9B59B6',
  purpleDim:  'rgba(155,89,182,0.14)',
} as const;

const F = {
  regular:  'System',
  medium:   'System',
  semiBold: 'System',
  bold:     'System',
  tamil:    'System',
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type RasiName =
  | 'Mesham' | 'Rishabam' | 'Midhunam' | 'Kadagam'
  | 'Simmam' | 'Kanni'    | 'Thulam'   | 'Viruchigam'
  | 'Thanusu'| 'Magaram'  | 'Kumbam'   | 'Meenam';

interface FamilyMember {
  id: string;
  name: string;
  rasi: RasiName;
  relation: string;
  emoji: string;
}

interface UserProfile {
  name: string;
  rasi: RasiName;
  natchathiram: string;
  isPremium: boolean;
  premiumPlan?: string;
  notifications: boolean;
  language: 'Tamil' | 'English';
  theme: 'Dark' | 'Light';
  familyMembers: FamilyMember[];
  remindersCount: number;
  notesCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_PROFILE: UserProfile = {
  name: 'Murugesan K.',
  rasi: 'Mesham',
  natchathiram: 'Krittika',
  isPremium: false,
  notifications: true,
  language: 'Tamil',
  theme: 'Dark',
  familyMembers: [
    { id: '1', name: 'Meena',   rasi: 'Rishabam', relation: 'Wife',     emoji: '👩' },
    { id: '2', name: 'Aarav',   rasi: 'Kanni',    relation: 'Son',      emoji: '👦' },
    { id: '3', name: 'Kavitha', rasi: 'Simmam',   relation: 'Daughter', emoji: '👧' },
  ],
  remindersCount: 12,
  notesCount: 47,
};

const RASI_SYMBOLS: Record<RasiName, string> = {
  Mesham:'♈', Rishabam:'♉', Midhunam:'♊', Kadagam:'♋',
  Simmam:'♌', Kanni:'♍',   Thulam:'♎',   Viruchigam:'♏',
  Thanusu:'♐',Magaram:'♑', Kumbam:'♒',   Meenam:'♓',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCell = ({ num, label }: { num: string | number; label: string }) => (
  <View style={styles.statCell}>
    <Text style={styles.statNum}>{num}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface MenuItemProps {
  icon: string;
  iconBg: string;
  label: string;
  labelColor?: string;
  sub: string;
  onPress: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
}

const MenuItem = ({
  icon, iconBg, label, labelColor, sub,
  onPress, rightElement, showArrow = true,
}: MenuItemProps) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: iconBg }]}>
      <Text style={styles.menuEmoji}>{icon}</Text>
    </View>
    <View style={styles.menuText}>
      <Text style={[styles.menuLabel, labelColor ? { color: labelColor } : {}]}>
        {label}
      </Text>
      <Text style={styles.menuSub}>{sub}</Text>
    </View>
    {rightElement ?? (showArrow && <Text style={styles.menuArrow}>›</Text>)}
  </TouchableOpacity>
);

const FamilyCard = ({ member }: { member: FamilyMember }) => (
  <View style={styles.familyCard}>
    <Text style={styles.familyEmoji}>{member.emoji}</Text>
    <Text style={styles.familyName}>{member.name}</Text>
    <Text style={styles.familyRelation}>{member.relation}</Text>
    <View style={styles.familyRasi}>
      <Text style={styles.familyRasiText}>
        {RASI_SYMBOLS[member.rasi]} {member.rasi}
      </Text>
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

interface Props {
  navigation?: any;
  initialProfile?: Partial<UserProfile>;
}

export default function ProfileScreen({ navigation, initialProfile }: Props) {
  const [profile, setProfile] = useState<UserProfile>({
    ...INITIAL_PROFILE,
    ...initialProfile,
  });

  const toggleNotifications = () => {
    setProfile(p => ({ ...p, notifications: !p.notifications }));
  };

  const toggleLanguage = () => {
    setProfile(p => ({ ...p, language: p.language === 'Tamil' ? 'English' : 'Tamil' }));
  };

  const handleShare = () => {
    Alert.alert(
      'Share Namma Calendar',
      'Share with friends and family to spread Tamil culture! 🕉',
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.surface} />

      {/* ── Profile Header ── */}
      <View style={styles.profileHeader}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🙏</Text>
          </View>
          {profile.isPremium && (
            <View style={styles.crownBadge}>
              <Text style={styles.crownText}>👑</Text>
            </View>
          )}
        </View>

        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileRasi}>
          {RASI_SYMBOLS[profile.rasi]}  {profile.rasi} ராசி  ·  {profile.natchathiram}
        </Text>

        {profile.isPremium ? (
          <View style={styles.premiumActiveBadge}>
            <Text style={styles.premiumActiveBadgeText}>👑  Premium Member</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.upgradeChip}
            onPress={() => navigation?.navigate('Premium')}
            activeOpacity={0.8}
          >
            <Text style={styles.upgradeChipText}>Upgrade to Premium  →</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Stats row ── */}
        <View style={styles.statsRow}>
          <StatCell num={365}                        label="Days Covered" />
          <View style={styles.statDivider} />
          <StatCell num={profile.remindersCount}     label="Reminders" />
          <View style={styles.statDivider} />
          <StatCell num={profile.notesCount}         label="Notes" />
          <View style={styles.statDivider} />
          <StatCell num={profile.familyMembers.length} label="Family" />
        </View>

        {/* ── Family Profiles ── */}
        {profile.isPremium && profile.familyMembers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FAMILY PROFILES</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.familyScroll}
            >
              {profile.familyMembers.map(m => (
                <FamilyCard key={m.id} member={m} />
              ))}
              <TouchableOpacity
                style={styles.addFamilyCard}
                onPress={() => navigation?.navigate('FamilyProfiles')}
              >
                <Text style={styles.addFamilyPlus}>+</Text>
                <Text style={styles.addFamilyLabel}>Add</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* ── Premium upgrade (if not premium) ── */}
        {!profile.isPremium && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.premiumBanner}
              onPress={() => navigation?.navigate('Premium')}
              activeOpacity={0.85}
            >
              <Text style={styles.premBannerIcon}>👑</Text>
              <View style={styles.premBannerText}>
                <Text style={styles.premBannerTitle}>Upgrade to Namma Premium</Text>
                <Text style={styles.premBannerSub}>₹99/month  ·  7-day free trial</Text>
              </View>
              <Text style={styles.premBannerArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Menu items ── */}
        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>FEATURES</Text>
          <MenuItem
            icon="🔔" iconBg={C.saffronLight}
            label="Smart Reminders"
            sub={`${profile.remindersCount} active · Next day alerts`}
            onPress={() => navigation?.navigate('Reminders')}
          />
          <MenuItem
            icon="📝" iconBg={C.greenDim}
            label="Daily Planner & Notes"
            sub={`${profile.notesCount} notes`}
            onPress={() => navigation?.navigate('Planner')}
          />
          <MenuItem
            icon="👨‍👩‍👧" iconBg={C.purpleDim}
            label={`Family Profiles${!profile.isPremium ? '  👑' : ''}`}
            sub={profile.isPremium
              ? `${profile.familyMembers.length} members added`
              : 'Upgrade to add family members'}
            onPress={() => profile.isPremium
              ? navigation?.navigate('FamilyProfiles')
              : navigation?.navigate('Premium')
            }
          />
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>PREFERENCES</Text>
          <MenuItem
            icon="🔔" iconBg={C.saffronLight}
            label="Notifications"
            sub={profile.notifications ? 'Daily alerts enabled' : 'Disabled'}
            onPress={() => {}}
            showArrow={false}
            rightElement={
              <Switch
                value={profile.notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: C.surface3, true: C.saffron }}
                thumbColor="#fff"
              />
            }
          />
          <MenuItem
            icon="🌐" iconBg={C.blueDim}
            label="Language"
            sub={profile.language === 'Tamil' ? 'தமிழ் enabled' : 'English mode'}
            onPress={toggleLanguage}
            rightElement={
              <View style={styles.langToggle}>
                <Text style={[styles.langOption, profile.language === 'Tamil' && styles.langOptionActive]}>
                  தமிழ்
                </Text>
                <Text style={styles.langSep}>·</Text>
                <Text style={[styles.langOption, profile.language === 'English' && styles.langOptionActive]}>
                  ENG
                </Text>
              </View>
            }
            showArrow={false}
          />
          <MenuItem
            icon="🌙" iconBg={C.goldDim}
            label="Appearance"
            sub={`${profile.theme} mode`}
            onPress={() => {}}
          />
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.menuGroupTitle}>MORE</Text>
          <MenuItem
            icon="📲" iconBg={C.blueDim}
            label="Share App"
            sub="Invite friends & family"
            onPress={handleShare}
          />
          <MenuItem
            icon="⭐" iconBg={C.goldDim}
            label="Rate App"
            sub="Support us on the Play Store"
            onPress={() => {}}
          />
          <MenuItem
            icon="ℹ️" iconBg={C.surface3}
            label="About"
            sub="Version 1.0.0  ·  Namma Calendar 2026"
            onPress={() => {}}
          />
          <MenuItem
            icon="🚪" iconBg="rgba(229,90,78,0.12)"
            label="Sign Out"
            labelColor={C.red}
            sub=""
            onPress={handleSignOut}
            showArrow={false}
          />
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  // Profile header
  profileHeader: {
    backgroundColor: C.surface,
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatarWrapper:      { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: C.saffron,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.saffronDark,
  },
  avatarEmoji:  { fontSize: 30 },
  crownBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: C.premAmber,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownText: { fontSize: 12 },

  profileName:  { fontSize: 20, color: C.text, fontFamily: F.bold, fontWeight: '700' },
  profileRasi:  { fontSize: 13, color: C.muted, fontFamily: F.tamil, marginTop: 4 },

  premiumActiveBadge: {
    backgroundColor: C.goldDim,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 10,
  },
  premiumActiveBadgeText: {
    fontSize: 13,
    color: C.gold,
    fontFamily: F.semiBold,
    fontWeight: '600',
  },
  upgradeChip: {
    backgroundColor: 'rgba(255,209,102,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 10,
  },
  upgradeChipText: {
    fontSize: 13,
    color: C.premGold,
    fontFamily: F.medium,
    fontWeight: '500',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: C.surface2,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  statCell:    { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statDivider: { width: 1, backgroundColor: C.border, marginVertical: 10 },
  statNum:     { fontSize: 20, color: C.saffron, fontFamily: F.bold, fontWeight: '700' },
  statLabel:   { fontSize: 10, color: C.muted, fontFamily: F.regular, marginTop: 2 },

  // Section
  section:      { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: {
    fontSize: 11,
    color: C.saffron,
    letterSpacing: 1,
    fontFamily: F.semiBold,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  // Family scroll
  familyScroll: { gap: 8, paddingBottom: 4 },
  familyCard: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 90,
  },
  familyEmoji:    { fontSize: 24, marginBottom: 4 },
  familyName:     { fontSize: 12, color: C.text, fontFamily: F.medium, fontWeight: '500', textAlign: 'center' },
  familyRelation: { fontSize: 10, color: C.muted, fontFamily: F.regular, marginTop: 1 },
  familyRasi: {
    backgroundColor: C.saffronLight,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 5,
  },
  familyRasiText: { fontSize: 9, color: C.saffron, fontFamily: F.medium, fontWeight: '500' },

  addFamilyCard: {
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    borderStyle: 'dashed',
  },
  addFamilyPlus:  { fontSize: 22, color: C.saffron },
  addFamilyLabel: { fontSize: 11, color: C.saffron, fontFamily: F.medium, fontWeight: '500', marginTop: 4 },

  // Premium banner
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,209,102,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,102,0.25)',
    borderRadius: 14,
    padding: 14,
  },
  premBannerIcon:  { fontSize: 26 },
  premBannerText:  { flex: 1 },
  premBannerTitle: { fontSize: 14, color: C.premGold, fontFamily: F.semiBold, fontWeight: '600' },
  premBannerSub:   { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2 },
  premBannerArrow: { fontSize: 20, color: C.premGold },

  // Menu groups
  menuGroup: { marginTop: 20 },
  menuGroupTitle: {
    fontSize: 10,
    color: C.muted,
    letterSpacing: 1,
    fontFamily: F.semiBold,
    fontWeight: '600',
    marginBottom: 6,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.surface2,
  },
  menuIcon:  { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuEmoji: { fontSize: 18 },
  menuText:  { flex: 1 },
  menuLabel: { fontSize: 15, color: C.text, fontFamily: F.medium, fontWeight: '500' },
  menuSub:   { fontSize: 11, color: C.muted, fontFamily: F.regular, marginTop: 2 },
  menuArrow: { fontSize: 20, color: C.muted },

  // Language toggle
  langToggle:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  langOption:      { fontSize: 12, color: C.muted, fontFamily: F.medium, fontWeight: '500' },
  langOptionActive:{ color: C.saffron },
  langSep:         { color: C.muted, fontSize: 10 },

  bottomPad: { height: 32 },
});
