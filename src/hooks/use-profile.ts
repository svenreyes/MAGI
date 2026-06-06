import { useAppState } from '@/lib/app-store';

export function useProfile() {
  return useAppState((s) => s.profile);
}

export function useCurrentUser() {
  return useAppState((s) => s.currentUser);
}
