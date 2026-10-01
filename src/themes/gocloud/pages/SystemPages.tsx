import { SystemMessage } from '../components/SystemMessage';
import { config } from '../../../config';
import type { AuthErrorProps } from '../../../theme/types';

export function AuthErrorPage({ error, onHome }: AuthErrorProps) {
  return (
    <SystemMessage
      title="Бейдж не собран"
      lane="error"
      actions={
        <button className="gc-btn-primary" onClick={onHome}>
          На главную
        </button>
      }
    >
      <p>Evolution Managed Identities вернул ошибку, вход не выполнен.</p>
      <pre className="gc-pre">{error.message}</pre>
      <p>
        Повторите вход. Если ошибка повторяется, проверьте в клиенте EMI <code>redirect_uri</code> и{' '}
        <code>client_id</code> — это самые частые причины на лабе.
      </p>
    </SystemMessage>
  );
}

export function MisconfiguredPage() {
  return (
    <SystemMessage title="Не задан сервис идентификации" lane="none">
      <p>
        Приложению не переданы параметры подключения к Evolution Managed Identities: <code>OIDC_AUTHORITY</code> и{' '}
        <code>OIDC_CLIENT_ID</code>. Без них бейдж собрать не из чего.
      </p>
      <pre className="gc-pre !bg-gc-ink !text-white/90">
{`# Docker
docker run -p 8080:8080 \\
  -e OIDC_AUTHORITY=https://<issuer> \\
  -e OIDC_CLIENT_ID=<client-id> \\
  emi-demo-app

# Локально (npm run dev)
cp .env.example .env   # заполнить значения`}
      </pre>
      <p>Подробности — в README.md проекта.</p>
    </SystemMessage>
  );
}

export function BootstrapError({ error }: { error: Error }) {
  return (
    <SystemMessage title="Сервис идентификации недоступен" lane="error">
      <p>Не удалось получить конфигурацию OpenID Connect от Evolution Managed Identities.</p>
      <pre className="gc-pre">{error.message}</pre>
      <p>
        Проверьте <code>OIDC_AUTHORITY</code>
        {config.proxy && (
          <>
            {' '}
            и режим прокси (<code>OIDC_PROXY</code>): контейнер должен иметь сетевой доступ к IdP
          </>
        )}
        .
      </p>
    </SystemMessage>
  );
}
