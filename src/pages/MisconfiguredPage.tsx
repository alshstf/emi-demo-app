import { Logo } from '../components/Logo';

// Shown when OIDC_AUTHORITY / OIDC_CLIENT_ID are not provided, so the app
// cannot start the login flow. Guides whoever launched the demo.
export function MisconfiguredPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-sunburst px-6 py-12">
      <div className="card w-full max-w-lg p-8 text-center">
        <Logo className="mx-auto h-24 w-24 drop-shadow-xl" withText={false} />
        <h1 className="headline mt-4 text-2xl">Не задана конфигурация OIDC</h1>
        <p className="mt-2 font-semibold text-burger-char/70">
          Приложение не знает, к какому Identity Provider подключаться.
        </p>

        <div className="mt-5 rounded-2xl bg-burger-char/90 p-4 text-left font-mono text-xs leading-relaxed text-burger-cream">
          <div className="text-burger-yellow"># Docker</div>
          <div>docker run -p 8080:80 \</div>
          <div>&nbsp;&nbsp;-e OIDC_AUTHORITY=https://&lt;issuer&gt; \</div>
          <div>&nbsp;&nbsp;-e OIDC_CLIENT_ID=&lt;client-id&gt; \</div>
          <div>&nbsp;&nbsp;burger-courier</div>
          <div className="mt-3 text-burger-yellow"># Локально (npm run dev)</div>
          <div>cp .env.example .env&nbsp;&nbsp;# заполнить значения</div>
        </div>

        <p className="mt-4 text-sm font-semibold text-burger-char/60">Подробности — в README.md проекта.</p>
      </div>
    </div>
  );
}
