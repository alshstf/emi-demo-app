# 🍔 Бургерный курьер

Демо-приложение **«Бургерный курьер»** компании ООО «Бургер и точка» — тестовый
веб-клиент для показа продукта **Evolution Managed Identities** (управляемый
облачный Identity Provider по протоколу OpenID Connect).

Приложение реализует **OIDC Authorization Code Flow + PKCE** целиком на фронтенде
(публичный клиент, без client_secret) и показывает разные экраны в зависимости от
роли пользователя:

- **`courier`** — список заказов, которые нужно доставить;
- **`supervisor`** — список курьеров и число выполненных за сегодня доставок.

Роль определяется по списку ролей в токене. По умолчанию роли берутся по пути
`resource_access.%%OIDC_CLIENT_ID%%.roles` (Keycloak-подобная структура), с
фолбэком на плоский клейм `roles`. Путь настраивается (`OIDC_ROLES_CLAIM_PATH`) и
поддерживает шаблоны `%%ИМЯ%%`, где `ИМЯ` — env-имя конфиг-переменной:
`%%OIDC_CLIENT_ID%%`, `%%OIDC_AUTHORITY%%`, `%%OIDC_SCOPE%%`, `%%OIDC_ROLES_CLAIM%%`
(легаси-плейсхолдер `{client_id}` тоже поддерживается). Роли считываются **и из
ID-токена, и из access-токена** (берутся оттуда, где есть).

## Стек

- React 18 + TypeScript + Vite
- [`oidc-client-ts`](https://github.com/authts/oidc-client-ts) + [`react-oidc-context`](https://github.com/authts/react-oidc-context) — OIDC PKCE
- Tailwind CSS, Framer Motion, canvas-confetti — визуал «промо-вау»
- Docker (multi-stage, nginx) + GitHub Actions → Cloud.ru Artifact Registry

## Сценарий (пользовательский флоу)

1. Лендинг с логотипом и кнопкой **«Войти»**.
2. Редирект в Evolution Managed Identities (Authorization Code + PKCE).
3. Возврат на `/callback`, обмен кода на токены.
4. Маршрутизация по роли:
   - `courier` → `/courier`;
   - `supervisor` → `/supervisor`;
   - обе роли → экран выбора рабочего места;
   - нет известных ролей → экран с перечнем пришедших ролей (удобно для отладки).

## Конфигурация (переменные окружения)

Один и тот же Docker-образ настраивается под любое окружение через переменные
окружения — они подставляются в `config.js` при старте контейнера.

| Переменная (контейнер) | Переменная (dev, `.env`) | Назначение | По умолчанию |
| --- | --- | --- | --- |
| `OIDC_AUTHORITY` | `VITE_OIDC_AUTHORITY` | issuer / база OIDC discovery | — (обязательно) |
| `OIDC_CLIENT_ID` | `VITE_OIDC_CLIENT_ID` | client_id публичного клиента | — (обязательно) |
| `OIDC_REDIRECT_URI` | `VITE_OIDC_REDIRECT_URI` | redirect_uri | `<origin>/callback` |
| `OIDC_POST_LOGOUT_REDIRECT_URI` | `VITE_OIDC_POST_LOGOUT_REDIRECT_URI` | возврат после выхода | `<origin>/` |
| `OIDC_SCOPE` | `VITE_OIDC_SCOPE` | запрашиваемые scopes | `openid profile` |
| `OIDC_ROLES_CLAIM_PATH` | `VITE_OIDC_ROLES_CLAIM_PATH` | путь до ролей; шаблоны `%%ИМЯ%%` | `resource_access.%%OIDC_CLIENT_ID%%.roles` |
| `OIDC_ROLES_CLAIM` | `VITE_OIDC_ROLES_CLAIM` | плоский клейм ролей (фолбэк) | `roles` |
| `OIDC_PROXY` | `VITE_OIDC_PROXY` | прокси back-channel через `/oidc/` (фикс CORS) | `false` |
| `OIDC_LOAD_USERINFO` | `VITE_OIDC_LOAD_USERINFO` | запрашивать userinfo после логина | `false` |
| `OIDC_CLIENT_SECRET` | `VITE_OIDC_CLIENT_SECRET` | secret для confidential-режима (demo-only) | — (пусто) |

> В контейнере переменные передаются **без** префикса `VITE_`. Локально (через
> `npm run dev`) Vite читает переменные **с** префиксом `VITE_` из `.env`.

## CORS: режим прокси (`OIDC_PROXY`)

Public-client SPA делает из браузера прямые `fetch`-запросы к IdP (`discovery`,
`jwks`, `POST token`, опционально `userinfo`). Это cross-origin XHR, поэтому
Evolution MI должен отдавать на них `Access-Control-Allow-Origin` для origin
приложения. Если этого нет — браузер блокирует запросы (и приходится отключать
CORS в браузере).

Чтобы демо работало без флагов браузера, есть встроенный **same-origin reverse
proxy**. При `OIDC_PROXY=true`:

- nginx (тот же контейнер) проксирует `/oidc/<path>` → `<origin OIDC_AUTHORITY>/<path>`;
- приложение получает discovery через прокси и подменяет только back-channel-эндпоинты
  (`token`, `jwks`, `userinfo`, `revocation`) на same-origin `/oidc/...`;
- `authorize` и `logout` остаются прямыми редиректами на реальный IdP — они не
  подпадают под CORS, а интерактивная страница логина открывается на родном
  origin Evolution MI.

В итоге браузер ходит только на origin приложения → CORS не нужен. Контейнеру
требуется сетевой доступ к IdP. Для `npm run dev` тот же прокси поднимает Vite
(`/oidc` → origin из `VITE_OIDC_AUTHORITY`), так что dev ведёт себя как контейнер.

> Для продакшена корректнее включить CORS / Allowed Web Origins на стороне
> Evolution MI; режим прокси — удобный фолбэк для демо и окружений, где это пока
> не настроено.

## Confidential client (`OIDC_CLIENT_SECRET`, demo-only)

По умолчанию приложение — **public client** (только PKCE, без secret). Если задать
`OIDC_CLIENT_SECRET`, приложение переходит в **confidential**-режим и отправляет
client_secret при обмене кода на токены — удобно, чтобы проверить, что Evolution MI
принимает confidential-клиента.

> ⚠️ Это SPA: secret попадает в браузер и **не является защищённым**. Режим
> предназначен только для демонстрации/проверки. Для настоящего confidential
> client секрет должен жить на бэкенде (BFF), который и выполняет обмен кода.

## Настройка клиента в Evolution Managed Identities

Заведите **публичный** OIDC-клиент со следующими параметрами:

- тип клиента: **public** (PKCE, без client_secret);
- grant: `authorization_code`;
- **Redirect URIs:** `http://localhost:5173/callback` (для локальной разработки)
  и `https://<домен-демо>/callback`;
- **Post-logout redirect URIs:** `http://localhost:5173/` и `https://<домен-демо>/`;
- **Scopes:** `openid profile` (+ scope, который добавляет роли, напр. `roles`);
- роли должны попадать в токен по пути `resource_access.<client_id>.roles`
  (или настройте `OIDC_ROLES_CLAIM_PATH` под вашу структуру).

Тестовым пользователям назначьте роли `courier` и/или `supervisor`.

## Локальный запуск

```bash
cp .env.example .env     # заполнить OIDC_AUTHORITY и OIDC_CLIENT_ID
npm install
npm run dev              # http://localhost:5173
```

## Docker

```bash
docker build -t burger-courier .

docker run --rm -p 8080:80 \
  -e OIDC_AUTHORITY="https://<issuer>" \
  -e OIDC_CLIENT_ID="<client-id>" \
  -e OIDC_REDIRECT_URI="http://localhost:8080/callback" \
  -e OIDC_POST_LOGOUT_REDIRECT_URI="http://localhost:8080/" \
  -e OIDC_PROXY="true" \
  burger-courier
# открыть http://localhost:8080
```

`OIDC_PROXY=true` включает same-origin прокси, чтобы не отключать CORS в браузере
(см. раздел ниже).

Проверить, что runtime-конфиг сгенерировался:

```bash
curl -s http://localhost:8080/config.js
```

## CI/CD: сборка и публикация в Cloud.ru Artifact Registry

Workflow [`.github/workflows/build-push.yml`](.github/workflows/build-push.yml)
собирает Docker-образ и пушит его в Cloud.ru Artifact Registry при push в `main`,
по тегам `v*` и по ручному запуску (`workflow_dispatch`).

Аутентификация в реестре — по [персональному ключу](https://cloud.ru/docs/artifact-registry-evolution/ug/topics/guides__auth.html)
(`docker login <registry_name>.cr.cloud.ru -u <key_id> -p <key_secret>`).

Настройте в репозитории (**Settings → Secrets and variables → Actions**):

**Variables**

| Имя | Значение |
| --- | --- |
| `CR_URI` | `<registry_name>.cr.cloud.ru` (URI вашего реестра в Artifact Registry) |

**Secrets**

| Имя | Значение |
| --- | --- |
| `EVO_CR_LOGIN` | Key ID персонального ключа Cloud.ru |
| `EVO_CR_PWD` | Key Secret персонального ключа Cloud.ru |

Образ публикуется как `${CR_URI}/burger-courier` с тегами `latest`,
`sha-<commit>` и (для тегов) `v*`.

## Структура проекта

```
src/
  config.ts            конфиг: window.__APP_CONFIG__ / VITE_* / дефолты
  oidc.ts              настройки oidc-client-ts (Authorization Code + PKCE)
  App.tsx, main.tsx    роутинг и провайдеры
  auth/
    roles.ts           извлечение roles из ID + access токенов
    guards.tsx         RequireAuth / RequireRole
  pages/               Landing, Callback, Courier, Supervisor, RolePicker, NoAccess, Misconfigured
  components/          Logo, Mascot, BurgerGlyph, FloatingBurgers, AppHeader, Splash, confetti
  data/                orders.ts, couriers.ts (мок-данные)
docker/
  nginx.conf           SPA fallback + кэширование
  entrypoint.sh        генерация config.js из env при старте
Dockerfile             multi-stage: node build → nginx
```

## Демонстрация

Источники по Cloud.ru Artifact Registry:

- [Аутентификация в Artifact Registry](https://cloud.ru/docs/artifact-registry-evolution/ug/topics/guides__auth.html)
- [Настройка CI/CD с Artifact Registry](https://cloud.ru/docs/tutorials-evolution/list/topics/container-apps__ci-cd)
