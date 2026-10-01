import { useEffect, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { config, isConfidential } from '../../../config';
import { extractRoles, hasRole, isDefaultRole } from '../../../auth/roles';
import { userProfile } from '../../../auth/profile';
import { useLogout } from '../../../auth/useLogout';
import { APP_VERSION, BUILD_DATE, LANES, lanesForRoles, type Lane } from '../brand';

export function issuerHost(): string {
  try {
    return new URL(config.authority).host;
  } catch {
    return config.authority;
  }
}

/** A role chip coloured like the badge lane. */
export function LaneChip({ lane, children }: { lane: Lane; children?: ReactNode }) {
  return <span className={`gc-chip ${LANES[lane].chip}`}>{children ?? LANES[lane].label}</span>;
}

/**
 * Text brand in the header: «cloud.ru / GOCLOUD TECH 2026», as on the event site.
 * A plain <a>, not a router <Link>: the brand is also shown on the misconfiguration
 * screens, which render outside <BrowserRouter>.
 */
export function Brand() {
  return (
    <a href="/" className="flex items-baseline gap-2 whitespace-nowrap text-gc-ink">
      <span className="text-base font-extrabold tracking-tight">cloud.ru</span>
      <span className="font-extrabold text-gc-green" aria-hidden>
        /
      </span>
      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em]">{config.event_name}</span>
    </a>
  );
}

export function TopBar({ right }: { right?: ReactNode }) {
  return (
    <header className="border-b border-gc-line bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Brand />
        <div className="ml-auto flex min-w-0 items-center gap-3">{right}</div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gc-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-xs text-gc-muted sm:px-6 md:grid-cols-3">
        <div>
          <div className="gc-label text-gc-ink">{config.event_name}</div>
          <div className="mt-1.5">{config.event_date}</div>
          <div>{config.event_place}</div>
        </div>
        <div>
          <div className="gc-label text-gc-ink">Вход</div>
          <div className="mt-1.5">Evolution Managed Identities · OpenID Connect</div>
          <div>
            Authorization Code + PKCE{isConfidential ? ' (confidential client)' : ''} · {issuerHost()}
          </div>
        </div>
        <div>
          <div className="gc-label text-gc-ink">Демо-приложение</div>
          <div className="mt-1.5">
            Версия {APP_VERSION} от {BUILD_DATE}. Данные тестовые.
          </div>
          <div>Бейдж собирается из ID-токена при каждом входе и нигде не хранится.</div>
        </div>
      </div>
    </footer>
  );
}

interface NavItem {
  to: string;
  label: string;
}

function navFor(roles: string[]): NavItem[] {
  const items: NavItem[] = [];
  if (hasRole(roles, 'courier')) items.push({ to: '/courier', label: 'Бейдж спикера' });
  if (hasRole(roles, 'supervisor')) items.push({ to: '/supervisor', label: 'Стойка регистрации' });
  if (isDefaultRole(roles)) items.push({ to: '/cabinet', label: 'Бейдж участника' });
  items.push({ to: '/badge', label: 'Что зашито в бейдж' });
  return items;
}

function UserBlock() {
  const auth = useAuth();
  const logout = useLogout();
  const roles = extractRoles(auth.user);
  const profile = userProfile(auth.user);
  return (
    <>
      <div className="hidden min-w-0 text-right sm:block">
        <div className="truncate text-sm font-extrabold leading-tight text-gc-ink">{profile.fullName}</div>
        <div className="mt-1 flex justify-end gap-1">
          {lanesForRoles(roles).map((lane) => (
            <LaneChip key={lane} lane={lane} />
          ))}
        </div>
      </div>
      <button onClick={logout} className="gc-btn-outline !px-4 !py-2">
        Выйти
      </button>
    </>
  );
}

/** Authenticated page frame: header with the user block, role tabs, title, footer. */
export function Shell({
  eyebrow,
  title,
  description,
  toolbar,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const auth = useAuth();
  const roles = extractRoles(auth.user);

  useEffect(() => {
    document.title = `${title} — ${config.event_name}`;
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col bg-gc-paper font-gocloud text-gc-ink">
      <TopBar right={<UserBlock />} />

      <nav className="border-b border-gc-line bg-white" aria-label="Разделы">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {navFor(roles).map((item) => (
            <li key={item.to} className="shrink-0">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block border-b-[3px] px-3 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] ${
                    isActive ? 'border-gc-green text-gc-ink' : 'border-transparent text-gc-muted hover:text-gc-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {eyebrow && <div className="gc-label text-gc-greenDark">{eyebrow}</div>}
            <h1 className="gc-h mt-1 text-3xl sm:text-4xl">{title}</h1>
            {description && <p className="mt-2 max-w-2xl text-sm text-gc-muted">{description}</p>}
          </div>
          {toolbar}
        </div>
        <div className="mt-8">{children}</div>
      </main>

      <Footer />
    </div>
  );
}

/** Inline notice (status line) used on role pages. */
export function Notice({ tone = 'green', children }: { tone?: 'green' | 'ink'; children: ReactNode }) {
  return (
    <div
      role="status"
      className={`mb-6 flex items-start gap-3 border px-4 py-3 text-sm ${
        tone === 'green' ? 'border-gc-green bg-gc-greenPale text-gc-ink' : 'border-gc-ink bg-white text-gc-ink'
      }`}
    >
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 ${tone === 'green' ? 'bg-gc-green' : 'bg-gc-ink'}`} aria-hidden />
      <div>{children}</div>
    </div>
  );
}
