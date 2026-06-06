import { AGENT_ARCHETYPES } from '@/constants/agent-archetypes';
import { appActions, appStore } from '@/lib/app-store';
import type { Narrative, PersonalityAgent, RewriteResult, SocialPlatform } from '@/types';
import { createId, nowISO } from '@/utils';

/**
 * "One story, multiple narratives".
 *
 * Each active agent rewrites a single source idea through its own lens, for a
 * chosen platform. This is a deterministic placeholder; swap `composeNarrative`
 * for an OpenAI call (one per agent, or one batched call) when ready.
 */
export async function rewriteStory(args: {
  sourceText: string;
  platform: SocialPlatform;
}): Promise<RewriteResult> {
  await delay(900);

  const { agents, currentUser } = appStore.getState();
  const activeAgents = agents.filter((a) => a.isActive);

  const narratives: Narrative[] = activeAgents.map((agent) => ({
    agentId: agent.id,
    agentName: agent.name,
    platform: args.platform,
    content: composeNarrative(agent, args.sourceText, args.platform),
  }));

  const result: RewriteResult = {
    id: createId('rewrite'),
    userId: currentUser.id,
    sourceText: args.sourceText.trim(),
    platform: args.platform,
    narratives,
    createdAt: nowISO(),
  };

  appActions.addRewrite(result);
  return result;
}

function narrativeFocusFor(agent: PersonalityAgent): string {
  const match = AGENT_ARCHETYPES.find((a) => a.name === agent.name);
  return match?.narrativeFocus ?? 'your authentic perspective';
}

function composeNarrative(
  agent: PersonalityAgent,
  source: string,
  platform: SocialPlatform,
): string {
  const focus = narrativeFocusFor(agent);
  const idea = source.trim().replace(/\s+/g, ' ');

  switch (platform) {
    case 'instagram':
      return `${idea} ✨\n\nThrough the eyes of my ${agent.name}: this was really about ${focus}.\n\n#${agent.name.replace(/\s+/g, '')} #magi`;
    case 'x':
      return `${idea}\n\n(${agent.name}'s take: it was all about ${focus}.)`;
    case 'linkedin':
      return `${idea}\n\nReflecting as my ${agent.name} self, the throughline here was ${focus} — and what that means for where I'm headed next.`;
    case 'blog':
      return `# ${agent.name}'s account\n\n${idea}\n\nBut if I'm honest, this story was really about ${focus}. Let me explain what I mean...`;
    case 'journal':
    default:
      return `${agent.name}:\n${idea}\n\nWhat stays with me is ${focus}.`;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
