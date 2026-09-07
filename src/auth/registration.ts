/**
 * Just-in-time registration demo: a user without an explicit role is treated
 * as an ordinary member of the public (citizen / customer) and gets a local
 * "account" the first time they sign in — the way a ГИС provisions citizens
 * arriving via Госуслуги, or a shop provisions customers arriving via Яндекс ID.
 *
 * The record lives in the browser's localStorage, keyed by the token `sub`.
 */
const PREFIX = 'emi_demo_registered:';
const NEW_WINDOW_MS = 90_000;

export interface Registration {
  registeredAt: number;
  /** True right after the record was created (within a short window). */
  isNew: boolean;
}

export function ensureRegistered(sub: string | undefined): Registration {
  const now = Date.now();
  if (!sub) return { registeredAt: now, isNew: false };
  const key = PREFIX + sub;
  try {
    const existing = Number(localStorage.getItem(key));
    if (existing > 0) return { registeredAt: existing, isNew: now - existing < NEW_WINDOW_MS };
    localStorage.setItem(key, String(now));
  } catch {
    /* localStorage unavailable — treat as a fresh, non-persistent registration */
  }
  return { registeredAt: now, isNew: true };
}
