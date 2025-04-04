// app/(app)/progreso.tsx
import { Stack } from 'expo-router';
import Progreso from '@/components/progreso';
import RegistrarProgreso from '@/components/RegistrarProgreso';
export default function two() {
  return (
    <>
      <Stack.Screen options={{ title: 'Mi Progreso',headerShown: false }} />
      <RegistrarProgreso/>
      <Progreso />
    </>
  );
}