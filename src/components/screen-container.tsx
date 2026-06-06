import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

type Props = {
  children: ReactNode;
  /** When true, content is wrapped in a ScrollView. Defaults to true. */
  scroll?: boolean;
  /** Extra padding at the bottom (e.g. for a sticky footer). */
  contentBottomInset?: number;
  edges?: Edge[];
  style?: ViewStyle;
};

/**
 * Standard screen wrapper: full-bleed themed background, safe-area aware, with
 * a centered max-width content column for large screens.
 */
export function ScreenContainer({
  children,
  scroll = true,
  contentBottomInset = Spacing.six,
  edges = ['top', 'left', 'right'],
  style,
}: Props) {
  const inner = (
    <View style={[styles.column, { paddingBottom: contentBottomInset }, style]}>{children}</View>
  );

  return (
    <ThemedView style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={edges}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {inner}
          </ScrollView>
        ) : (
          <View style={styles.scrollContent}>{inner}</View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.four,
  },
});
