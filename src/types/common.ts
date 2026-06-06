/**
 * Shared primitive types used across the MAGI domain models.
 */

/** A UUID string. */
export type ID = string;

/** An ISO-8601 timestamp string (e.g. `2026-06-06T12:00:00.000Z`). */
export type ISODateString = string;

/** Social platforms that a narrative can be authored for. */
export type SocialPlatform = 'instagram' | 'linkedin' | 'x' | 'journal' | 'blog';

export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  'instagram',
  'linkedin',
  'x',
  'journal',
  'blog',
] as const;

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  x: 'X',
  journal: 'Personal Journal',
  blog: 'Blog',
};

/**
 * A generic async result wrapper so the service layer can return either real
 * Supabase/OpenAI data or mock data behind a single shape.
 */
export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: ServiceError };

export interface ServiceError {
  message: string;
  code?: string;
  cause?: unknown;
}
