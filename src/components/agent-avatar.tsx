import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import type { PersonalityAgent } from '@/types';
import { readableTextColor } from '@/utils';

type Props = {
  agent: PersonalityAgent;
  size?: number;
};

/**
 * Renders an agent's avatar. Falls back to an initial on the agent's primary
 * color if the (placeholder) image fails to load.
 */
export function AgentAvatar({ agent, size = 56 }: Props) {
  const { palette, avatarUrl } = agent.visual;
  const radius = size / 4;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: palette.primary,
        },
      ]}>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: size, height: size, borderRadius: radius }}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <ThemedText
          type="smallBold"
          style={{ color: readableTextColor(palette.primary), fontSize: size / 2.5 }}>
          {agent.name.charAt(0)}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
