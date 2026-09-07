import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { extractRoles, hasRole, type KnownRole } from './roles';
import { theme } from '../theme';

/** Requires an authenticated session; otherwise sends the user to the landing page. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.isLoading) return <theme.Splash label={theme.splash.auth} />;
  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/**
 * Requires a specific role. Users without it are routed back to "/" where they
 * are redirected to their own role home (no loop: Home never sends to a role
 * page the user lacks).
 */
export function RequireRole({ role, children }: { role: KnownRole; children: ReactNode }) {
  const auth = useAuth();
  if (auth.isLoading) return <theme.Splash label={theme.splash.auth} />;
  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  if (!hasRole(extractRoles(auth.user), role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}
