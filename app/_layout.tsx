import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthProvider from '@/providers/AuthProvider';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>

            <Stack screenOptions={{ headerShown: false }} />
            <StatusBar style="light" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}