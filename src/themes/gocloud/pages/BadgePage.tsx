import { useState, type ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';
import { Shell, LaneChip } from '../components/Shell';
import { PageTransition } from '../../../components/PageTransition';
import { config, isConfidential } from '../../../config';
import { decodeJwtPayload, userProfile } from '../../../auth/profile';
import { extractRoles, rolesSourceDescription } from '../../../auth/roles';
import { lanesForRoles, ROLE_LABEL } from '../brand';

function fmt(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'medium' });
}

/**
 * «Что зашито в бейдж» — everything the identity service said about the user:
 * who signed in, via which issuer, with which roles and until when, plus the
 * raw ID- and access-token claims. The badge is assembled from nothing else.
 */
export function BadgePage() {
  const auth = useAuth();
  const user = auth.user;
  const p = (user?.profile ?? {}) as Record<string, unknown>;
  const roles = extractRoles(user);
  const access = user?.access_token ? decodeJwtPayload(user.access_token) : null;
  const profile = userProfile(user);
  const [tab, setTab] = useState<'id' | 'access'>('id');

  const known = roles.filter((r): r is keyof typeof ROLE_LABEL => r in ROLE_LABEL);
  const other = roles.filter((r) => !(r in ROLE_LABEL));

  const rows: [string, ReactNode][] = [
    ['Имя', profile.fullName],
    ['Логин', profile.username || profile.email || '—'],
    ['Электронная почта', profile.email ? `${profile.email}${profile.emailVerified === true ? ' (подтверждена)' : ''}` : '—'],
    ['Телефон', profile.phone ? `${profile.phone}${profile.phoneVerified === true ? ' (подтверждён)' : ''}` : '—'],
    ['Идентификатор (sub)', <code className="font-gcmono text-xs">{profile.sub || '—'}</code>],
    [
      'Лента (роли)',
      <span className="flex flex-wrap gap-1">
        {lanesForRoles(roles).map((lane) => (
          <LaneChip key={lane} lane={lane} />
        ))}
        {known.map((r) => (
          <span key={r} className="gc-chip border border-gc-line text-gc-muted">
            {r}
          </span>
        ))}
        {other.map((r) => (
          <span key={r} className="gc-chip border border-gc-line text-gc-muted">
            {r}
          </span>
        ))}
      </span>,
    ],
    ['Откуда роли', <code className="font-gcmono text-xs">{rolesSourceDescription()}</code>],
    ['Сервис идентификации (issuer)', <code className="font-gcmono text-xs">{(p.iss as string) || config.authority}</code>],
    ['client_id', <code className="font-gcmono text-xs">{config.client_id}</code>],
    ['Тип клиента', isConfidential ? 'confidential (client_secret)' : 'public (PKCE)'],
    ['Протокол', 'OpenID Connect, Authorization Code Flow' + (isConfidential ? '' : ' + PKCE')],
    ['Запрошенные scope', <code className="font-gcmono text-xs">{config.scope}</code>],
    ['Токен выдан', fmt(p.iat as number)],
    ['Сеанс действителен до', fmt(user?.expires_at)],
    ['Back-channel через прокси', config.proxy ? 'да (/oidc/)' : 'нет (прямые запросы к IdP)'],
  ];

  const claims = tab === 'id' ? p : access;

  return (
    <PageTransition>
      <Shell
        eyebrow="ID-токен и access-токен"
        title="Что зашито в бейдж"
        description="Всё, что сервис идентификации сообщил о вас при входе. Бейдж собран только из этих данных."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="gc-card p-5">
            <h2 className="gc-h text-lg">Учётная запись и подключение</h2>
            <dl className="gc-kv mt-4">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="gc-card flex flex-col p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="gc-h text-lg">Состав токена (claims)</h2>
              <div className="flex text-[11px] font-extrabold uppercase tracking-[0.1em]">
                {(['id', 'access'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 ${tab === t ? 'bg-gc-ink text-white' : 'border border-gc-line text-gc-muted hover:text-gc-ink'}`}
                    aria-pressed={tab === t}
                  >
                    {t === 'id' ? 'ID-токен' : 'Access-токен'}
                  </button>
                ))}
              </div>
            </div>
            <pre className="gc-pre mt-4 max-h-[520px] flex-1 overflow-auto">
              {claims ? JSON.stringify(claims, null, 2) : 'токен недоступен или не является JWT'}
            </pre>
          </section>
        </div>
      </Shell>
    </PageTransition>
  );
}
