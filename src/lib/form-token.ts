import { CONTACT_SECRET } from 'astro:env/server';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

type Purpose = 'form' | 'reveal';

// A token is only accepted if it was made between these two limits ago
// Scripts that act on a page straight away are usually faster than any person
const MIN_AGE_MS: Record<Purpose, number> = {
  form: 3 * 1000,
  reveal: 2 * 1000,
};
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

// Without CONTACT_SECRET the key is new on every start, which only means a
// form opened before a restart has to be sent again.
const secret = CONTACT_SECRET ?? randomBytes(32).toString('hex');

const sign = (payload: string) =>
  createHmac('sha256', secret).update(payload).digest('base64url');

function make(purpose: Purpose, opened: number): string {
  const payload = `${opened}.${purpose}.${randomBytes(8).toString('base64url')}`;
  return `${payload}.${sign(payload)}`;
}

function parse(token: string): { opened: number; purpose: Purpose } | null {
  const parts = token.split('.');
  if (parts.length !== 4) return null;

  const payload = parts.slice(0, 3).join('.');
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(parts[3]);
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return null;

  const opened = Number(parts[0]);
  const purpose = parts[1];
  if (!Number.isFinite(opened) || (purpose !== 'form' && purpose !== 'reveal'))
    return null;

  return { opened, purpose };
}

/**
 * Makes a fresh form token. Pass the previous token to keep the original
 * opening time, so a retry does not look like a too-fast submit.
 */
export function issueFormToken(previous?: string, now = Date.now()): string {
  const old = previous ? parse(previous) : null;
  const keep = old?.purpose === 'form' && now - old.opened <= MAX_AGE_MS;
  return make('form', keep ? old.opened : now);
}

// Each form token works once. This lives in memory, like the rate limit.
const used = new Map<string, number>();

/** "invalid" covers a forged, reused, too-new or too-old token. */
export function checkFormToken(
  token: string,
  now = Date.now(),
): 'ok' | 'invalid' {
  const parsed = parse(token);
  if (!parsed || parsed.purpose !== 'form') return 'invalid';

  for (const [key, expires] of used) {
    if (expires < now) used.delete(key);
  }
  if (used.has(token)) return 'invalid';

  const age = now - parsed.opened;
  if (age < MIN_AGE_MS.form || age > MAX_AGE_MS) return 'invalid';

  used.set(token, now + MAX_AGE_MS);
  return 'ok';
}

/** The token behind the "Show email" link. */
export function issueRevealToken(now = Date.now()): string {
  return make('reveal', now);
}

/** Unlike a form token it can be used again, so going back and clicking twice still works. */
export function checkRevealToken(token: string, now = Date.now()): boolean {
  const parsed = parse(token);
  if (!parsed || parsed.purpose !== 'reveal') return false;

  const age = now - parsed.opened;
  return age >= MIN_AGE_MS.reveal && age <= MAX_AGE_MS;
}
