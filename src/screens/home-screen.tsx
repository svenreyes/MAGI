import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AgentCard } from '@/components/agent-card';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useActiveAgents } from '@/hooks/use-agents';
import { useCircles, useVisibilityRules } from '@/hooks/use-circles';
import { useProfile } from '@/hooks/use-profile';
import { circlesThatCanSeeAgent } from '@/utils';

export function HomeScreen() {
  const router = useRouter();
  const profile = useProfile();
  const agents = useActiveAgents();
  const circles = useCircles();
  const rules = useVisibilityRules();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <ThemedText type="small" themeColor="textSecondary">
          Welcome back
        </ThemedText>
        <ThemedText type="title">{profile.displayName}</ThemedText>
        {profile.bio ? (
          <ThemedText type="small" themeColor="textSecondary">
            {profile.bio}
          </ThemedText>
        ) : null}
      </View>

      <SectionHeader title="Your agents" subtitle="The facets that make up who you are." />
      <View style={styles.list}>
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            circleCount={circlesThatCanSeeAgent(circles, rules, agent.id).length}
            onPress={() => router.push(`/agent/${agent.id}`)}
          />
        ))}
        {agents.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            No agents yet. Complete onboarding to generate your personality graph.
          </ThemedText>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  list: {
    gap: Spacing.three,
  },
});
