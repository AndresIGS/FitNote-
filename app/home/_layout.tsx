// app/(app)/_layout.tsx
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/constants/Colors';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/Auth" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="metas"
        options={{
          title: 'Metas',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="progreso"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}