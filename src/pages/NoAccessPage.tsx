import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { PageTransition } from '../components/PageTransition';
import { Logo } from '../components/Logo';
import { config } from '../config';
import { extractRoles } from '../auth/roles';

// Authenticated, but without a known role (courier/supervisor). For the demo
// we show exactly which roles arrived in the token — handy for troubleshooting.
export function NoAccessPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const roles = extractRoles(auth.user);

  const logout = async () => {
    try {
      await auth.signoutRedirect({ post_logout_redirect_uri: config.post_logout_redirect_uri });
    } catch {
      await auth.removeUser();
      navigate('/', { replace: true });
    }
  };

  return (
    <PageTransition className="grid min-h-screen place-items-center bg-sunburst px-6 py-12">
      <div className="card w-full max-w-md p-8 text-center">
        <Logo className="mx-auto h-24 w-24 drop-shadow-xl" withText={false} />
        <h1 className="headline mt-4 text-2xl">Доступ не настроен</h1>
        <p className="mt-2 font-semibold text-burger-char/70">
          Вход выполнен, но у вашей учётной записи нет роли <b>courier</b> или <b>supervisor</b>.
        </p>

        <div className="mt-5 rounded-2xl bg-burger-cream p-4 text-left">
          <div className="text-xs font-bold uppercase tracking-wide text-burger-char/50">
            Клейм «{config.roles_claim}» в токене
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {roles.length > 0 ? (
              roles.map((r) => (
                <span key={r} className="chip bg-burger-char/10 text-burger-char/70">
                  {r}
                </span>
              ))
            ) : (
              <span className="text-sm font-semibold text-burger-char/60">роли не переданы</span>
            )}
          </div>
        </div>

        <button onClick={logout} className="btn-burger mt-6 text-lg">
          Выйти
        </button>
      </div>
    </PageTransition>
  );
}
