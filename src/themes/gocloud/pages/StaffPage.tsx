import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Shell, Notice, LaneChip } from '../components/Shell';
import { Badge } from '../components/Badge';
import { PageTransition } from '../../../components/PageTransition';
import { consumeJustLoggedIn } from '../../../auth/loginFlag';
import { userProfile } from '../../../auth/profile';
import { badgeOrg } from '../brand';
import { deskQueue, deskStats, type DeskEntry, type DeskStatus } from '../data/desk';

const FILTERS: ('all' | DeskStatus)[] = ['all', 'ожидает', 'бейдж собран', 'чек-ин'];

function StatusChip({ status }: { status: DeskStatus }) {
  const cls =
    status === 'чек-ин'
      ? 'bg-gc-ink text-white'
      : status === 'бейдж собран'
        ? 'bg-gc-green text-gc-ink'
        : 'border border-gc-grey text-gc-muted';
  return <span className={`gc-chip ${cls}`}>{status}</span>;
}

/** Home of the `supervisor` role: the registration desk — queue, badge assembly, check-in. */
export function StaffPage() {
  const auth = useAuth();
  const profile = userProfile(auth.user);
  const org = badgeOrg(auth.user);
  const [assembling] = useState(() => consumeJustLoggedIn());
  const [notice, setNotice] = useState(assembling);
  const [queue, setQueue] = useState<DeskEntry[]>(deskQueue);
  const [filter, setFilter] = useState<'all' | DeskStatus>('all');

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(false), 8000);
    return () => clearTimeout(t);
  }, [notice]);

  const setStatus = (id: number, status: DeskStatus) =>
    setQueue((q) => q.map((e) => (e.id === id ? { ...e, status } : e)));

  const visible = filter === 'all' ? queue : queue.filter((e) => e.status === filter);
  const waiting = queue.filter((e) => e.status === 'ожидает').length;
  const assembled = deskStats.assembled + queue.filter((e) => e.status !== 'ожидает').length;

  return (
    <PageTransition>
      <Shell
        eyebrow="Роль supervisor"
        title="Стойка регистрации"
        description="Очередь на сборку бейджей и чек-ин. Раздел доступен только учётным записям с ролью supervisor."
      >
        {notice && (
          <Notice tone="ink">
            <b>Бейдж собран.</b> Чёрная лента: роль supervisor пришла в ID-токене, стойка регистрации открыта.
          </Notice>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:gap-14">
          <div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="gc-stat">
                <b>{assembled}</b>
                <span>бейджей собрано из {deskStats.registered}</span>
              </div>
              <div className="gc-stat">
                <b>{deskStats.checkedInLastHour}</b>
                <span>чек-ин за последний час</span>
              </div>
              <div className="gc-stat">
                <b>{deskStats.speakersOnSite}</b>
                <span>спикеров на площадке из {deskStats.speakersTotal}</span>
              </div>
            </div>

            <section className="gc-card mt-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gc-line px-5 py-3">
                <h2 className="gc-h text-lg">
                  Очередь на стойке <span className="text-gc-grey">· {waiting}</span>
                </h2>
                <div className="flex flex-wrap gap-1 text-[11px] font-extrabold uppercase tracking-[0.1em]">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={`px-2.5 py-1 ${filter === f ? 'bg-gc-ink text-white' : 'text-gc-muted hover:text-gc-ink'}`}
                      aria-pressed={filter === f}
                    >
                      {f === 'all' ? 'Все' : f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="gc-table">
                  <thead>
                    <tr>
                      <th>№</th>
                      <th>Участник</th>
                      <th>Компания</th>
                      <th>Лента</th>
                      <th>В очереди с</th>
                      <th>Статус</th>
                      <th>
                        <span className="sr-only">Действие</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((e) => (
                      <tr key={e.id}>
                        <td className="font-gcmono text-xs text-gc-muted">{String(e.id).padStart(2, '0')}</td>
                        <td className="whitespace-nowrap font-bold">{e.name}</td>
                        <td>{e.company}</td>
                        <td>
                          <LaneChip lane={e.lane} />
                        </td>
                        <td className="tabular-nums">{e.since}</td>
                        <td>
                          <StatusChip status={e.status} />
                        </td>
                        <td className="whitespace-nowrap text-right">
                          {e.status === 'ожидает' && (
                            <button className="gc-btn-green !px-3 !py-1.5 !text-[10px]" onClick={() => setStatus(e.id, 'бейдж собран')}>
                              Собрать бейдж
                            </button>
                          )}
                          {e.status === 'бейдж собран' && (
                            <button className="gc-btn-outline !px-3 !py-1.5 !text-[10px]" onClick={() => setStatus(e.id, 'чек-ин')}>
                              Чек-ин
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {visible.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-sm text-gc-muted">
                          В этом статусе никого нет.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-gc-line px-5 py-3 text-xs text-gc-muted">
                Тестовые данные. Действия меняют состояние только на этой странице.
              </p>
            </section>
          </div>

          <aside className="justify-self-center lg:justify-self-start">
            <div className="gc-label mb-2">Ваш бейдж</div>
            <Badge
              lane="staff"
              name={profile.fullName}
              org={org}
              note={profile.username && profile.username !== org ? profile.username : undefined}
              footer={['Стойка регистрации', 'Сбор гостей с 10:00']}
              qrSeed={profile.sub ?? profile.fullName}
              assembling={assembling}
            />
          </aside>
        </div>
      </Shell>
    </PageTransition>
  );
}
