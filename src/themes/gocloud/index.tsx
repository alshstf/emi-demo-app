import type { Theme } from '../../theme/types';
import './styles.css';
import { Splash } from './components/Splash';
import { LandingPage } from './pages/LandingPage';
import { SpeakerPage } from './pages/SpeakerPage';
import { StaffPage } from './pages/StaffPage';
import { AttendeePage } from './pages/AttendeePage';
import { RolePicker } from './pages/RolePicker';
import { BadgePage } from './pages/BadgePage';
import { AuthErrorPage, MisconfiguredPage, BootstrapError } from './pages/SystemPages';
import { DEFAULT_ROLE_LABEL, ROLE_LABEL } from './brand';
import { config } from '../../config';

/**
 * «Бейдж GoCloud Tech» — the conference skin (default). The participant's badge
 * is assembled from the ID-token claims; the lanyard colour encodes the role.
 */
export const gocloudTheme: Theme = {
  id: 'gocloud',
  meta: {
    title: `${config.event_name} — собери свой бейдж`,
    description: `Бейдж участника ${config.event_name} собирается из ID-токена Evolution Managed Identities.`,
    favicon: '/gocloud.svg',
    // Fonts are self-hosted (@fontsource/manrope, @fontsource/jetbrains-mono) — no external requests.
  },
  roleLabels: { courier: ROLE_LABEL.courier, supervisor: ROLE_LABEL.supervisor, default: DEFAULT_ROLE_LABEL },
  splash: { boot: 'Подключаемся к Evolution Managed Identities…', auth: 'Собираем бейдж…' },
  Splash,
  Landing: LandingPage,
  AuthError: AuthErrorPage,
  Misconfigured: MisconfiguredPage,
  BootstrapError,
  CourierHome: SpeakerPage,
  SupervisorHome: StaffPage,
  RolePicker,
  DefaultHome: AttendeePage,
  extraRoutes: [{ path: '/badge', element: <BadgePage /> }],
};
