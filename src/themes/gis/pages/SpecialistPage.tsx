import { useEffect, useMemo, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Shell } from '../components/Shell';
import { StatusBadge, type Tone } from '../components/StatusBadge';
import { PageTransition } from '../../../components/PageTransition';
import { consumeJustLoggedIn } from '../../../auth/loginFlag';
import { applications, daysLeft, isOverdue, today, type Application, type ApplicationStatus } from '../data/applications';

const STATUS_TONE: Record<ApplicationStatus, Tone> = {
  Зарегистрировано: 'info',
  'На рассмотрении': 'warning',
  'Требует уточнения': 'danger',
  Исполнено: 'success',
};

const STATUSES: ApplicationStatus[] = ['Зарегистрировано', 'На рассмотрении', 'Требует уточнения', 'Исполнено'];

function Deadline({ a }: { a: Application }) {
  if (a.status === 'Исполнено') return <span className="text-gis-muted">{a.dueAt}</span>;
  const left = daysLeft(a);
  if (isOverdue(a)) {
    return (
      <span className="font-semibold text-gis-red">
        {a.dueAt}
        <span className="block text-xs font-normal">просрочено на {Math.abs(left)} дн.</span>
      </span>
    );
  }
  return (
    <span>
      {a.dueAt}
      <span className={`block text-xs ${left <= 2 ? 'text-gis-amber' : 'text-gis-muted'}`}>осталось {left} дн.</span>
    </span>
  );
}

/** Home screen of the `courier` role: the registry of applications assigned to the specialist. */
export function SpecialistPage() {
  const auth = useAuth();
  const [rows, setRows] = useState<Application[]>(applications);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'' | ApplicationStatus>('');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (consumeJustLoggedIn()) {
      setNotice('Вход выполнен. Полномочия учётной записи подтверждены сервисом идентификации.');
      const t = setTimeout(() => setNotice(null), 6000);
      return () => clearTimeout(t);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (a) =>
        (!status || a.status === status) &&
        (!q || a.regNo.toLowerCase().includes(q) || a.applicant.toLowerCase().includes(q) || a.service.toLowerCase().includes(q)),
    );
  }, [rows, query, status]);

  const takeToWork = (regNo: string) =>
    setRows((rs) => rs.map((a) => (a.regNo === regNo ? { ...a, status: 'На рассмотрении' } : a)));

  const active = rows.filter((a) => a.status !== 'Исполнено');
  const overdue = active.filter(isOverdue).length;
  const name = ((auth.user?.profile?.name as string) || 'специалист').trim();

  return (
    <PageTransition>
      <Shell
        section="Личный кабинет специалиста"
        title="Реестр заявлений"
        description={`${name}. Заявления, назначенные вам на исполнение. Данные на ${today}.`}
        toolbar={
          <div className="flex gap-3">
            <Kpi value={active.length} label="в работе" />
            <Kpi value={overdue} label="просрочено" tone={overdue ? 'danger' : 'neutral'} />
            <Kpi value={rows.length - active.length} label="исполнено" tone="success" />
          </div>
        }
      >
        {notice && (
          <div className="mb-4 flex items-start gap-3 rounded border border-gis-green/30 bg-gis-greenLight px-4 py-3 text-sm text-gis-green" role="status">
            <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="10" cy="10" r="8" />
              <path d="M6.5 10.5 L9 13 L13.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {notice}
          </div>
        )}

        <div className="gis-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-gis-line px-4 py-3">
            <input
              className="gis-input max-w-xs"
              placeholder="Поиск по номеру, заявителю, услуге"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Поиск"
            />
            <select
              className="gis-input max-w-[220px]"
              value={status}
              onChange={(e) => setStatus(e.target.value as '' | ApplicationStatus)}
              aria-label="Статус"
            >
              <option value="">Все статусы</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="ml-auto text-xs text-gis-muted">
              Показано {filtered.length} из {rows.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="gis-table">
              <thead>
                <tr>
                  <th>Рег. номер</th>
                  <th>Заявитель</th>
                  <th>Услуга / канал</th>
                  <th>Срок исполнения</th>
                  <th>Статус</th>
                  <th className="text-right">Действие</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.regNo}>
                    <td className="whitespace-nowrap">
                      <div className="font-mono text-xs font-semibold text-gis-blue">{a.regNo}</div>
                      <div className="text-xs text-gis-muted">от {a.registeredAt}</div>
                    </td>
                    <td className="min-w-[190px]">
                      <div className="font-medium">{a.applicant}</div>
                      <div className="text-xs text-gis-muted">{a.applicantType}</div>
                    </td>
                    <td className="min-w-[200px]">
                      <div>{a.service}</div>
                      <div className="text-xs text-gis-muted">{a.channel}</div>
                    </td>
                    <td className="whitespace-nowrap">
                      <Deadline a={a} />
                    </td>
                    <td>
                      <StatusBadge tone={STATUS_TONE[a.status]}>{a.status}</StatusBadge>
                    </td>
                    <td className="whitespace-nowrap text-right">
                      {a.status === 'Зарегистрировано' && (
                        <button className="gis-btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => takeToWork(a.regNo)}>
                          Взять в работу
                        </button>
                      )}
                      {a.status === 'На рассмотрении' && (
                        <button className="gis-btn-link !text-xs" type="button">
                          Открыть
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gis-muted">
                      По заданным условиям заявления не найдены
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Shell>
    </PageTransition>
  );
}

export function Kpi({ value, label, tone = 'neutral' }: { value: number | string; label: string; tone?: Tone }) {
  const color =
    tone === 'danger' ? 'text-gis-red' : tone === 'success' ? 'text-gis-green' : tone === 'warning' ? 'text-gis-amber' : 'text-gis-navy';
  return (
    <div className="gis-card min-w-[104px] px-4 py-2">
      <div className={`text-2xl font-bold leading-none ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-gis-muted">{label}</div>
    </div>
  );
}
