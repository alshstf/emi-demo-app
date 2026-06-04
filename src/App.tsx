import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from 'react-oidc-context';
import { isConfigured } from './config';
import { extractRoles, roleHome } from './auth/roles';
import { RequireAuth, RequireRole } from './auth/guards';
import { Splash } from './components/Splash';
import { LandingPage } from './pages/LandingPage';
import { CallbackPage } from './pages/CallbackPage';
import { CourierPage } from './pages/CourierPage';
import { SupervisorPage } from './pages/SupervisorPage';
import { RolePicker } from './pages/RolePicker';
import { NoAccessPage } from './pages/NoAccessPage';
import { MisconfiguredPage } from './pages/MisconfiguredPage';

/** "/" — landing for guests, role-based redirect for authenticated users. */
function Home() {
  const auth = useAuth();
  if (auth.isLoading) return <Splash />;
  if (!auth.isAuthenticated) return <LandingPage />;
  return <Navigate to={roleHome(extractRoles(auth.user))} replace />;
}

export default function App() {
  const location = useLocation();

  // Hard stop if the OIDC client is not configured (missing authority/client_id).
  if (!isConfigured) return <MisconfiguredPage />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route
          path="/courier"
          element={
            <RequireRole role="courier">
              <CourierPage />
            </RequireRole>
          }
        />
        <Route
          path="/supervisor"
          element={
            <RequireRole role="supervisor">
              <SupervisorPage />
            </RequireRole>
          }
        />
        <Route
          path="/choose"
          element={
            <RequireAuth>
              <RolePicker />
            </RequireAuth>
          }
        />
        <Route
          path="/no-access"
          element={
            <RequireAuth>
              <NoAccessPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
