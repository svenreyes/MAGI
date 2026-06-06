import type { ID, ISODateString } from './common';

/**
 * The default circle visibility scope for an agent. Concrete per-circle rules
 * live in `agent_visibility_rules`; this is the coarse default used as a
 * fallback and for quick UI display.
 */
export type AgentVisibilityScope =
  | 'public'
  | 'friends'
  | 'close_friends'
  | 'family'
  | 'private';

export const AGENT_VISIBILITY_SCOPES: readonly AgentVisibilityScope[] = [
  'public',
  'friends',
  'close_friends',
  'family',
  'private',
] as const;

export const AGENT_VISIBILITY_LABELS: Record<AgentVisibilityScope, string> = {
  public: 'Public',
  friends: 'Friends',
  close_friends: 'Close Friends',
  family: 'Family',
  private: 'Private',
};

/** The aesthetic direction used to generate an agent's visual identity. */
export type AgentVisualStyle =
  | 'cyberpunk'
  | 'minimalist'
  | 'painterly'
  | 'celestial'
  | 'gothic'
  | 'futuristic';

export const AGENT_VISUAL_STYLES: readonly AgentVisualStyle[] = [
  'cyberpunk',
  'minimalist',
  'painterly',
  'celestial',
  'gothic',
  'futuristic',
] as const;

/** A small, theme-able color palette for an agent. */
export interface ColorPalette {
  /** Primary brand color (hex). */
  primary: string;
  /** Secondary / accent color (hex). */
  secondary: string;
  /** Background color for cards and detail screens (hex). */
  background: string;
  /** Foreground text color that reads well on `background` (hex). */
  text: string;
}

/** Metadata describing how an agent's avatar was produced. */
export interface AgentVisualIdentity {
  style: AgentVisualStyle;
  palette: ColorPalette;
  /** URL of the AI-generated (or placeholder) avatar image. */
  avatarUrl: string;
  /** The prompt used to generate the avatar, kept for regeneration. */
  avatarPrompt: string | null;
}

/**
 * A distinct facet of the user's identity. Mirrors the `personality_agents`
 * table.
 */
export interface PersonalityAgent {
  id: ID;
  userId: ID;
  /** Short archetype name, e.g. "Builder", "Romantic". */
  name: string;
  /** One-to-two sentence human-readable description. */
  description: string;
  /** System prompt that grounds the agent when it speaks in-character. */
  personalityPrompt: string;
  visual: AgentVisualIdentity;
  /** Coarse default visibility; fine-grained control via visibility rules. */
  defaultVisibility: AgentVisibilityScope;
  /** Whether this agent is active / surfaced in the UI. */
  isActive: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * A point-in-time capture of an agent's traits, used to model how identity
 * evolves over time. Mirrors the `personality_snapshots` table.
 */
export interface PersonalitySnapshot {
  id: ID;
  agentId: ID;
  userId: ID;
  /** Free-form trait map, e.g. { ambition: 0.8, openness: 0.6 }. */
  traits: Record<string, number>;
  /** A short summary of the agent at this moment. */
  summary: string;
  /** Optional embedding vector (pgvector) for similarity over time. */
  embedding: number[] | null;
  createdAt: ISODateString;
}
