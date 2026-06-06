import { appActions, appStore } from '@/lib/app-store';
import type { AgentInteraction, AgentMessage, ID } from '@/types';
import { createId, nowISO } from '@/utils';

import { getAgentById } from './agents';

/**
 * Agent messaging service. A viewer talks to one of a user's personality
 * agents, which replies in-character. Placeholder replies are generated locally;
 * replace `composeAgentReply` with a backend/OpenAI call grounded in the
 * agent's `personalityPrompt` and the user's memory/snapshots.
 */
export async function sendMessageToAgent(args: {
  agentId: ID;
  text: string;
}): Promise<AgentMessage> {
  const viewerMessage: AgentMessage = {
    id: createId('msg'),
    role: 'viewer',
    content: args.text.trim(),
    createdAt: nowISO(),
  };
  appActions.appendInteractionMessages({ agentId: args.agentId, messages: [viewerMessage] });

  await delay(700);

  const agent = getAgentById(args.agentId);
  const reply: AgentMessage = {
    id: createId('msg'),
    role: 'agent',
    content: composeAgentReply(agent?.name ?? 'Agent', args.text),
    createdAt: nowISO(),
  };
  appActions.appendInteractionMessages({ agentId: args.agentId, messages: [reply] });
  return reply;
}

export function getInteractionForAgent(agentId: ID): AgentInteraction | undefined {
  return appStore.getState().interactions.find((i) => i.agentId === agentId);
}

function composeAgentReply(agentName: string, viewerText: string): string {
  const trimmed = viewerText.trim();
  return `As ${agentName}, here's how I see it: "${trimmed}" — that's exactly the kind of thing I think about. (This is a placeholder reply; connect OpenAI to make me answer fully in-character.)`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
