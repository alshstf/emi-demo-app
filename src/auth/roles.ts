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

// Values that can be referenced from a claim-path template via %%NAME%%.
const TEMPLATE_VARS: Record<string, string> = {
  OIDC_CLIENT_ID: config.client_id,
  OIDC_AUTHORITY: config.authority,
  OIDC_SCOPE: config.scope,
  OIDC_ROLES_CLAIM: config.roles_claim,
};

/** Substitute %%NAME%% (and legacy {client_id}) within a single path segment. */
function interpolateSegment(segment: string): string {
  return segment
    .replace(/%%([A-Z0-9_]+)%%/g, (_match, name: string) => TEMPLATE_VARS[name] ?? `%%${name}%%`)
    .replace(/\{client_id\}/g, config.client_id);
}

/**
 * Split a claim-path template on dots and interpolate each segment. Templating
 * is done per-segment so a substituted value (e.g. a client_id containing dots)
 * stays a single object key.
 *
 * e.g. "resource_access.%%OIDC_CLIENT_ID%%.roles" -> ["resource_access", "<client_id>", "roles"]
 */
function claimPathSegments(template: string): string[] {
  return template
    .split('.')
    .map(interpolateSegment)
    .filter((s) => s.length > 0);
}

/** Walk a (templated) dot-separated claim path within a claims object. */
function resolveClaimPath(source: Record<string, unknown>, pathTemplate: string): unknown {
  let current: unknown = source;
  for (const segment of claimPathSegments(pathTemplate)) {
    if (current && typeof current === 'object' && !Array.isArray(current) && segment in current) {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

/** Collect roles from one claims object: the nested path plus the flat fallback. */
function rolesFromSource(source: Record<string, unknown>): string[] {
  const nested = toRoleArray(resolveClaimPath(source, config.roles_claim_path));
  const flat = toRoleArray(source[config.roles_claim]);
  return [...nested, ...flat];
}

/**
 * Collect roles from BOTH the ID token (user.profile) and the access token
 * (decoded JWT), looking under the configured nested path
 * (default `resource_access.<client_id>.roles`) and the flat `roles` claim.
 */
export function extractRoles(user: User | null | undefined): string[] {
  if (!user) return [];
  const idClaims = (user.profile as Record<string, unknown> | undefined) ?? {};
  const accessClaims = decodeJwtPayload(user.access_token);
  const merged = new Set(
    [...rolesFromSource(idClaims), ...rolesFromSource(accessClaims)].map((r) => r.toLowerCase()),
  );
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

/** Human-readable (interpolated) description of where roles are read from. */
export function rolesSourceDescription(): string {
  return claimPathSegments(config.roles_claim_path).join('.');
}
