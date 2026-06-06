import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AgentCard } from '@/components/agent-card';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { appStore } from '@/lib/app-store';
import { generateAgents } from '@/services/agents';
import type { PersonalityAgent } from '@/types';

type Phase = 'generating' | 'done' | 'error';

export function AgentGenerationScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('generating');
  const [agents, setAgents] = useState<PersonalityAgent[]>([]);

  useEffect(() => {
    let cancelled = false;
    const draft = appStore.getState().onboardingDraft;

    generateAgents({ answers: draft.answers, memoryImportText: draft.memoryImportText })
      .then((result) => {
        if (cancelled) return;
        setAgents(result);
        setPhase('done');
      })
      .catch(() => {
        if (!cancelled) setPhase('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === 'generating') {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <ThemedText type="subtitle" style={styles.centerText}>
            Reading your story
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
            MAGI is shaping the facets of who you are...
          </ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  if (phase === 'error') {
    return (
      <ScreenContainer scroll={false}>
        <View style={styles.center}>
          <ThemedText type="subtitle" style={styles.centerText}>
            Something went wrong
          </ThemedText>
          <PrimaryButton label="Back to onboarding" onPress={() => router.replace('/onboarding')} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="Meet your agents"
        subtitle={`MAGI created ${agents.length} facets of you. You can refine them anytime.`}
      />
      <View style={styles.list}>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </View>
      <PrimaryButton label="Enter MAGI" onPress={() => router.replace('/')} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  centerText: {
    textAlign: 'center',
  },
  list: {
    gap: Spacing.three,
  },
});
