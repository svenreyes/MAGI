import type { ISODateString } from '@/types';

export function nowISO(): ISODateString {
  return new Date().toISOString();
}

/** A compact, human-friendly relative time (e.g. "3d ago"). */
export function formatRelative(iso: ISODateString): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);

  if (sec < 60) return 'just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
