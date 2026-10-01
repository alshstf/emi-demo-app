import { useAuth } from 'react-oidc-context';
import { Badge } from '../components/Badge';
import { TopBar, Footer, issuerHost } from '../components/Shell';
import { PageTransition } from '../../../components/PageTransition';
import { config, isConfidential } from '../../../config';
import { LANES } from '../brand';

const LEGEND = [
  { lane: 'speaker', swatch: 'bg-gc-green', text: 'роль courier в токене' },
  { lane: 'staff', swatch: 'bg-gc-ink', text: 'роль supervisor в токене' },
  { lane: 'attendee', swatch: 'border border-gc-ink bg-white', text: 'без роли: собирается при первом входе' },
] as const;

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-gc-greenDark" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="9" width="12" height="8" />
      <path d="M7 9 V6.5 a3 3 0 0 1 6 0 V9" />
    </svg>
  );
}

/** "/" for guests: an empty badge and the single call to action — sign in to assemble it. */
export function LandingPage() {
  const auth = useAuth();
  const login = () => auth.signinRedirect();

  return (
    <PageTransition className="flex min-h-screen flex-col bg-gc-paper font-gocloud text-gc-ink">
      <TopBar
        right={
          <>
            <span className="hidden text-xs text-gc-muted sm:inline">Стойка регистрации</span>
            <button onClick={login} className="gc-btn-outline !px-4 !py-2">
              Войти
            </button>
          </>
        }
      />

      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[300px_1fr] lg:gap-20 lg:py-16">
        <div className="justify-self-center lg:justify-self-start">
          <Badge lane="none" qrSeed={config.event_name} />
        </div>

        <section className="max-w-2xl">
          <div className="gc-label text-gc-greenDark">
            {config.event_name} · демо Evolution Managed Identities
          </div>
          <h1 className="gc-h mt-3 text-4xl sm:text-5xl lg:text-6xl">Собери свой бейдж</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-gc-muted">
            Войдите через Evolution Managed Identities: имя, компания и роль придут в ID-токене, и бейдж
            соберётся сам. Цвет ленты выбирается по роли.
          </p>

          <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            {LEGEND.map((l) => (
              <li key={l.lane} className="flex items-start gap-2.5">
                <span className={`mt-1 h-3.5 w-3.5 shrink-0 ${l.swatch}`} aria-hidden />
                <span>
                  <b className="font-extrabold">{LANES[l.lane].label}</b>
                  <span className="block text-xs text-gc-muted">{l.text}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={login} className="gc-btn-primary !px-7 !py-4 !text-sm">
              Войти и собрать бейдж
            </button>
            <span className="text-xs text-gc-muted">
              {config.event_date} · {config.event_place}
            </span>
          </div>

          <div className="mt-8 max-w-xl border border-gc-line bg-white px-4 py-3 text-xs text-gc-muted">
            <div className="flex items-center gap-2 font-extrabold text-gc-ink">
              <LockIcon />
              Вход: Evolution Managed Identities
            </div>
            <div className="mt-1.5">
              OpenID Connect, Authorization Code + PKCE{isConfidential ? ' (confidential client)' : ''}. Сервис входа:{' '}
              {issuerHost()}.
            </div>
            <div className="mt-1.5">
              Приложение ничего не хранит: бейдж собирается из токена при каждом входе, а роль читается из клеймов.
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
