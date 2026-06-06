import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AgentAvatar } from '@/components/agent-avatar';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { VisibilityToggleRow } from '@/components/visibility-toggle-row';
import { Spacing } from '@/constants/theme';
import { useAgent } from '@/hooks/use-agents';
import { useCircles, useVisibilityRules } from '@/hooks/use-circles';
import { useTheme } from '@/hooks/use-theme';
import { useAppState } from '@/lib/app-store';
import { setAgentVisibility } from '@/services/circles';
import { sendMessageToAgent } from '@/services/interactions';
import { canCircleSeeAgent } from '@/utils';

export function AgentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const agent = useAgent(id);
  const circles = useCircles();
  const rules = useVisibilityRules();
  const interaction = useAppState((s) => s.interactions.find((i) => i.agentId === id));

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  if (!agent) {
    return (
      <ScreenContainer scroll={false}>
        <ThemedText type="subtitle">Agent not found</ThemedText>
      </ScreenContainer>
    );
  }

  const { palette } = agent.visual;

  async function send() {
    if (!draft.trim() || !agent) return;
    setSending(true);
    const text = draft.trim();
    setDraft('');
    try {
      await sendMessageToAgent({ agentId: agent.id, text });
    } finally {
      setSending(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={[styles.hero, { backgroundColor: palette.background }]}>
        <AgentAvatar agent={agent} size={72} />
        <ThemedText type="subtitle" style={{ color: palette.text }}>
          {agent.name}
        </ThemedText>
        <ThemedText type="small" style={{ color: palette.text, textAlign: 'center' }}>
          {agent.description}
        </ThemedText>
        <View style={styles.swatches}>
          {[palette.primary, palette.secondary, palette.text].map((c) => (
            <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
          ))}
        </View>
        <ThemedText type="small" style={{ color: palette.text }}>
          {agent.visual.style}
        </ThemedText>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Personality" />
        <View style={[styles.promptBox, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small" themeColor="textSecondary">
            {agent.personalityPrompt}
          </ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Who can see this agent?"
          subtitle="Choose which circles this facet is visible to."
        />
        <View style={styles.toggles}>
          {circles.map((circle) => (
            <VisibilityToggleRow
              key={circle.id}
              title={circle.name}
              subtitle={circle.description ?? undefined}
              value={canCircleSeeAgent(rules, agent.id, circle.id)}
              onValueChange={(value) => setAgentVisibility(agent.id, circle.id, value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Talk to this agent"
          subtitle="Preview how this facet responds in-character."
        />
        <View style={styles.messages}>
          {interaction?.messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubble,
                {
                  alignSelf: m.role === 'viewer' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.role === 'viewer' ? theme.text : theme.backgroundElement,
                },
              ]}>
              <ThemedText
                type="small"
                style={{ color: m.role === 'viewer' ? theme.background : theme.text }}>
                {m.content}
              </ThemedText>
            </View>
          ))}
          {!interaction?.messages.length ? (
            <ThemedText type="small" themeColor="textSecondary">
              Start a conversation below.
            </ThemedText>
          ) : null}
        </View>
        <TextField
          placeholder={`Ask ${agent.name} something...`}
          value={draft}
          onChangeText={setDraft}
        />
        <PrimaryButton label="Send" onPress={send} loading={sending} disabled={!draft.trim()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  swatches: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  swatch: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  section: {
    gap: Spacing.three,
  },
  promptBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  toggles: {
    gap: Spacing.two,
  },
  messages: {
    gap: Spacing.two,
  },
  bubble: {
    maxWidth: '85%',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
