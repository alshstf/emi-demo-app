import { useState } from 'react';
import { decodeJwtPayload } from '../../../auth/profile';
import { useAuth } from 'react-oidc-context';
import { Shell, ROLE_LABEL, DEFAULT_ROLE_LABEL } from '../components/Shell';
import { StatusBadge } from '../components/StatusBadge';
import { PageTransition } from '../../../components/PageTransition';
import { config, isConfidential } from '../../../config';
import { extractRoles, isDefaultRole, rolesSourceDescription } from '../../../auth/roles';
import { userProfile } from '../../../auth/profile';

function fmt(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'medium' });
}

/**
 * «Сведения о сеансе» — what the identity service told us about the user.
 * The most useful screen for an IdP demo: who signed in, via which issuer,
 * with which roles and until when.
 */
export function SessionPage() {
  const auth = useAuth();
  const user = auth.user;
  const p = (user?.profile ?? {}) as Record<string, unknown>;
  const roles = extractRoles(user);
  const access = user?.access_token ? decodeJwtPayload(user.access_token) : null;
  const profile = userProfile(user);
  const [tab, setTab] = useState<'id' | 'access'>('id');

  const rows: [string, React.ReactNode][] = [
    ['Пользователь', profile.fullName],
    ['Логин', profile.username || profile.email || '—'],
    ['Электронная почта', profile.email ? `${profile.email}${profile.emailVerified === true ? ' (подтверждена)' : ''}` : '—'],
    ['Телефон', profile.phone ? `${profile.phone}${profile.phoneVerified === true ? ' (подтверждён)' : ''}` : '—'],
    ['Идентификатор (sub)', <code className="text-xs">{profile.sub || '—'}</code>],
    [
      'Полномочия (роли)',
      <span className="flex flex-wrap gap-1">
        {isDefaultRole(roles) && <StatusBadge tone="info">{DEFAULT_ROLE_LABEL} (роль по умолчанию)</StatusBadge>}
        {roles.map((r) => (
          <StatusBadge key={r} tone={r in ROLE_LABEL ? 'info' : 'neutral'}>
            {ROLE_LABEL[r] ? `${ROLE_LABEL[r]} (${r})` : r}
          </StatusBadge>
        ))}
      </span>,
    ],
    ['Источник ролей', <code className="text-xs">{rolesSourceDescription()}</code>],
    ['Сервис идентификации (issuer)', <code className="text-xs">{(p.iss as string) || config.authority}</code>],
    ['Идентификатор приложения (client_id)', <code className="text-xs">{config.client_id}</code>],
    ['Тип клиента', isConfidential ? 'confidential (client_secret)' : 'public (PKCE)'],
    ['Протокол', 'OpenID Connect, Authorization Code Flow' + (isConfidential ? '' : ' + PKCE')],
    ['Запрошенные scope', <code className="text-xs">{config.scope}</code>],
    ['Токен выдан', fmt(p.iat as number)],
    ['Сеанс действителен до', fmt(user?.expires_at)],
    ['Back-channel через прокси', config.proxy ? 'да (/oidc/)' : 'нет (прямые запросы к IdP)'],
  ];

  const claims = tab === 'id' ? p : access;

  return (
    <PageTransition>
      <Shell
        section="Личный кабинет"
        title="Сведения о сеансе"
        description="Данные учётной записи, полученные от сервиса идентификации при входе."
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="gis-card p-5">
            <h2 className="text-base font-semibold text-gis-navy">Учётная запись и подключение</h2>
            <dl className="gis-kv mt-4">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="gis-card flex flex-col p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-semibold text-gis-navy">Состав токена (claims)</h2>
              <div className="flex rounded border border-gis-line text-xs">
                {(['id', 'access'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 font-medium ${tab === t ? 'bg-gis-blue text-white' : 'text-gis-muted hover:text-gis-ink'}`}
                  >
                    {t === 'id' ? 'ID-токен' : 'Access-токен'}
                  </button>
                ))}
              </div>
            </div>
            <pre className="mt-4 max-h-[480px] flex-1 overflow-auto rounded border border-gis-line bg-gis-surface p-3 text-xs leading-relaxed text-gis-ink">
              {claims ? JSON.stringify(claims, null, 2) : 'токен недоступен или не является JWT'}
            </pre>
          </section>
        </div>
      </Shell>
    </PageTransition>
  );
}
