import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

import { env, isSupabaseConfigured } from './env';

/**
 * Supabase client.
 *
 * The client is created lazily and only when env vars are present, so the app
 * remains fully runnable with mock data before any Supabase project is wired
 * up. Call `getSupabase()` from the service layer; it throws a clear error if
 * Supabase has not been configured yet.
 *
 * Session persistence is currently disabled because no async storage adapter
 * is installed. When you add `@react-native-async-storage/async-storage`,
 * pass it via `auth.storage` and set `persistSession: true`.
 */
let client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and ' +
        'EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file.',
    );
  }
  if (!client) {
    client = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  }
  return client;
}
