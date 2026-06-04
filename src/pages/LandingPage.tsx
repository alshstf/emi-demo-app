import { useAuth } from 'react-oidc-context';
import { PageTransition } from '../components/PageTransition';
import { FloatingBurgers } from '../components/FloatingBurgers';
import { Mascot } from '../components/Mascot';
import { Logo } from '../components/Logo';

export function LandingPage() {
  const auth = useAuth();
  const login = () => auth.signinRedirect();

  return (
    <PageTransition className="relative min-h-screen overflow-hidden bg-sunburst">
      <FloatingBurgers />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 py-12 text-center">
        <Logo className="h-40 w-40 animate-float drop-shadow-xl sm:h-48 sm:w-48" />
        <span className="chip mt-6 bg-white/80 text-sm text-burger-deepred">ООО «Бургер и точка»</span>
        <h1 className="headline mt-3 text-5xl sm:text-7xl">Бургерный курьер</h1>
        <p className="mt-4 max-w-xl text-lg font-semibold text-burger-char/80 sm:text-xl">
          Горячие бургеры — точно в срок. Войдите, чтобы начать смену.
        </p>

        <button onClick={login} className="btn-burger mt-10 animate-pulseGlow">
          <span>Войти</span>
          <span aria-hidden>🍔</span>
        </button>

        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-burger-char/60">
          <span aria-hidden>🔐</span> Вход через Evolution Managed Identities
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-2 z-10 w-36 sm:right-10 sm:w-52">
        <Mascot className="h-auto w-full drop-shadow-2xl" />
      </div>
    </PageTransition>
  );
}
