import { Logo } from '../components/Logo';
import { config } from '../../../config';

// Shown when the app fails to bootstrap the OIDC client — most commonly when
// proxy mode is on but discovery could not be fetched through /oidc/.
export function BootstrapError({ error }: { error: Error }) {
  return (
    <div className="grid min-h-screen place-items-center bg-sunburst px-6 py-12">
      <div className="card w-full max-w-lg p-8 text-center">
        <Logo className="mx-auto h-24 w-24 drop-shadow-xl" withText={false} />
        <h1 className="headline mt-4 text-2xl">Не удалось подключиться к IdP</h1>
        <p className="mt-2 break-words font-semibold text-burger-char/70">{error.message}</p>
        <p className="mt-4 text-sm font-semibold text-burger-char/60">
          Проверьте <code>OIDC_AUTHORITY</code>
          {config.proxy && (
            <>
              {' '}
              и режим прокси (<code>OIDC_PROXY</code>): контейнер должен иметь сетевой доступ к IdP.
            </>
          )}
          . Подробности — в README.md.
        </p>
      </div>
    </div>
  );
}
