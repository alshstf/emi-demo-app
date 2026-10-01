import type { User } from 'oidc-client-ts';
import { mergedClaims, userProfile } from '../../auth/profile';
import type { KnownRole } from '../../auth/roles';

/**
 * «Бейдж GoCloud Tech» — the conference skin. The badge is *assembled* from the
 * ID-token claims (never "printed": there is no printer in the demo). The colour
 * of the lanyard/strip encodes the IdP role.
 */
export type Lane = 'speaker' | 'staff' | 'attendee' | 'none' | 'error';

export interface LaneStyle {
  /** Text on the badge strip and in role chips. */
  label: string;
  /** Tailwind classes of the top strip. */
  strip: string;
  /** Logo tone that is legible on the strip. */
  logo: 'ink' | 'green' | 'white' | 'grey';
  /** Tailwind classes of the lanyard ribbons. */
  lanyard: string;
  /** Text colour class of the lane label inside the badge. */
  accent: string;
  /** Tailwind classes of a role chip. */
  chip: string;
}

export const LANES: Record<Lane, LaneStyle> = {
  speaker: {
    label: 'Спикер',
    strip: 'bg-gc-green',
    logo: 'ink',
    lanyard: 'bg-gc-green',
    accent: 'text-gc-greenDark',
    chip: 'bg-gc-green text-gc-ink',
  },
  staff: {
    label: 'Стафф',
    strip: 'bg-gc-ink',
    logo: 'green',
    lanyard: 'bg-gc-ink',
    accent: 'text-gc-ink',
    chip: 'bg-gc-ink text-white',
  },
  attendee: {
    label: 'Участник',
    strip: 'bg-white border-b border-gc-ink',
    logo: 'ink',
    lanyard: 'bg-white border border-gc-ink',
    accent: 'text-gc-ink',
    chip: 'border border-gc-ink text-gc-ink',
  },
  none: {
    label: 'Роль не определена',
    strip: 'bg-gc-paper border-b border-gc-line',
    logo: 'grey',
    lanyard: 'bg-gc-grey',
    accent: 'text-gc-grey',
    chip: 'border border-gc-grey text-gc-grey',
  },
  error: {
    label: 'Бейдж не собран',
    strip: 'bg-gc-red',
    logo: 'white',
    lanyard: 'bg-gc-red',
    accent: 'text-gc-red',
    chip: 'bg-gc-red text-white',
  },
};

/** IdP role → lane. The implicit role (no courier/supervisor) is an attendee. */
export const ROLE_LANE: Record<KnownRole, Lane> = { courier: 'speaker', supervisor: 'staff' };
export const ROLE_LABEL: Record<KnownRole, string> = { courier: LANES.speaker.label, supervisor: LANES.staff.label };
export const DEFAULT_ROLE_LABEL = LANES.attendee.label;

/** The lanes a set of roles entitles the user to (in display order). */
export function lanesForRoles(roles: string[]): Lane[] {
  const lanes: Lane[] = [];
  if (roles.includes('courier')) lanes.push('speaker');
  if (roles.includes('supervisor')) lanes.push('staff');
  if (lanes.length === 0) lanes.push('attendee');
  return lanes;
}

function firstString(claims: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = claims[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return undefined;
}

/**
 * The second line of the badge: an organisation claim when the IdP emits one
 * (`organization` / `company` / `org`), otherwise the e-mail or login.
 */
export function badgeOrg(user: User | null | undefined): string | undefined {
  const c = mergedClaims(user);
  const p = userProfile(user);
  return firstString(c, 'organization', 'organisation', 'company', 'org') ?? p.email ?? p.username;
}

export const APP_VERSION = '1.1.0';
export const BUILD_DATE = '01.10.2026';
