import { Redirect, Tabs } from 'expo-router';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { type ColorValue, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppState } from '@/lib/app-store';

function TabIcon({ name, color }: { name: SymbolViewProps['name']; color: ColorValue }) {
  return <SymbolView name={name} tintColor={color} size={26} />;
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const onboardingCompleted = useAppState((s) => s.profile.onboardingCompleted);

  // Gate the main app behind onboarding. Onboarding + generation live outside
  // this group, so they are unaffected by this redirect.
  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="circles"
        options={{
          title: 'Circles',
          tabBarIcon: ({ color }) => <TabIcon name="person.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rewrite"
        options={{
          title: 'Rewrite',
          tabBarIcon: ({ color }) => <TabIcon name="square.and.pencil" color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <TabIcon name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabIcon name="person.crop.circle.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
