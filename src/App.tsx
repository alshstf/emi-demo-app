import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import { isConfigured } from './config';
import { extractRoles, roleHome } from './auth/roles';
import { RequireAuth, RequireRole } from './auth/guards';
import { theme } from './theme';
import { CallbackPage } from './pages/CallbackPage';

/** "/" — landing for guests, role-based redirect for authenticated users. */
function Home() {
  const auth = useAuth();
  if (auth.isLoading) return <theme.Splash label={theme.splash.auth} />;
  if (!auth.isAuthenticated) return <theme.Landing />;
  return <Navigate to={roleHome(extractRoles(auth.user))} replace />;
}

export default function App() {
  const location = useLocation();

  // Hard stop if the OIDC client is not configured (missing authority/client_id).
  if (!isConfigured) return <theme.Misconfigured />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/courier"
          element={
            <RequireRole role="courier">
              <theme.CourierHome />
            </RequireRole>
          }
        />
        <Route
          path="/supervisor"
          element={
            <RequireRole role="supervisor">
              <theme.SupervisorHome />
            </RequireRole>
          }
        />
        <Route
          path="/choose"
          element={
            <RequireAuth>
              <theme.RolePicker />
            </RequireAuth>
          }
        />
        <Route
          path="/cabinet"
          element={
            <RequireAuth>
              <theme.DefaultHome />
            </RequireAuth>
          }
        />
        {theme.extraRoutes?.map((r) => (
          <Route key={r.path} path={r.path} element={<RequireAuth>{r.element}</RequireAuth>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
