/**
 * Lightweight ID helpers. For mock/in-memory data we don't need RFC-4122
 * guarantees; Postgres generates real UUIDs server-side via gen_random_uuid().
 */

export function createId(prefix = ''): string {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  const id = `${time}${random}`;
  return prefix ? `${prefix}_${id}` : id;
}
