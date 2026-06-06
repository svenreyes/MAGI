import { Pressable, StyleSheet, View } from 'react-native';

import { AgentAvatar } from '@/components/agent-avatar';
import { ThemedText } from '@/components/themed-text';
import { VisibilityBadge } from '@/components/visibility-badge';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { PersonalityAgent } from '@/types';

type Props = {
  agent: PersonalityAgent;
  onPress?: () => void;
  circleCount?: number;
};

export function AgentCard({ agent, onPress, circleCount }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.9 : 1 },
      ]}>
      {/* Color accent from the agent's palette */}
      <View style={[styles.accent, { backgroundColor: agent.visual.palette.primary }]} />
      <AgentAvatar agent={agent} size={56} />
      <View style={styles.body}>
        <ThemedText type="smallBold" style={styles.name}>
          {agent.name}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
          {agent.description}
        </ThemedText>
        <VisibilityBadge scope={agent.defaultVisibility} circleCount={circleCount} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.four,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  body: {
    flex: 1,
    gap: Spacing.one,
  },
  name: {
    fontSize: 17,
  },
});
