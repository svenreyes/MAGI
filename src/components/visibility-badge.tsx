import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AGENT_VISIBILITY_LABELS, type AgentVisibilityScope } from '@/types';

type Props = {
  scope: AgentVisibilityScope;
  /** Number of circles currently exposed to, shown when provided. */
  circleCount?: number;
};

export function VisibilityBadge({ scope, circleCount }: Props) {
  const theme = useTheme();
  const label =
    circleCount !== undefined
      ? `${circleCount} ${circleCount === 1 ? 'circle' : 'circles'}`
      : AGENT_VISIBILITY_LABELS[scope];

  return (
    <View style={[styles.badge, { backgroundColor: theme.backgroundSelected }]}>
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
});
