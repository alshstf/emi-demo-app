import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Splash } from '../components/Splash';
import { markJustLoggedIn } from '../components/confetti';

// Lands here after the IdP redirect. react-oidc-context exchanges the code for
// tokens automatically; we just wait, then route to "/" for role dispatch.
export function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isLoading) return;
    if (auth.isAuthenticated) {
      markJustLoggedIn();
      navigate('/', { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <div className="grid min-h-screen place-items-center bg-sunburst px-6">
        <div className="card max-w-md p-8 text-center">
          <div className="text-5xl">🍔💥</div>
          <h1 className="headline mt-4 text-2xl">Не удалось войти</h1>
          <p className="mt-2 break-words text-sm font-semibold text-burger-char/70">{auth.error.message}</p>
          <button className="btn-burger mt-6 text-lg" onClick={() => navigate('/', { replace: true })}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  return <Splash label="Проверяем пропуск…" />;
}
