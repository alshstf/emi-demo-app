import type { ComponentType, ReactNode } from 'react';
import type { KnownRole } from '../auth/roles';

export type ThemeId = 'burger' | 'gis';

export interface AuthErrorProps {
  error: Error;
  onHome: () => void;
}

/**
 * A theme ("skin") is a complete set of screens for the same OIDC flow.
 * The auth logic, routing and role handling are shared; only the visuals,
 * the wording and the demo data differ.
 */
export interface Theme {
  id: ThemeId;
  meta: {
    /** document.title */
    title: string;
    /** <meta name="description"> */
    description: string;
    /** favicon href (served from /public) */
    favicon: string;
    /** External stylesheet URLs (web fonts) injected at runtime for this theme only. */
    fontLinks?: string[];
  };
  /** Human-readable names of the IdP roles as shown in this skin (`default` = no explicit role). */
  roleLabels: Record<KnownRole | 'default', string>;
  /** Default labels of the loading screen. */
  splash: { boot: string; auth: string };

  Splash: ComponentType<{ label?: string }>;
  /** "/" for guests: the entry page with the login button. */
  Landing: ComponentType;
  /** The IdP redirect came back with an error. */
  AuthError: ComponentType<AuthErrorProps>;
  /** OIDC_AUTHORITY / OIDC_CLIENT_ID are not set. */
  Misconfigured: ComponentType;
  /** Discovery / bootstrap of the OIDC client failed. */
  BootstrapError: ComponentType<{ error: Error }>;
  /** Home screen of the `courier` role. */
  CourierHome: ComponentType;
  /** Home screen of the `supervisor` role. */
  SupervisorHome: ComponentType;
  /** The user has both roles. */
  RolePicker: ComponentType;
  /**
   * Home of the implicit role: an authenticated user without courier/supervisor
   * (a citizen who came via Госуслуги, a customer who came via Яндекс ID, …).
   * Registered on the fly from the token claims.
   */
  DefaultHome: ComponentType;
  /** Optional extra authenticated routes (e.g. a session-details page). */
  extraRoutes?: { path: string; element: ReactNode }[];
}
