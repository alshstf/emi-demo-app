import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Shell, Notice, LaneChip } from '../components/Shell';
import { Badge } from '../components/Badge';
import { PageTransition } from '../../../components/PageTransition';
import { consumeJustLoggedIn } from '../../../auth/loginFlag';
import { userProfile } from '../../../auth/profile';
import { badgeOrg } from '../brand';
import { program, MY_TALK_IDS } from '../data/program';

/** Home of the `courier` role: the speaker's badge (green lane) and their talks. */
export function SpeakerPage() {
  const auth = useAuth();
  const profile = userProfile(auth.user);
  const org = badgeOrg(auth.user);
  const [assembling] = useState(() => consumeJustLoggedIn());
  const [notice, setNotice] = useState(assembling);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(false), 8000);
    return () => clearTimeout(t);
  }, [notice]);

  const talks = program.filter((t) => MY_TALK_IDS.includes(t.id));
  const next = talks[0];

  const rows: [string, ReactNode][] = [
    ['Имя на бейдже', profile.fullName],
    ['Вторая строка', org ?? '—'],
    ['Лента', <LaneChip lane="speaker">Спикер · courier</LaneChip>],
    ['Логин', profile.username ?? '—'],
    ['Идентификатор (sub)', <code className="font-gcmono text-xs">{profile.sub ?? '—'}</code>],
  ];

  return (
    <PageTransition>
      <Shell
        eyebrow="Роль courier"
        title="Бейдж спикера"
        description="Собран из ID-токена при входе. Зелёная лента — у учётной записи есть роль courier."
      >
        {notice && (
          <Notice>
            <b>Бейдж собран.</b> Имя и роль пришли в ID-токене от Evolution Managed Identities, анкету заполнять не
            нужно.
          </Notice>
        )}

        <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
          <div className="justify-self-center lg:justify-self-start">
            <Badge
              lane="speaker"
              name={profile.fullName}
              org={org}
              note={profile.username && profile.username !== org ? profile.username : undefined}
              footer={next ? [`${next.time} · ${next.hall}`, `Трек «${next.track}»`] : undefined}
              qrSeed={profile.sub ?? profile.fullName}
              assembling={assembling}
            />
          </div>

          <div className="space-y-6">
            <section className="gc-card p-5">
              <h2 className="gc-h text-lg">Что на бейдже</h2>
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
                <h2 className="gc-h text-lg">Мои доклады</h2>
                <span className="text-xs text-gc-muted">{talks.length}</span>
              </div>
              <ul className="divide-y divide-gc-line">
                {talks.map((t) => (
                  <li key={t.id} className="grid gap-2 px-5 py-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                    <div>
                      <div className="text-lg font-extrabold tabular-nums">{t.time}</div>
                      <div className="text-xs text-gc-muted">{t.hall}</div>
                    </div>
                    <div>
                      <div className="font-bold">{t.title}</div>
                      <div className="mt-0.5 text-xs text-gc-muted">Трек «{t.track}»</div>
                    </div>
                    <LaneChip lane="speaker">подтверждён</LaneChip>
                  </li>
                ))}
              </ul>
              <p className="border-t border-gc-line px-5 py-3 text-xs text-gc-muted">
                Тестовые данные: доклады привязаны к роли спикера, а не к конкретной учётной записи.
              </p>
            </section>
          </div>
        </div>
      </Shell>
    </PageTransition>
  );
}
