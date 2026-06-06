/**
 * Centralized access to public runtime configuration.
 *
 * Expo inlines `process.env.EXPO_PUBLIC_*` variables at build time, so these
 * are safe to read in client code. Define them in a `.env` file (see
 * `.env.example`). Secrets (OpenAI keys, service-role keys, Honcho keys) must
 * NOT live here — they belong on the FastAPI backend.
 */

export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  /** Base URL of the FastAPI backend that fronts OpenAI + Honcho. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
} as const;

/** True when Supabase env vars are present and the real client can be used. */
export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

/** True when the backend API is configured (otherwise services use mocks). */
export const isApiConfigured = Boolean(env.apiBaseUrl);
