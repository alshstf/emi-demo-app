import type { Theme } from '../../theme/types';
import './styles.css';
import { initA11y } from './a11y';
import { Splash } from './components/Splash';
import { LandingPage } from './pages/LandingPage';
import { SpecialistPage } from './pages/SpecialistPage';
import { ManagerPage } from './pages/ManagerPage';
import { RolePicker } from './pages/RolePicker';
import { CitizenPage } from './pages/CitizenPage';
import { SessionPage } from './pages/SessionPage';
import { AuthErrorPage, MisconfiguredPage, BootstrapError } from './pages/SystemPages';
import { config } from '../../config';

initA11y();

/** «Типовая ГИС» — the formal state-information-system skin. */
export const gisTheme: Theme = {
  id: 'gis',
  meta: {
    title: `${config.gis_name} — вход в систему`,
    description: `${config.gis_full_name}. Вход через Evolution Managed Identities.`,
    favicon: '/gis.svg',
    // Fonts are self-hosted (@fontsource/roboto) — no external requests.
  },
  roleLabels: { courier: 'Специалист', supervisor: 'Руководитель', default: 'Гражданин' },
  splash: { boot: 'Подключение к сервису идентификации…', auth: 'Проверка учётной записи…' },
  Splash,
  Landing: LandingPage,
  AuthError: AuthErrorPage,
  Misconfigured: MisconfiguredPage,
  BootstrapError,
  CourierHome: SpecialistPage,
  SupervisorHome: ManagerPage,
  RolePicker,
  DefaultHome: CitizenPage,
  extraRoutes: [{ path: '/session', element: <SessionPage /> }],
};
