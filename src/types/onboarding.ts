import type { ID, ISODateString } from './common';

/** The kind of input an onboarding question expects. */
export type OnboardingQuestionType = 'text' | 'longText' | 'single' | 'multi' | 'scale';

/** A category used to group questions and to bias agent generation. */
export type OnboardingCategory =
  | 'identity'
  | 'values'
  | 'relationships'
  | 'ambition'
  | 'creativity'
  | 'spirituality'
  | 'shadow';

export interface OnboardingOption {
  value: string;
  label: string;
}

/** A single onboarding question definition (static content). */
export interface OnboardingQuestion {
  id: string;
  category: OnboardingCategory;
  prompt: string;
  helperText?: string;
  type: OnboardingQuestionType;
  /** Options for `single` / `multi` questions. */
  options?: OnboardingOption[];
  /** Whether an answer is required to proceed. */
  required: boolean;
}

/** A user's answer to one onboarding question. */
export interface OnboardingAnswer {
  questionId: string;
  /** Normalized to string[] regardless of question type for storage simplicity. */
  values: string[];
}

/**
 * Raw memory text the user pasted back from an external LLM (ChatGPT/Claude).
 * Mirrors the `memory_imports` table.
 */
export interface MemoryImport {
  id: ID;
  userId: ID;
  /** Which assistant the prompt was run against, if known. */
  source: 'chatgpt' | 'claude' | 'other';
  /** The prompt MAGI generated for the user to paste. */
  prompt: string;
  /** The response the user pasted back. */
  rawResponse: string;
  /** Optional embedding (pgvector) for retrieval. */
  embedding: number[] | null;
  createdAt: ISODateString;
}

/** Everything collected during onboarding before agents are generated. */
export interface OnboardingDraft {
  answers: OnboardingAnswer[];
  memoryImportText: string;
}
