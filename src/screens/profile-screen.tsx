import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAgents } from '@/hooks/use-agents';
import { useCircles } from '@/hooks/use-circles';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from '@/hooks/use-theme';
import { isApiConfigured, isSupabaseConfigured } from '@/lib/env';
import { appActions, useAppState } from '@/lib/app-store';

export function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const profile = useProfile();
  const agents = useAgents();
  const circles = useCircles();
  const memoryCount = useAppState((s) => s.memoryImports.length);

  function redoOnboarding() {
    appActions.reset();
    appActions.updateProfile({ onboardingCompleted: false });
    router.replace('/onboarding');
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        {profile.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} contentFit="cover" />
        ) : null}
        <ThemedText type="subtitle">{profile.displayName}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          @{profile.username}
        </ThemedText>
        {profile.bio ? <ThemedText type="small">{profile.bio}</ThemedText> : null}
      </View>

      <View style={[styles.stats, { backgroundColor: theme.backgroundElement }]}>
        <Stat label="Agents" value={agents.length} />
        <Stat label="Circles" value={circles.length} />
        <Stat label="Memories" value={memoryCount} />
      </View>

      <View style={styles.section}>
        <SectionHeader title="Backend status" subtitle="Configured via .env" />
        <StatusRow label="Supabase" ok={isSupabaseConfigured} />
        <StatusRow label="API (OpenAI / Honcho)" ok={isApiConfigured} />
        <ThemedText type="small" themeColor="textSecondary">
          The app runs on local mock data until these are configured.
        </ThemedText>
      </View>

      <PrimaryButton label="Re-run onboarding" variant="secondary" onPress={redoOnboarding} />
    </ScreenContainer>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.statusRow}>
      <ThemedText type="small">{label}</ThemedText>
      <ThemedText type="smallBold" style={{ color: ok ? '#22C55E' : '#F59E0B' }}>
        {ok ? 'Connected' : 'Mock'}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 24,
    marginBottom: Spacing.two,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: Spacing.four,
    paddingVertical: Spacing.three,
  },
  stat: {
    alignItems: 'center',
    gap: Spacing.half,
  },
  section: {
    gap: Spacing.two,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
