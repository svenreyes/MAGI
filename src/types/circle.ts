import type { ID, ISODateString } from './common';

/** Built-in circle archetypes plus an escape hatch for user-defined circles. */
export type CircleType =
  | 'public'
  | 'friends'
  | 'close_friends'
  | 'family'
  | 'custom';

export const CIRCLE_TYPES: readonly CircleType[] = [
  'public',
  'friends',
  'close_friends',
  'family',
  'custom',
] as const;

export const CIRCLE_TYPE_LABELS: Record<CircleType, string> = {
  public: 'Public',
  friends: 'Friends',
  close_friends: 'Close Friends',
  family: 'Family',
  custom: 'Custom',
};

/**
 * A social circle owned by a user. Mirrors the `social_circles` table.
 */
export interface SocialCircle {
  id: ID;
  userId: ID;
  type: CircleType;
  /** Display name. For built-in types this matches the label by default. */
  name: string;
  description: string | null;
  /** Whether anyone can see this circle's exposed agents without membership. */
  isPublic: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * A member of a circle (a viewer the owner has granted access to).
 * Mirrors the `circle_members` table.
 */
export interface CircleMember {
  id: ID;
  circleId: ID;
  /** The viewer's user id (the person being granted access). */
  memberUserId: ID;
  /** Cached display name so the UI can render without a join. */
  memberDisplayName: string;
  createdAt: ISODateString;
}

/**
 * Explicit per-(circle, agent) visibility decision. Mirrors the
 * `agent_visibility_rules` table. The presence of a row with `isVisible: true`
 * exposes `agentId` to everyone in `circleId`.
 */
export interface AgentVisibilityRule {
  id: ID;
  userId: ID;
  agentId: ID;
  circleId: ID;
  isVisible: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
