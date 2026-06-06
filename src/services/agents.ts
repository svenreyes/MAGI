import { appActions, appStore } from '@/lib/app-store';
import type { ID, MemoryImport, OnboardingAnswer, PersonalityAgent } from '@/types';
import {
  buildDefaultCircles,
  buildDefaultVisibilityRules,
  createId,
  generateAgentsFromAnswers,
  nowISO,
} from '@/utils';

/**
 * Agent generation service.
 *
 * Today this runs a deterministic, archetype-based generator locally so the
 * product is fully usable. When the FastAPI + OpenAI pipeline is ready, replace
 * the body of `generateAgents` with a call to the backend; the return shape and
 * the way results are committed to the store stay the same.
 */
export async function generateAgents(args: {
  answers: OnboardingAnswer[];
  memoryImportText?: string;
}): Promise<PersonalityAgent[]> {
  // Simulate network/AI latency for realistic UI states.
  await delay(1200);

  const userId = appStore.getState().currentUser.id;
  const agents = generateAgentsFromAnswers(userId, args.answers);
  const circles = buildDefaultCircles(userId);
  const visibilityRules = buildDefaultVisibilityRules(userId, agents, circles);

  let memoryImport: MemoryImport | undefined;
  if (args.memoryImportText && args.memoryImportText.trim().length > 0) {
    memoryImport = {
      id: createId('memory'),
      userId,
      source: 'other',
      prompt: '',
      rawResponse: args.memoryImportText.trim(),
      embedding: null,
      createdAt: nowISO(),
    };
  }

  appActions.completeOnboarding({ agents, circles, visibilityRules, memoryImport });
  return agents;
}

export function getAgents(): PersonalityAgent[] {
  return appStore.getState().agents;
}

export function getAgentById(agentId: ID): PersonalityAgent | undefined {
  return appStore.getState().agents.find((a) => a.id === agentId);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
