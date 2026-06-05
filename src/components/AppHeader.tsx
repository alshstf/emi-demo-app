import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Logo } from './Logo';
import { extractRoles } from '../auth/roles';
import { useLogout } from '../auth/useLogout';

const ROLE_LABEL: Record<string, string> = { courier: 'Курьер', supervisor: 'Супервайзер' };
const ROLE_CHIP: Record<string, string> = {
  courier: 'bg-burger-lettuce/25 text-green-800',
  supervisor: 'bg-burger-red/15 text-burger-deepred',
};

export function AppHeader({ subtitle }: { subtitle?: string }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const roles = extractRoles(auth.user);
  const p = auth.user?.profile;
  const name =
    (p?.name as string) ||
    (p?.preferred_username as string) ||
    (p?.given_name as string) ||
    (p?.email as string) ||
    'Пользователь';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-burger-char/10 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-8">
      <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left">
        <Logo className="h-12 w-12 shrink-0" withText={false} />
        <span>
          <span className="block font-display text-lg font-extrabold leading-none text-burger-deepred">
            Бургерный курьер
          </span>
          {subtitle && <span className="mt-0.5 block text-xs font-semibold text-burger-char/60">{subtitle}</span>}
        </span>
      </button>

      <div className="flex items-center gap-3">
        <div className="hidden flex-col items-end sm:flex">
          <span className="font-display font-bold leading-tight text-burger-char">{name}</span>
          <span className="mt-0.5 flex gap-1">
            {roles.length === 0 && <span className="chip bg-burger-char/10 text-burger-char/60">нет ролей</span>}
            {roles.map((r) => (
              <span key={r} className={`chip ${ROLE_CHIP[r] ?? 'bg-burger-char/10 text-burger-char/70'}`}>
                {ROLE_LABEL[r] ?? r}
              </span>
            ))}
          </span>
        </div>
        <button onClick={logout} className="btn-ghost">
          Выйти
        </button>
      </div>
    </header>
  );
}
