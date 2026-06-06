import { AGENT_ARCHETYPES, type AgentArchetype } from '@/constants/agent-archetypes';
import type {
  AgentVisibilityRule,
  AgentVisibilityScope,
  CircleType,
  ID,
  OnboardingAnswer,
  PersonalityAgent,
  SocialCircle,
} from '@/types';
import { CIRCLE_TYPE_LABELS, CIRCLE_TYPES } from '@/types';

import { paletteForStyle } from './color';
import { nowISO } from './date';
import { createId } from './id';

/**
 * Build a single agent from an archetype template. The avatar URL is a
 * deterministic placeholder until the OpenAI image pipeline is connected.
 */
export function buildAgentFromArchetype(
  userId: ID,
  archetype: AgentArchetype,
  seed: number,
): PersonalityAgent {
  const palette = paletteForStyle(archetype.visualStyle, seed);
  const timestamp = nowISO();
  return {
    id: createId('agent'),
    userId,
    name: archetype.name,
    description: archetype.description,
    personalityPrompt: archetype.personalityPrompt,
    visual: {
      style: archetype.visualStyle,
      palette,
      avatarUrl: placeholderAvatar(archetype, palette.primary),
      avatarPrompt: `${archetype.visualStyle} portrait representing the ${archetype.name} facet`,
    },
    defaultVisibility: archetype.defaultVisibility,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

/** A placeholder avatar (DiceBear) seeded by the archetype + color. */
function placeholderAvatar(archetype: AgentArchetype, primary: string): string {
  const bg = primary.replace('#', '');
  return `https://api.dicebear.com/9.x/shapes/png?seed=${archetype.key}&backgroundColor=${bg}`;
}

/**
 * Placeholder agent generation: select 3-5 archetypes biased by the user's
 * "driving forces" answer, always producing a coherent set.
 */
export function generateAgentsFromAnswers(
  userId: ID,
  answers: OnboardingAnswer[],
): PersonalityAgent[] {
  const forces = answers.find((a) => a.questionId === 'driving_forces')?.values ?? [];
  const hasShadow = (answers.find((a) => a.questionId === 'shadow')?.values[0] ?? '').trim().length > 0;

  const selected: AgentArchetype[] = [];
  const add = (archetype: AgentArchetype) => {
    if (!selected.some((a) => a.key === archetype.key)) selected.push(archetype);
  };

  for (const archetype of AGENT_ARCHETYPES) {
    if (archetype.matches.some((m) => forces.includes(m))) add(archetype);
  }
  if (hasShadow) {
    const shadow = AGENT_ARCHETYPES.find((a) => a.key === 'shadow');
    if (shadow) add(shadow);
  }

  // Guarantee a minimum of 3 and a maximum of 5 distinct facets.
  for (const archetype of AGENT_ARCHETYPES) {
    if (selected.length >= 3) break;
    add(archetype);
  }

  return selected.slice(0, 5).map((archetype, index) => buildAgentFromArchetype(userId, archetype, index));
}

/** Create the five default circles for a new user. */
export function buildDefaultCircles(userId: ID): SocialCircle[] {
  const timestamp = nowISO();
  return CIRCLE_TYPES.map((type: CircleType) => ({
    id: createId('circle'),
    userId,
    type,
    name: CIRCLE_TYPE_LABELS[type],
    description: defaultCircleDescription(type),
    isPublic: type === 'public',
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function defaultCircleDescription(type: CircleType): string {
  switch (type) {
    case 'public':
      return 'Anyone can see these facets.';
    case 'friends':
      return 'People you know and trust.';
    case 'close_friends':
      return 'Your inner circle.';
    case 'family':
      return 'The people you grew up with or chose as family.';
    case 'custom':
      return 'A circle you define yourself.';
  }
}

/** Map an agent's default visibility scope onto the matching circle type. */
function scopeToCircleType(scope: AgentVisibilityScope): CircleType | null {
  switch (scope) {
    case 'public':
      return 'public';
    case 'friends':
      return 'friends';
    case 'close_friends':
      return 'close_friends';
    case 'family':
      return 'family';
    case 'private':
      return null;
  }
}

/**
 * Seed visibility rules from each agent's default scope. Agents default to
 * private (no exposing rule) unless their scope maps to a concrete circle.
 */
export function buildDefaultVisibilityRules(
  userId: ID,
  agents: PersonalityAgent[],
  circles: SocialCircle[],
): AgentVisibilityRule[] {
  const timestamp = nowISO();
  const rules: AgentVisibilityRule[] = [];

  for (const agent of agents) {
    const targetType = scopeToCircleType(agent.defaultVisibility);
    if (!targetType) continue;
    const circle = circles.find((c) => c.type === targetType);
    if (!circle) continue;
    rules.push({
      id: createId('rule'),
      userId,
      agentId: agent.id,
      circleId: circle.id,
      isVisible: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  return rules;
}
