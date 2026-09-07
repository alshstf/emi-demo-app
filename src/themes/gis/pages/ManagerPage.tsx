import { useEffect, useState } from 'react';
import { Shell } from '../components/Shell';
import { StatusBadge, type Tone } from '../components/StatusBadge';
import { PageTransition } from '../../../components/PageTransition';
import { consumeJustLoggedIn } from '../../../auth/loginFlag';
import { staff, dailyPlan } from '../data/staff';
import { applications, daysLeft, isOverdue, today, type ApplicationStatus } from '../data/applications';

const STATUS_ORDER: { status: ApplicationStatus; color: string; tone: Tone }[] = [
  { status: 'Зарегистрировано', color: 'bg-gis-blue', tone: 'info' },
  { status: 'На рассмотрении', color: 'bg-gis-amber', tone: 'warning' },
  { status: 'Требует уточнения', color: 'bg-gis-red', tone: 'danger' },
  { status: 'Исполнено', color: 'bg-gis-green', tone: 'success' },
];

function Tile({ value, label, hint, accent = 'text-gis-navy' }: { value: string | number; label: string; hint?: string; accent?: string }) {
  return (
    <div className="gis-card px-5 py-4">
      <div className="gis-label">{label}</div>
      <div className={`mt-2 text-3xl font-bold leading-none ${accent}`}>{value}</div>
      {hint && <div className="mt-2 text-xs text-gis-muted">{hint}</div>}
    </div>
  );
}

/** Home screen of the `supervisor` role: execution monitoring across the unit. */
export function ManagerPage() {
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    if (consumeJustLoggedIn()) {
      setNotice('Вход выполнен. Полномочия учётной записи подтверждены сервисом идентификации.');
      const t = setTimeout(() => setNotice(null), 6000);
      return () => clearTimeout(t);
    }
  }, []);

  const inProgress = staff.reduce((s, m) => s + m.inProgress, 0);
  const doneToday = staff.reduce((s, m) => s + m.doneToday, 0);
  const onTime = Math.round(staff.reduce((s, m) => s + m.onTimePct, 0) / staff.length);
  const present = staff.filter((m) => m.present).length;

  const byStatus = STATUS_ORDER.map((s) => ({ ...s, count: applications.filter((a) => a.status === s.status).length }));
  const attention = applications
    .filter((a) => a.status !== 'Исполнено' && (isOverdue(a) || daysLeft(a) <= 2 || a.status === 'Требует уточнения'))
    .sort((a, b) => daysLeft(a) - daysLeft(b));
  const overdue = applications.filter(isOverdue).length;
  const staffName = (id: string) => staff.find((m) => m.id === id)?.name ?? id;

  return (
    <PageTransition>
      <Shell
        section="Личный кабинет руководителя"
        title="Мониторинг исполнения"
        description={`Сводные показатели подразделения и нагрузка исполнителей. Данные на ${today}.`}
        toolbar={
          <button className="gis-btn-secondary !py-2" type="button">
            Сформировать отчёт
          </button>
        }
      >
        {notice && (
          <div className="mb-4 rounded border border-gis-green/30 bg-gis-greenLight px-4 py-3 text-sm text-gis-green" role="status">
            {notice}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile value={inProgress} label="Заявлений в работе" hint={`${present} из ${staff.length} исполнителей на рабочем месте`} />
          <Tile value={doneToday} label="Исполнено сегодня" hint={`план подразделения — ${dailyPlan * staff.length}`} accent="text-gis-green" />
          <Tile value={overdue} label="Просрочено" hint="требуют контроля руководителя" accent={overdue ? 'text-gis-red' : 'text-gis-navy'} />
          <Tile value={`${onTime}%`} label="Исполнено в срок" hint="среднее по подразделению" />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.4fr]">
          <section className="gis-card p-5">
            <h2 className="text-base font-semibold text-gis-navy">Заявления по статусам</h2>
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-sm bg-gis-surface2" role="img" aria-label="Распределение заявлений по статусам">
              {byStatus.map((s) => (
                <div key={s.status} className={s.color} style={{ width: `${(s.count / applications.length) * 100}%` }} title={`${s.status}: ${s.count}`} />
              ))}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {byStatus.map((s) => (
                <li key={s.status} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2">
                    <span className={`inline-block h-2.5 w-2.5 rounded-sm ${s.color}`} aria-hidden />
                    {s.status}
                  </span>
                  <span className="tabular-nums text-gis-muted">{s.count}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="gis-card">
            <div className="flex items-center justify-between border-b border-gis-line px-4 py-3">
              <h2 className="text-base font-semibold text-gis-navy">Требуют внимания</h2>
              <span className="text-xs text-gis-muted">просрочено, истекает срок, требует уточнения</span>
            </div>
            <div className="overflow-x-auto">
              <table className="gis-table">
                <thead>
                  <tr>
                    <th>Рег. номер</th>
                    <th>Заявитель</th>
                    <th>Срок</th>
                    <th>Исполнитель</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {attention.map((a) => {
                    const left = daysLeft(a);
                    return (
                      <tr key={a.regNo}>
                        <td className="whitespace-nowrap font-mono text-xs font-semibold text-gis-blue">{a.regNo}</td>
                        <td>{a.applicant}</td>
                        <td className={`whitespace-nowrap ${left < 0 ? 'font-semibold text-gis-red' : left <= 2 ? 'text-gis-amber' : ''}`}>
                          {a.dueAt}
                          <span className="block text-xs font-normal">{left < 0 ? `просрочено на ${-left} дн.` : `осталось ${left} дн.`}</span>
                        </td>
                        <td className="text-xs">{staffName(a.assignee)}</td>
                        <td>
                          <StatusBadge tone={STATUS_ORDER.find((s) => s.status === a.status)!.tone}>{a.status}</StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="gis-card mt-6">
          <div className="flex items-center justify-between border-b border-gis-line px-4 py-3">
            <h2 className="text-base font-semibold text-gis-navy">Исполнители</h2>
            <span className="text-xs text-gis-muted">Плановая нагрузка: {dailyPlan} заявлений в день</span>
          </div>
          <div className="overflow-x-auto">
            <table className="gis-table">
              <thead>
                <tr>
                  <th>Сотрудник</th>
                  <th>Подразделение</th>
                  <th className="text-right">В работе</th>
                  <th>Исполнено сегодня</th>
                  <th className="text-right">В срок</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((m) => {
                  const pct = Math.min(100, Math.round((m.doneToday / dailyPlan) * 100));
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-gis-muted">{m.position}</div>
                      </td>
                      <td>{m.department}</td>
                      <td className="text-right tabular-nums">{m.inProgress}</td>
                      <td className="min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-sm bg-gis-surface2">
                            <div className={`h-full ${pct >= 75 ? 'bg-gis-blue' : pct >= 40 ? 'bg-gis-amber' : 'bg-gis-red'}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-14 text-right text-xs tabular-nums text-gis-muted">
                            {m.doneToday} / {dailyPlan}
                          </span>
                        </div>
                      </td>
                      <td className={`text-right tabular-nums ${m.onTimePct < 90 ? 'font-semibold text-gis-amber' : ''}`}>{m.onTimePct}%</td>
                      <td>
                        <StatusBadge tone={m.present ? 'success' : 'neutral'}>{m.present ? 'На рабочем месте' : 'Отсутствует'}</StatusBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Shell>
    </PageTransition>
  );
}
