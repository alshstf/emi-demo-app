import { SystemMessage } from '../components/SystemMessage';
import { config } from '../../../config';
import type { AuthErrorProps } from '../../../theme/types';

export function AuthErrorPage({ error, onHome }: AuthErrorProps) {
  return (
    <SystemMessage
      title="Ошибка входа в систему"
      tone="error"
      actions={
        <button className="gis-btn-primary" onClick={onHome}>
          Вернуться на главную
        </button>
      }
    >
      <p>Сервис идентификации вернул ошибку, вход не выполнен.</p>
      <pre className="overflow-x-auto rounded border border-gis-line bg-gis-surface p-3 text-xs">{error.message}</pre>
      <p>Повторите попытку. Если ошибка повторяется, обратитесь в техническую поддержку.</p>
    </SystemMessage>
  );
}

export function MisconfiguredPage() {
  return (
    <SystemMessage title="Не задана конфигурация сервиса идентификации" tone="error">
      <p>
        Приложению не переданы параметры подключения к Identity Provider: <code>OIDC_AUTHORITY</code> и{' '}
        <code>OIDC_CLIENT_ID</code>.
      </p>
      <pre className="overflow-x-auto rounded border border-gis-line bg-gis-navy p-3 text-xs text-white/90">
{`# Docker
docker run -p 8080:80 \\
  -e OIDC_AUTHORITY=https://<issuer> \\
  -e OIDC_CLIENT_ID=<client-id> \\
  -e APP_THEME=gis \\
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
    <SystemMessage title="Сервис идентификации недоступен" tone="error">
      <p>Не удалось получить конфигурацию OpenID Connect от Identity Provider.</p>
      <pre className="overflow-x-auto rounded border border-gis-line bg-gis-surface p-3 text-xs">{error.message}</pre>
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
