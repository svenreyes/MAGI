import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenContainer } from '@/components/screen-container';
import { SectionHeader } from '@/components/section-header';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useJournalEntries } from '@/hooks/use-journal';
import { useTheme } from '@/hooks/use-theme';
import { createJournalEntry } from '@/services/journal';
import { formatRelative } from '@/utils';

export function JournalScreen() {
  const theme = useTheme();
  const entries = useJournalEntries();
  const [content, setContent] = useState('');

  function save() {
    const text = content.trim();
    if (!text) return;
    createJournalEntry({ content: text });
    setContent('');
  }

  return (
    <ScreenContainer>
      <SectionHeader title="Journal" subtitle="Capture moments. They feed your evolving graph." />

      <View style={styles.composer}>
        <TextField
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
        />
        <PrimaryButton label="Save entry" onPress={save} disabled={!content.trim()} />
      </View>

      <View style={styles.list}>
        {entries.map((entry) => (
          <View
            key={entry.id}
            style={[styles.entry, { backgroundColor: theme.backgroundElement }]}>
            {entry.title ? <ThemedText type="smallBold">{entry.title}</ThemedText> : null}
            <ThemedText type="small">{entry.content}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {formatRelative(entry.createdAt)}
            </ThemedText>
          </View>
        ))}
        {entries.length === 0 ? (
          <ThemedText type="small" themeColor="textSecondary">
            No entries yet.
          </ThemedText>
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  composer: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.three,
  },
  entry: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
