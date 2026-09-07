import { useAuth } from 'react-oidc-context';
import { Emblem } from '../components/Emblem';
import { TopStrip, Footer } from '../components/Shell';
import { PageTransition } from '../../../components/PageTransition';
import { config, isConfidential } from '../../../config';

const FEATURES = [
  'Регистрация и учёт заявлений граждан и организаций',
  'Контроль сроков и хода исполнения',
  'Мониторинг нагрузки и результативности подразделений',
  'Единый вход через сервис идентификации платформы, для граждан — через Госуслуги (ЕСИА)',
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-gis-blue" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 10.5 L8.5 15 L16 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingPage() {
  const auth = useAuth();
  const login = () => auth.signinRedirect();
  const issuerHost = (() => {
    try {
      return new URL(config.authority).host;
    } catch {
      return config.authority;
    }
  })();

  return (
    <PageTransition className="flex min-h-screen flex-col bg-gis-surface font-gis text-gis-ink">
      <TopStrip />

      <header className="border-b border-gis-line bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Emblem className="h-11 w-10" />
          <div>
            <div className="text-sm font-bold uppercase tracking-wide text-gis-navy">{config.gis_name}</div>
            <div className="text-xs text-gis-muted">{config.gis_full_name}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <section>
          <div className="gis-label">Государственная информационная система</div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-gis-navy sm:text-4xl">{config.gis_full_name}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-gis-muted">
            Система обеспечивает приём, регистрацию и контроль исполнения заявлений, а также формирование
            отчётности для уполномоченного органа. Доступ к функциям определяется полномочиями учётной записи.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {FEATURES.map((f) => (
              <li key={f} className="flex gap-2.5">
                <Check />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="gis-card p-6 sm:p-8" aria-labelledby="login-title">
          <h2 id="login-title" className="text-xl font-bold text-gis-navy">
            Вход в систему
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-gis-muted">
            Для входа используется учётная запись единого сервиса идентификации платформы. После
            аутентификации вы будете возвращены в систему автоматически.
          </p>

          <button onClick={login} className="gis-btn-primary mt-6 w-full !py-3 !text-base">
            Войти
          </button>

          <div className="mt-5 rounded border border-gis-line bg-gis-surface px-4 py-3 text-xs text-gis-muted">
            <div className="flex items-center gap-2 font-semibold text-gis-ink">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-gis-blue" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="4" y="9" width="12" height="8" rx="1.5" />
                <path d="M7 9 V6.5 a3 3 0 0 1 6 0 V9" />
              </svg>
              Аутентификация: Evolution Managed Identities
            </div>
            <div className="mt-1.5">
              Протокол OpenID Connect, Authorization Code + PKCE
              {isConfidential ? ' (confidential client)' : ''}. Сервис входа: {issuerHost}.
            </div>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-gis-muted">
            Нажимая «Войти», вы подтверждаете согласие на обработку персональных данных в соответствии с
            Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
          </p>
          <p className="mt-2 text-xs text-gis-muted">
            Граждане входят с учётной записью Госуслуг (ЕСИА) — учётная запись в системе создаётся
            автоматически при первом входе. Сотрудникам полномочия назначает администратор организации.
          </p>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
