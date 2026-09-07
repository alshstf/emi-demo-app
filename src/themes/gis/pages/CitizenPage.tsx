import { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Shell } from '../components/Shell';
import { StatusBadge, type Tone } from '../components/StatusBadge';
import { PageTransition } from '../../../components/PageTransition';
import { userProfile } from '../../../auth/profile';
import { ensureRegistered } from '../../../auth/registration';
import { publicServices } from '../data/services';
import { today, type ApplicationStatus } from '../data/applications';

interface CitizenApplication {
  regNo: string;
  registeredAt: string;
  service: string;
  status: ApplicationStatus;
}

const STATUS_TONE: Record<ApplicationStatus, Tone> = {
  Зарегистрировано: 'info',
  'На рассмотрении': 'warning',
  'Требует уточнения': 'danger',
  Исполнено: 'success',
};

/** ISO `yyyy-mm-dd` (OIDC `birthdate`) → `dd.mm.yyyy`; anything else is shown as is. */
const fmtDate = (d?: string) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d.split('-').reverse().join('.') : d ?? '—');
const fmtDateTime = (ts: number) => new Date(ts).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' });

function Verified({ ok }: { ok?: boolean }) {
  if (ok === undefined) return null;
  return ok ? (
    <StatusBadge tone="success">подтверждён</StatusBadge>
  ) : (
    <StatusBadge tone="warning">не подтверждён</StatusBadge>
  );
}

/**
 * Home of the implicit role — a citizen who signed in (e.g. via Госуслуги)
 * and has no staff role. The account is provisioned on the fly from the token.
 */
export function CitizenPage() {
  const auth = useAuth();
  const profile = userProfile(auth.user);
  const [reg] = useState(() => ensureRegistered(profile.sub));
  const [apps, setApps] = useState<CitizenApplication[]>([
    { regNo: '77-2026-000398', registeredAt: '26.08.2026', service: 'Предоставление выписки из реестра', status: 'Исполнено' },
    { regNo: '77-2026-000429', registeredAt: '04.09.2026', service: 'Постановка на учёт', status: 'На рассмотрении' },
  ]);
  const [notice, setNotice] = useState<string | null>(null);
  const [seq, setSeq] = useState(441);

  const submit = (service: string) => {
    const regNo = `77-2026-${String(seq).padStart(6, '0')}`;
    setSeq((n) => n + 1);
    setApps((a) => [{ regNo, registeredAt: today, service, status: 'Зарегистрировано' }, ...a]);
    setNotice(`Заявление зарегистрировано. Регистрационный номер ${regNo}. Уведомления о ходе рассмотрения будут направлены в личный кабинет.`);
  };

  const rows: [string, React.ReactNode][] = [
    ['Фамилия, имя, отчество', profile.fullName],
    ['Дата рождения', fmtDate(profile.birthdate)],
    ['СНИЛС', profile.snils ?? '—'],
    ['ИНН', profile.inn ?? '—'],
    [
      'Адрес электронной почты',
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
    ['Источник сведений', profile.identityProvider ? `${profile.identityProvider} (через сервис идентификации платформы)` : 'Сервис идентификации платформы (Evolution Managed Identities)'],
    ['Дата регистрации в системе', fmtDateTime(reg.registeredAt)],
    ['Идентификатор учётной записи', <code className="text-xs">{profile.sub ?? '—'}</code>],
  ];

  return (
    <PageTransition>
      <Shell section="Личный кабинет гражданина" title="Личный кабинет" description="Сведения об учётной записи и ваши заявления.">
        {reg.isNew && (
          <div className="mb-4 rounded border border-gis-green/30 bg-gis-greenLight px-4 py-3 text-sm text-gis-green" role="status">
            <b>Учётная запись создана.</b> Регистрация в системе выполнена автоматически на основании сведений,
            полученных от сервиса идентификации при входе. Заполнять анкету не требуется.
          </div>
        )}
        {notice && (
          <div className="mb-4 rounded border border-gis-blue/30 bg-gis-blueLight px-4 py-3 text-sm text-gis-blueDark" role="status">
            {notice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
          <section className="gis-card p-5">
            <h2 className="text-base font-semibold text-gis-navy">Данные учётной записи</h2>
            <p className="mt-1 text-xs text-gis-muted">Сведения получены из токена при входе и не редактируются в системе.</p>
            <dl className="gis-kv mt-4">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="gis-card p-5">
            <h2 className="text-base font-semibold text-gis-navy">Доступные услуги</h2>
            <ul className="mt-4 divide-y divide-gis-line">
              {publicServices.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="mt-0.5 text-xs text-gis-muted">
                      {s.description} Срок — {s.termDays} рабочих дн.
                    </div>
                  </div>
                  <button className="gis-btn-secondary shrink-0 !px-3 !py-1.5 !text-xs" onClick={() => submit(s.name)}>
                    Подать заявление
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="gis-card mt-6">
          <div className="flex items-center justify-between border-b border-gis-line px-4 py-3">
            <h2 className="text-base font-semibold text-gis-navy">Мои заявления</h2>
            <span className="text-xs text-gis-muted">Всего: {apps.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="gis-table">
              <thead>
                <tr>
                  <th>Рег. номер</th>
                  <th>Дата подачи</th>
                  <th>Услуга</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.regNo}>
                    <td className="whitespace-nowrap font-mono text-xs font-semibold text-gis-blue">{a.regNo}</td>
                    <td className="whitespace-nowrap">{a.registeredAt}</td>
                    <td>{a.service}</td>
                    <td>
                      <StatusBadge tone={STATUS_TONE[a.status]}>{a.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Shell>
    </PageTransition>
  );
}
