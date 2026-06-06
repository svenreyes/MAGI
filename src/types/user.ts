import type { ID, ISODateString } from './common';

/**
 * A MAGI account. Mirrors the `users` table, which is a thin extension of
 * Supabase `auth.users`.
 */
export interface User {
  id: ID;
  email: string;
  createdAt: ISODateString;
}

/**
 * Public-facing profile information. Mirrors the `profiles` table.
 */
export interface Profile {
  id: ID;
  userId: ID;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
