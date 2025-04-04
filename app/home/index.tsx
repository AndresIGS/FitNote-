import { Stack } from 'expo-router';

import Metas from '@/components/metas';
import { supabase } from '@/lib/supabase';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Mis metas', headerShown: false }} />
      <Metas />
      {/* <Button title="Sign out" onPress={() => supabase.auth.signOut()} /> */}
      
    </>
  );
}