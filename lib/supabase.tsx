import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qspkrvrymtyciiqgvouc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcGtydnJ5bXR5Y2lpcWd2b3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2NjE3NDAsImV4cCI6MjA1OTIzNzc0MH0.d0Ybkxc9b0ZI-hwhCg_-3MlLlxK8ldfXep6PVtsO6bY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})