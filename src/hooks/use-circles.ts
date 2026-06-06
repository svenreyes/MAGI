import { useAppState } from '@/lib/app-store';

export function useCircles() {
  return useAppState((s) => s.circles);
}

export function useVisibilityRules() {
  return useAppState((s) => s.visibilityRules);
}
