import { useAppState } from '@/lib/app-store';

export function useJournalEntries() {
  return useAppState((s) => s.journalEntries);
}
