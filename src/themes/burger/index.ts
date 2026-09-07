import type { Theme } from '../../theme/types';
import { Splash } from './components/Splash';
import { LandingPage } from './pages/LandingPage';
import { AuthErrorPage } from './pages/AuthErrorPage';
import { MisconfiguredPage } from './pages/MisconfiguredPage';
import { BootstrapError } from './pages/BootstrapError';
import { CourierPage } from './pages/CourierPage';
import { SupervisorPage } from './pages/SupervisorPage';
import { RolePicker } from './pages/RolePicker';
import { CustomerPage } from './pages/CustomerPage';

/** «Бургерный курьер» — the playful promo skin (ООО «Бургер и точка»). */
export const burgerTheme: Theme = {
  id: 'burger',
  meta: {
    title: 'Бургерный курьер — Бургер и точка',
    description: 'Бургерный курьер — вход через Evolution Managed Identities',
    favicon: '/burger.svg',
    fontLinks: [
      'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&display=swap',
    ],
  },
  roleLabels: { courier: 'Курьер', supervisor: 'Супервайзер', default: 'Покупатель' },
  splash: { boot: 'Подключаемся к Evolution Managed Identities…', auth: 'Проверяем пропуск…' },
  Splash,
  Landing: LandingPage,
  AuthError: AuthErrorPage,
  Misconfigured: MisconfiguredPage,
  BootstrapError,
  CourierHome: CourierPage,
  SupervisorHome: SupervisorPage,
  RolePicker,
  DefaultHome: CustomerPage,
};
