import type { ID, ISODateString } from './common';

export type MessageRole = 'viewer' | 'agent';

/** A single message inside an agent conversation. */
export interface AgentMessage {
  id: ID;
  role: MessageRole;
  content: string;
  createdAt: ISODateString;
}

/**
 * A conversation between a viewer and one of a user's personality agents.
 * Mirrors the `agent_interactions` table (messages stored as JSONB).
 */
export interface AgentInteraction {
  id: ID;
  /** The owner of the agent being spoken to. */
  ownerUserId: ID;
  agentId: ID;
  /** The viewer initiating the conversation (may equal owner in preview). */
  viewerUserId: ID;
  messages: AgentMessage[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}
