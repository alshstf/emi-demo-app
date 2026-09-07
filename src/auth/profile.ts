import type { User } from 'oidc-client-ts';

/**
 * A theme-agnostic view of who signed in, assembled from the ID token (and the
 * access token as a fallback). Standard OIDC claims plus a few aliases that
 * Russian IdPs / brokers (ЕСИА via Keycloak-style mappers) commonly emit.
 */
export interface UserProfileView {
  sub?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  username?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  birthdate?: string;
  snils?: string;
  inn?: string;
  /** Upstream identity provider, when the broker reports it (e.g. "esia", "yandex"). */
  identityProvider?: string;
  issuedAt?: number;
}

/** Base64url-decode and JSON-parse a JWT payload. Returns {} on any failure. */
export function decodeJwtPayload(token?: string): Record<string, unknown> {
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

function str(claims: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = claims[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number') return String(v);
  }
  return undefined;
}

function bool(claims: Record<string, unknown>, ...keys: string[]): boolean | undefined {
  for (const k of keys) {
    const v = claims[k];
    if (typeof v === 'boolean') return v;
    if (v === 'true' || v === '1') return true;
    if (v === 'false' || v === '0') return false;
  }
  return undefined;
}

/** Merge ID-token claims (priority) with access-token claims (fallback). */
export function mergedClaims(user: User | null | undefined): Record<string, unknown> {
  if (!user) return {};
  const id = (user.profile as Record<string, unknown> | undefined) ?? {};
  const access = decodeJwtPayload(user.access_token);
  return { ...access, ...id };
}

export function userProfile(user: User | null | undefined): UserProfileView {
  const c = mergedClaims(user);
  const firstName = str(c, 'given_name', 'first_name', 'firstname');
  const lastName = str(c, 'family_name', 'last_name', 'lastname', 'surname');
  const middleName = str(c, 'middle_name', 'patronymic');
  const username = str(c, 'preferred_username', 'username', 'login');
  const email = str(c, 'email');
  const composed = [lastName, firstName, middleName].filter(Boolean).join(' ');
  const fullName = str(c, 'name') || composed || username || email || 'Пользователь';

  return {
    sub: str(c, 'sub'),
    fullName,
    firstName,
    lastName,
    middleName,
    username,
    email,
    emailVerified: bool(c, 'email_verified'),
    phone: str(c, 'phone_number', 'phone', 'mobile', 'mobile_phone'),
    phoneVerified: bool(c, 'phone_number_verified'),
    birthdate: str(c, 'birthdate', 'birth_date'),
    snils: str(c, 'snils'),
    inn: str(c, 'inn'),
    identityProvider: str(c, 'identity_provider', 'idp', 'provider'),
    issuedAt: typeof c.iat === 'number' ? c.iat : undefined,
  };
}

/** Short greeting name: first name if present, otherwise the first word of the full name. */
export function shortName(p: UserProfileView): string {
  return p.firstName || p.fullName.split(' ')[0];
}
