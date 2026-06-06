import type { JournalEntry, MemoryImport, Profile, User } from '@/types';
import {
  buildDefaultCircles,
  buildDefaultVisibilityRules,
  createId,
  generateAgentsFromAnswers,
  nowISO,
} from '@/utils';

import type { AppState } from './app-store';

/**
 * Demo onboarding answers used only to seed a realistic, fully-navigable app
 * before a real user has gone through onboarding. Set `onboardingCompleted` to
 * false on the profile if you'd rather force the onboarding flow on launch.
 */
const DEMO_ANSWERS = [
  { questionId: 'name', values: ['Sven'] },
  {
    questionId: 'self_description',
    values: ['A maker who loves building things and the people around me.'],
  },
  { questionId: 'driving_forces', values: ['building', 'connection', 'adventure', 'meaning'] },
  { questionId: 'shadow', values: ['I worry I am never doing enough.'] },
];

export function buildInitialState(): AppState {
  const timestamp = nowISO();

  const currentUser: User = {
    id: createId('user'),
    email: 'you@magi.app',
    createdAt: timestamp,
  };

  const profile: Profile = {
    id: createId('profile'),
    userId: currentUser.id,
    username: 'you',
    displayName: 'Sven',
    bio: 'Building MAGI — a living personality graph.',
    avatarUrl: 'https://api.dicebear.com/9.x/glass/png?seed=magi-you',
    // Flip to `false` to land on the onboarding flow at launch.
    onboardingCompleted: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const agents = generateAgentsFromAnswers(currentUser.id, DEMO_ANSWERS);
  const circles = buildDefaultCircles(currentUser.id);
  const visibilityRules = buildDefaultVisibilityRules(currentUser.id, agents, circles);

  const journalEntries: JournalEntry[] = [
    {
      id: createId('journal'),
      userId: currentUser.id,
      title: 'First week in NYC',
      content:
        'I moved to NYC and started a new job. Everything feels loud and alive and a little overwhelming.',
      embedding: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: createId('journal'),
      userId: currentUser.id,
      title: null,
      content: 'Long walk by the water tonight. Felt grateful and a little homesick at the same time.',
      embedding: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];

  const memoryImports: MemoryImport[] = [];

  return {
    currentUser,
    profile,
    onboardingDraft: { answers: [], memoryImportText: '' },
    agents,
    circles,
    circleMembers: [],
    visibilityRules,
    journalEntries,
    memoryImports,
    interactions: [],
    rewrites: [],
  };
}
