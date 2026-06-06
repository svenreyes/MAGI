import { useAppState } from '@/lib/app-store';
import type { ID } from '@/types';

export function useAgents() {
  return useAppState((s) => s.agents);
}

export function useAgent(agentId: ID | undefined) {
  return useAppState((s) => s.agents.find((a) => a.id === agentId));
}

export function useActiveAgents() {
  return useAppState((s) => s.agents.filter((a) => a.isActive));
}
