import { useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Emblem } from './Emblem';
import { StatusBadge } from './StatusBadge';
import { useA11y } from '../a11y';
import { config } from '../../../config';
import { extractRoles, hasRole, isDefaultRole } from '../../../auth/roles';
import { userProfile } from '../../../auth/profile';
import { useLogout } from '../../../auth/useLogout';

export const ROLE_LABEL: Record<string, string> = { courier: 'Специалист', supervisor: 'Руководитель' };
export const DEFAULT_ROLE_LABEL = 'Гражданин';

export const SUPPORT_PHONE = '8 (800) 000-00-00';
export const SUPPORT_EMAIL = 'support@gis.example';
export const APP_VERSION = '1.0.0';
const BUILD_DATE = '07.09.2026';

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M2 10 C4.5 5.5 7 4 10 4 s5.5 1.5 8 6 c-2.5 4.5-5 6-8 6 s-5.5-1.5-8-6Z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}

/** Thin dark strip on top of every page: operator, support, accessibility. */
export function TopStrip() {
  const [a11y, toggle] = useA11y();
  return (
    <div className="bg-gis-navy text-xs text-white/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-1.5 sm:px-6">
        <span className="truncate">{config.gis_operator}</span>
        <span className="hidden sm:inline">Техническая поддержка: {SUPPORT_PHONE}</span>
        <button type="button" onClick={toggle} className="ml-auto inline-flex items-center gap-1.5 hover:text-white" aria-pressed={a11y}>
          <EyeIcon />
          {a11y ? 'Обычная версия' : 'Версия для слабовидящих'}
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gis-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-xs text-gis-muted sm:px-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-gis-ink">{config.gis_name}</div>
          <div className="mt-1">{config.gis_full_name}</div>
          <div className="mt-1">{config.gis_operator}</div>
          <div className="mt-2">© 2026. При использовании материалов ссылка на систему обязательна.</div>
        </div>
        <div>
          <div className="font-semibold text-gis-ink">Техническая поддержка</div>
          <div className="mt-1">{SUPPORT_PHONE} (круглосуточно, звонок бесплатный)</div>
          <div>{SUPPORT_EMAIL}</div>
          <div className="mt-2">Политика обработки персональных данных · Правовая информация</div>
        </div>
        <div>
          <div className="font-semibold text-gis-ink">Сведения о системе</div>
          <div className="mt-1">
            Версия {APP_VERSION} от {BUILD_DATE}
          </div>
          <div>Аутентификация: Evolution Managed Identities (OpenID Connect)</div>
          <div className="mt-2">Демонстрационная версия. Данные являются тестовыми.</div>
        </div>
      </div>
    </footer>
  );
}

interface NavItem {
  to: string;
  label: string;
  group: string;
}

function navFor(roles: string[]): NavItem[] {
  const items: NavItem[] = [];
  if (isDefaultRole(roles)) items.push({ to: '/cabinet', label: 'Личный кабинет', group: 'Гражданин' });
  if (hasRole(roles, 'courier')) items.push({ to: '/courier', label: 'Реестр заявлений', group: 'Рабочее место' });
  if (hasRole(roles, 'supervisor')) items.push({ to: '/supervisor', label: 'Мониторинг исполнения', group: 'Рабочее место' });
  items.push({ to: '/session', label: 'Сведения о сеансе', group: 'Учётная запись' });
  return items;
}

function Sidebar({ roles }: { roles: string[] }) {
  const items = navFor(roles);
  const groups = [...new Set(items.map((i) => i.group))];
  return (
    <aside className="lg:w-60 lg:shrink-0" aria-label="Разделы">
      <nav className="gis-card overflow-hidden">
        {groups.map((g) => (
          <div key={g} className="border-b border-gis-line last:border-b-0">
            <div className="hidden px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-gis-muted lg:block">{g}</div>
            <ul className="flex overflow-x-auto lg:block lg:pb-2">
              {items
                .filter((i) => i.group === g)
                .map((item) => (
                  <li key={item.to} className="shrink-0">
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block whitespace-nowrap border-l-[3px] px-4 py-2 text-sm ${
                          isActive
                            ? 'border-gis-blue bg-gis-blueLight font-semibold text-gis-blueDark'
                            : 'border-transparent text-gis-ink hover:bg-gis-surface'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

/** Authenticated page frame: strip + header with the user block + left sidebar + footer. */
export function Shell({
  section,
  title,
  description,
  toolbar,
  children,
}: {
  section?: string;
  title: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const auth = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const roles = extractRoles(auth.user);
  const profile = userProfile(auth.user);
  const name = profile.fullName;

  // Browser-tab title follows the section, as in any registry system.
  useEffect(() => {
    document.title = `${title} — ${config.gis_name}`;
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col bg-gis-surface font-gis text-gis-ink">
      <TopStrip />

      <header className="border-b border-gis-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 text-left">
            <Emblem className="h-11 w-10 shrink-0" />
            <span>
              <span className="block text-sm font-bold uppercase leading-tight tracking-wide text-gis-navy">{config.gis_name}</span>
              <span className="mt-0.5 block max-w-md text-xs leading-tight text-gis-muted">{config.gis_full_name}</span>
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold leading-tight text-gis-ink">{name}</div>
              {(profile.email || profile.phone) && (
                <div className="text-xs text-gis-muted">{[profile.email, profile.phone].filter(Boolean).join(' · ')}</div>
              )}
              <div className="mt-1 flex justify-end gap-1">
                {isDefaultRole(roles) && <StatusBadge tone="info">{DEFAULT_ROLE_LABEL}</StatusBadge>}
                {roles
                  .filter((r) => r in ROLE_LABEL)
                  .map((r) => (
                    <StatusBadge key={r} tone="info">
                      {ROLE_LABEL[r]}
                    </StatusBadge>
                  ))}
              </div>
            </div>
            <button onClick={logout} className="gis-btn-secondary !px-4 !py-2">
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <Sidebar roles={roles} />

        <main className="min-w-0 flex-1">
          <nav className="text-xs text-gis-muted" aria-label="Навигация">
            <ol className="flex flex-wrap gap-1">
              <li>Главная</li>
              {section && (
                <>
                  <li aria-hidden>/</li>
                  <li>{section}</li>
                </>
              )}
              <li aria-hidden>/</li>
              <li className="text-gis-ink">{title}</li>
            </ol>
          </nav>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gis-navy">{title}</h1>
              {description && <p className="mt-1 text-sm text-gis-muted">{description}</p>}
            </div>
            {toolbar}
          </div>

          <div className="mt-5">{children}</div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
