import { type ReactNode, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AgentAvatar } from '@/components/agent-avatar';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useActiveAgents } from '@/hooks/use-agents';
import { useCircles, useVisibilityRules } from '@/hooks/use-circles';
import { useTheme } from '@/hooks/use-theme';
import { createCircle, setAgentVisibility } from '@/services/circles';
import type { SocialCircle } from '@/types';
import { agentsVisibleToCircle, canCircleSeeAgent } from '@/utils';

export function SocialCirclesScreen() {
  const circles = useCircles();
  const agents = useActiveAgents();
  const rules = useVisibilityRules();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newCircleName, setNewCircleName] = useState('');

  function addCircle() {
    const name = newCircleName.trim();
    if (!name) return;
    createCircle({ name });
    setNewCircleName('');
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="Social circles"
        subtitle="Decide which facets of you each circle can see."
      />

      <View style={styles.list}>
        {circles.map((circle) => (
          <CircleRow
            key={circle.id}
            circle={circle}
            visibleCount={agentsVisibleToCircle(agents, rules, circle.id).length}
            expanded={expandedId === circle.id}
            onToggleExpand={() =>
              setExpandedId((prev) => (prev === circle.id ? null : circle.id))
            }
          >
            {agents.map((agent) => (
              <Pressable
                key={agent.id}
                onPress={() =>
                  setAgentVisibility(
                    agent.id,
                    circle.id,
                    !canCircleSeeAgent(rules, agent.id, circle.id),
                  )
                }
                style={styles.agentRow}>
                <AgentAvatar agent={agent} size={36} />
                <ThemedText type="small" style={styles.agentName}>
                  {agent.name}
                </ThemedText>
                <VisibleDot visible={canCircleSeeAgent(rules, agent.id, circle.id)} />
              </Pressable>
            ))}
          </CircleRow>
        ))}
      </View>

      <View style={styles.addBox}>
        <SectionHeader title="Create a custom circle" />
        <TextField
          placeholder="e.g. Work, College friends"
          value={newCircleName}
          onChangeText={setNewCircleName}
        />
        <PrimaryButton label="Add circle" onPress={addCircle} disabled={!newCircleName.trim()} />
      </View>
    </ScreenContainer>
  );
}

function CircleRow({
  circle,
  visibleCount,
  expanded,
  onToggleExpand,
  children,
}: {
  circle: SocialCircle;
  visibleCount: number;
  expanded: boolean;
  onToggleExpand: () => void;
  children: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.circleCard, { backgroundColor: theme.backgroundElement }]}>
      <Pressable onPress={onToggleExpand} style={styles.circleHeader}>
        <View style={styles.circleText}>
          <ThemedText type="smallBold">{circle.name}</ThemedText>
          {circle.description ? (
            <ThemedText type="small" themeColor="textSecondary">
              {circle.description}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {visibleCount} shown {expanded ? '▾' : '▸'}
        </ThemedText>
      </Pressable>
      {expanded ? <View style={styles.agentList}>{children}</View> : null}
    </View>
  );
}

function VisibleDot({ visible }: { visible: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: visible ? '#22C55E' : 'transparent',
          borderColor: visible ? '#22C55E' : theme.textSecondary,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  circleCard: {
    borderRadius: Spacing.four,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  circleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  circleText: {
    flex: 1,
    gap: Spacing.half,
  },
  agentList: {
    gap: Spacing.two,
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  agentName: {
    flex: 1,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
  },
  addBox: {
    gap: Spacing.three,
    marginTop: Spacing.three,
  },
});
