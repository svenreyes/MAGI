import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { rewriteStory } from '@/services/rewrite';
import {
  SOCIAL_PLATFORMS,
  SOCIAL_PLATFORM_LABELS,
  type RewriteResult,
  type SocialPlatform,
} from '@/types';

export function RewriteScreen() {
  const theme = useTheme();
  const [source, setSource] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);

  async function generate() {
    if (!source.trim()) return;
    setLoading(true);
    try {
      const r = await rewriteStory({ sourceText: source, platform });
      setResult(r);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <SectionHeader
        title="One story, many voices"
        subtitle="Write one idea. Each of your agents retells it."
      />

      <TextField
        placeholder="e.g. I moved to NYC and started a new job."
        value={source}
        onChangeText={setSource}
        multiline
      />

      <View style={styles.platformRow}>
        {SOCIAL_PLATFORMS.map((p) => (
          <Chip
            key={p}
            label={SOCIAL_PLATFORM_LABELS[p]}
            selected={platform === p}
            onPress={() => setPlatform(p)}
          />
        ))}
      </View>

      <PrimaryButton
        label="Generate narratives"
        onPress={generate}
        loading={loading}
        disabled={!source.trim()}
      />

      {result ? (
        <View style={styles.results}>
          {result.narratives.map((n) => (
            <View
              key={n.agentId}
              style={[styles.narrative, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="smallBold">{n.agentName}</ThemedText>
              <ThemedText type="small">{n.content}</ThemedText>
            </View>
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  platformRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  results: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  narrative: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
