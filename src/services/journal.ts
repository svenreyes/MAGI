import { appActions, appStore } from '@/lib/app-store';
import type { JournalEntry } from '@/types';

/** Journal service. */

export function getJournalEntries(): JournalEntry[] {
  return appStore.getState().journalEntries;
}

export function createJournalEntry(input: { title?: string; content: string }): JournalEntry {
  return appActions.addJournalEntry(input);
}
