import { appActions, appStore } from '@/lib/app-store';
import type { ID, PersonalityAgent, SocialCircle } from '@/types';
import { agentsVisibleToCircle, canCircleSeeAgent } from '@/utils';

/** Circle + visibility (permission) service. */

export function getCircles(): SocialCircle[] {
  return appStore.getState().circles;
}

export function createCircle(input: { name: string; description?: string }): void {
  appActions.addCircle(input);
}

/** Expose or hide an agent for a circle. */
export function setAgentVisibility(agentId: ID, circleId: ID, isVisible: boolean): void {
  appActions.setAgentVisibility(agentId, circleId, isVisible);
}

export function isAgentVisibleToCircle(agentId: ID, circleId: ID): boolean {
  return canCircleSeeAgent(appStore.getState().visibilityRules, agentId, circleId);
}

export function getAgentsForCircle(circleId: ID): PersonalityAgent[] {
  const { agents, visibilityRules } = appStore.getState();
  return agentsVisibleToCircle(agents, visibilityRules, circleId);
}
