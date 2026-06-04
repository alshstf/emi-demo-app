import type { User } from 'oidc-client-ts';
import { config } from '../config';

export type KnownRole = 'courier' | 'supervisor';

/** Base64url-decode and JSON-parse a JWT payload. Returns {} on any failure. */
function decodeJwtPayload(token?: string): Record<string, unknown> {
  if (!token) return {};
  const parts = token.split('.');
  if (parts.length < 2) return {};
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    // Correctly handle UTF-8 (e.g. Cyrillic names) in the payload.
    const json = decodeURIComponent(
      Array.prototype.map
        .call(binary, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Normalize a claim value (array, space/comma-separated string) into a string[]. */
function toRoleArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v));
  if (typeof value === 'string') return value.split(/[,\s]+/).filter(Boolean);
  return [];
}

/**
 * Collect roles from the configured claim in BOTH the ID token (user.profile)
 * and the access token (decoded JWT). This is robust to IdPs that place the
 * `roles` claim in either token.
 */
export function extractRoles(user: User | null | undefined): string[] {
  if (!user) return [];
  const claim = config.roles_claim;
  const fromIdToken = toRoleArray((user.profile as Record<string, unknown> | undefined)?.[claim]);
  const fromAccessToken = toRoleArray(decodeJwtPayload(user.access_token)[claim]);
  const merged = new Set([...fromIdToken, ...fromAccessToken].map((r) => r.toLowerCase()));
  return [...merged];
}

export function hasRole(roles: string[], role: KnownRole): boolean {
  return roles.includes(role);
}

export type HomeTarget = '/courier' | '/supervisor' | '/choose' | '/no-access';

/** Decide where an authenticated user should land based on their roles. */
export function roleHome(roles: string[]): HomeTarget {
  const courier = hasRole(roles, 'courier');
  const supervisor = hasRole(roles, 'supervisor');
  if (courier && supervisor) return '/choose';
  if (courier) return '/courier';
  if (supervisor) return '/supervisor';
  return '/no-access';
}
