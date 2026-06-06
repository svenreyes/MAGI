import { useSyncExternalStore } from 'react';

/**
 * A tiny dependency-free reactive store built on `useSyncExternalStore`.
 *
 * This is intentionally minimal: it holds the app's in-memory state so the
 * whole product is navigable with mock data before Supabase/OpenAI are wired
 * in. Swap the service layer to hit Supabase and this store can be replaced by
 * React Query / Zustand without touching screens.
 */
export interface Store<T> {
  getState: () => T;
  setState: (updater: Partial<T> | ((prev: T) => Partial<T>)) => void;
  subscribe: (listener: () => void) => () => void;
}

export function createStore<T extends object>(initialState: T): Store<T> {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState: Store<T>['setState'] = (updater) => {
    const patch = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { getState, setState, subscribe };
}

/** Subscribe to a slice of a store with a selector. */
export function useStore<T extends object, S>(store: Store<T>, selector: (state: T) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState()),
  );
}
