import { appActions, appStore } from '@/lib/app-store';
import type { MemoryImport, OnboardingAnswer } from '@/types';
import { createId, nowISO } from '@/utils';

/**
 * Build the prompt the user pastes into ChatGPT or Claude to retrieve the
 * personal context that assistant already knows about them. The response is
 * pasted back into MAGI and used as additional grounding for agent generation.
 */
export function buildMemoryImportPrompt(answers: OnboardingAnswer[] = []): string {
  const name = answers.find((a) => a.questionId === 'name')?.values[0]?.trim();
  const intro = name ? `My name is ${name}. ` : '';

  return [
    `${intro}I'm setting up a personal app that models the different facets of who I am.`,
    'Based on everything you know about me from our past conversations, write a detailed but organized summary of me.',
    '',
    'Please cover, in clearly labeled sections:',
    '- Career & work',
    '- Goals & ambitions',
    '- Hobbies & interests',
    '- Relationships & important people',
    '- Major life events',
    '- Values & beliefs',
    '- Personality & how I tend to express myself',
    '- Preferences (likes / dislikes)',
    '',
    'Write in the second person ("you are..."), be specific, and only include things you actually have evidence for.',
    'If you are unsure about something, leave it out rather than guessing.',
  ].join('\n');
}

/** Persist a pasted memory import. Mock: stored in-memory. */
export async function saveMemoryImport(input: {
  source: MemoryImport['source'];
  prompt: string;
  rawResponse: string;
}): Promise<MemoryImport> {
  const memoryImport: MemoryImport = {
    id: createId('memory'),
    userId: appStore.getState().currentUser.id,
    source: input.source,
    prompt: input.prompt,
    rawResponse: input.rawResponse,
    embedding: null,
    createdAt: nowISO(),
  };
  appActions.addMemoryImport(memoryImport);
  return memoryImport;
}
