import type {
  AgentInteraction,
  AgentMessage,
  AgentVisibilityRule,
  CircleMember,
  ID,
  JournalEntry,
  MemoryImport,
  OnboardingDraft,
  PersonalityAgent,
  Profile,
  RewriteResult,
  SocialCircle,
  User,
} from '@/types';
import { createId, nowISO } from '@/utils';

import { buildInitialState } from './mock-data';
import { createStore, useStore } from './store';

/**
 * The full in-memory application state. This is the single source of truth for
 * the navigable mock app. Each slice maps to a Supabase table so swapping in
 * real persistence later is a service-layer change, not a screen change.
 */
export interface AppState {
  currentUser: User;
  profile: Profile;
  onboardingDraft: OnboardingDraft;
  agents: PersonalityAgent[];
  circles: SocialCircle[];
  circleMembers: CircleMember[];
  visibilityRules: AgentVisibilityRule[];
  journalEntries: JournalEntry[];
  memoryImports: MemoryImport[];
  interactions: AgentInteraction[];
  rewrites: RewriteResult[];
}

export const appStore = createStore<AppState>(buildInitialState());

/** Hook into a slice of app state. */
export function useAppState<S>(selector: (state: AppState) => S): S {
  return useStore(appStore, selector);
}

// ---------------------------------------------------------------------------
// Actions — the only sanctioned way to mutate state.
// ---------------------------------------------------------------------------
export const appActions = {
  reset() {
    appStore.setState(buildInitialState());
  },

  updateProfile(patch: Partial<Profile>) {
    appStore.setState((s) => ({
      profile: { ...s.profile, ...patch, updatedAt: nowISO() },
    }));
  },

  setOnboardingDraft(draft: Partial<OnboardingDraft>) {
    appStore.setState((s) => ({
      onboardingDraft: { ...s.onboardingDraft, ...draft },
    }));
  },

  completeOnboarding(args: {
    agents: PersonalityAgent[];
    circles: SocialCircle[];
    visibilityRules: AgentVisibilityRule[];
    memoryImport?: MemoryImport;
  }) {
    appStore.setState((s) => ({
      agents: args.agents,
      circles: args.circles,
      visibilityRules: args.visibilityRules,
      memoryImports: args.memoryImport
        ? [...s.memoryImports, args.memoryImport]
        : s.memoryImports,
      profile: { ...s.profile, onboardingCompleted: true, updatedAt: nowISO() },
    }));
  },

  updateAgent(agentId: ID, patch: Partial<PersonalityAgent>) {
    appStore.setState((s) => ({
      agents: s.agents.map((a) =>
        a.id === agentId ? { ...a, ...patch, updatedAt: nowISO() } : a,
      ),
    }));
  },

  /** Toggle whether an agent is exposed to a circle (the permission system). */
  setAgentVisibility(agentId: ID, circleId: ID, isVisible: boolean) {
    appStore.setState((s) => {
      const existing = s.visibilityRules.find(
        (r) => r.agentId === agentId && r.circleId === circleId,
      );
      if (existing) {
        return {
          visibilityRules: s.visibilityRules.map((r) =>
            r.id === existing.id ? { ...r, isVisible, updatedAt: nowISO() } : r,
          ),
        };
      }
      const rule: AgentVisibilityRule = {
        id: createId('rule'),
        userId: s.currentUser.id,
        agentId,
        circleId,
        isVisible,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      return { visibilityRules: [...s.visibilityRules, rule] };
    });
  },

  addCircle(input: { name: string; description?: string }) {
    appStore.setState((s) => {
      const circle: SocialCircle = {
        id: createId('circle'),
        userId: s.currentUser.id,
        type: 'custom',
        name: input.name,
        description: input.description ?? null,
        isPublic: false,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      return { circles: [...s.circles, circle] };
    });
  },

  addJournalEntry(input: { title?: string; content: string }): JournalEntry {
    const entry: JournalEntry = {
      id: createId('journal'),
      userId: appStore.getState().currentUser.id,
      title: input.title ?? null,
      content: input.content,
      embedding: null,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    };
    appStore.setState((s) => ({ journalEntries: [entry, ...s.journalEntries] }));
    return entry;
  },

  addRewrite(result: RewriteResult) {
    appStore.setState((s) => ({ rewrites: [result, ...s.rewrites] }));
  },

  addMemoryImport(memoryImport: MemoryImport) {
    appStore.setState((s) => ({ memoryImports: [...s.memoryImports, memoryImport] }));
  },

  /** Append a message to an interaction thread, creating it if needed. */
  appendInteractionMessages(args: {
    agentId: ID;
    messages: AgentMessage[];
  }) {
    appStore.setState((s) => {
      const existing = s.interactions.find((i) => i.agentId === args.agentId);
      if (existing) {
        return {
          interactions: s.interactions.map((i) =>
            i.id === existing.id
              ? { ...i, messages: [...i.messages, ...args.messages], updatedAt: nowISO() }
              : i,
          ),
        };
      }
      const interaction: AgentInteraction = {
        id: createId('interaction'),
        ownerUserId: s.currentUser.id,
        agentId: args.agentId,
        viewerUserId: s.currentUser.id,
        messages: args.messages,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };
      return { interactions: [...s.interactions, interaction] };
    });
  },
};
