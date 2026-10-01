import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Shell, Notice, LaneChip } from '../components/Shell';
import { Badge } from '../components/Badge';
import { PageTransition } from '../../../components/PageTransition';
import { consumeJustLoggedIn } from '../../../auth/loginFlag';
import { userProfile } from '../../../auth/profile';
import { ensureRegistered } from '../../../auth/registration';
import { badgeOrg } from '../brand';
import { program } from '../data/program';

/** ISO `yyyy-mm-dd` (OIDC `birthdate`) → `dd.mm.yyyy`; anything else is shown as is. */
const fmtDate = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('.') : (d ?? '—'));
const fmtDateTime = (ts: number) => new Date(ts).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' });

function Verified({ ok }: { ok?: boolean }) {
  if (ok === undefined) return null;
  return ok ? (
    <span className="gc-chip bg-gc-green text-gc-ink">подтверждён</span>
  ) : (
    <span className="gc-chip border border-gc-amber text-gc-amber">не подтверждён</span>
  );
}

/**
 * Home of the implicit role: an attendee without courier/supervisor. The
 * "account" is provisioned on the fly from the token — no form to fill in.
 */
export function AttendeePage() {
  const auth = useAuth();
  const profile = userProfile(auth.user);
  const org = badgeOrg(auth.user);
  const [reg] = useState(() => ensureRegistered(profile.sub));
  const [assembling] = useState(() => consumeJustLoggedIn());
  const [mine, setMine] = useState<string[]>(['T-04', 'T-07']);

  const toggle = (id: string) => setMine((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  const rows: [string, ReactNode][] = [
    ['Имя на бейдже', profile.fullName],
    ['Вторая строка', org ?? '—'],
    ['Лента', <LaneChip lane="attendee">Участник · без роли</LaneChip>],
    [
      'Электронная почта',
      <span className="flex flex-wrap items-center gap-2">
        {profile.email ?? '—'} <Verified ok={profile.email ? profile.emailVerified : undefined} />
      </span>,
    ],
    [
      'Телефон',
      <span className="flex flex-wrap items-center gap-2">
        {profile.phone ?? '—'} <Verified ok={profile.phone ? profile.phoneVerified : undefined} />
      </span>,
    ],
    ['Дата рождения', fmtDate(profile.birthdate)],
    [
      'Откуда данные',
      profile.identityProvider
        ? `${profile.identityProvider} через Evolution Managed Identities`
        : 'Evolution Managed Identities (ID-токен)',
    ],
    ['Учётная запись создана', fmtDateTime(reg.registeredAt)],
    ['Идентификатор (sub)', <code className="font-gcmono text-xs">{profile.sub ?? '—'}</code>],
  ];

  return (
    <PageTransition>
      <Shell
        eyebrow="Без явной роли"
        title="Бейдж участника"
        description="В токене нет ролей courier и supervisor — это обычный участник. Учётная запись создана при первом входе из данных токена."
      >
        {(reg.isNew || assembling) && (
          <Notice>
            <b>Бейдж собран.</b> Учётная запись создана автоматически из клеймов ID-токена, анкету заполнять не
            нужно.
          </Notice>
        )}

        <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
          <div className="justify-self-center lg:justify-self-start">
            <Badge
              lane="attendee"
              name={profile.fullName}
              org={org}
              note={profile.username && profile.username !== org ? profile.username : undefined}
              qrSeed={profile.sub ?? profile.fullName}
              assembling={assembling}
            />
          </div>

          <div className="space-y-6">
            <section className="gc-card p-5">
              <h2 className="gc-h text-lg">Что на бейдже</h2>
              <p className="mt-1 text-xs text-gc-muted">Сведения получены из токена при входе и в приложении не редактируются.</p>
              <dl className="gc-kv mt-4">
                {rows.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/badge" className="gc-btn-link mt-5">
                Все claims токена →
              </Link>
            </section>

            <section className="gc-card">
              <div className="flex items-center justify-between border-b border-gc-line px-5 py-3">
                <h2 className="gc-h text-lg">Моё расписание</h2>
                <span className="text-xs text-gc-muted">выбрано: {mine.length}</span>
              </div>
              <ul className="divide-y divide-gc-line">
                {program.map((t) => {
                  const on = mine.includes(t.id);
                  return (
                    <li key={t.id} className="grid gap-2 px-5 py-3 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                      <div>
                        <div className="font-extrabold tabular-nums">{t.time}</div>
                        <div className="text-xs text-gc-muted">{t.hall}</div>
                      </div>
                      <div>
                        <div className={`text-sm ${on ? 'font-bold' : ''}`}>{t.title}</div>
                        <div className="mt-0.5 text-xs text-gc-muted">
                          Трек «{t.track}» · {t.speaker}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(t.id)}
                        className={`${on ? 'gc-btn-green' : 'gc-btn-outline'} !px-3 !py-1.5 !text-[10px]`}
                        aria-pressed={on}
                      >
                        {on ? 'В расписании' : 'Добавить'}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </div>
      </Shell>
    </PageTransition>
  );
}
