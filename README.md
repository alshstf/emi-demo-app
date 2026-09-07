# Демо-приложение Evolution Managed Identities

Тестовый веб-клиент для показа продукта **Evolution Managed Identities** (управляемый
облачный Identity Provider по протоколу OpenID Connect). Приложение реализует
**OIDC Authorization Code Flow + PKCE** целиком на фронтенде (публичный клиент,
без client_secret) и показывает разные экраны в зависимости от роли пользователя.

Один и тот же образ поставляется с **двумя темами оформления** (скинами) поверх
одной и той же OIDC-механики — см. [«Темы оформления»](#темы-оформления-скины):

| Тема | Что это | Роль `courier` | Роль `supervisor` | Без явной роли |
| --- | --- | --- | --- | --- |
| 🍔 `burger` | **«Бургерный курьер»** — промо-стиль ООО «Бургер и точка» | Курьер: список заказов на доставку | Супервайзер: курьеры и доставки за день | Покупатель: витрина бургеров с ценами и корзиной |
| 🏛 `gis` | **«Типовая ГИС»** — строгий стиль государственной информационной системы (для показов ГосТех / госзаказчикам) | Специалист: реестр заявлений | Руководитель: мониторинг исполнения | Гражданин: личный кабинет, подача заявлений |

**Регистрация «на лету».** Пользователь **без** ролей `courier`/`supervisor` — это не
ошибка доступа, а рядовой пользователь: гражданин, пришедший через Госуслуги (ЕСИА), или
покупатель, вошедший через Яндекс ID (внешние IdP подключаются к Evolution MI как
брокеру). Приложение заводит ему учётную запись при первом входе по данным токена и
показывает ФИО, e-mail, телефон (с признаками подтверждения), дату рождения, СНИЛС/ИНН —
если такие клеймы пришли (`name`, `given_name`/`family_name`/`middle_name`, `email`,
`email_verified`, `phone_number`, `phone_number_verified`, `birthdate`, `snils`, `inn`,
`identity_provider`). Факт регистрации хранится в localStorage браузера по `sub`.

В теме `gis` дополнительно есть раздел **«Сведения о сеансе»** (`/session`): кто вошёл,
через какой issuer, какие роли и откуда они взяты, срок действия сеанса, полный состав
ID- и access-токена — удобно показывать, что именно поставляет Identity Provider.

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
   - нет известных ролей → `/cabinet`: роль по умолчанию (гражданин / покупатель),
     учётная запись создаётся на лету из клеймов токена.

## Темы оформления (скины)

Тема выбирается **один раз при старте страницы**, синхронно, до первого рендера —
поэтому и заставка, и страницы ошибок, и favicon/заголовок вкладки сразу выходят в
нужном стиле. Порядок определения:

1. **`APP_THEME=burger` | `gis`** — тема **жёстко закреплена** за развёртыванием.
   Никакие переключатели (`?theme=`, localStorage, хост) не действуют. **Это
   рекомендуемый режим для демонстраций**: получить «не ту» тему посреди показа
   невозможно.
2. **`APP_THEME_HOSTS`** (при `APP_THEME=auto`) — тема по хосту, на котором открыто
   приложение: `хост=тема` через запятую, `*.домен` — любой поддомен. Позволяет
   одним развёртыванием обслуживать два адреса, например
   `gis.demo.example.ru=gis,burger.demo.example.ru=burger` (оба redirect URI надо
   зарегистрировать в клиенте Evolution MI — по умолчанию `redirect_uri`
   вычисляется от текущего origin).
3. **`APP_THEME_SWITCH=true`** (при `APP_THEME=auto`) — параметр `?theme=gis|burger`
   переключает тему и запоминает её в localStorage. Только для разработки и
   «смешанных» стендов.
4. По умолчанию — `burger`.

Источник решения пишется в консоль браузера: `[theme] gis (source: env, locked)`.

Бренд темы `gis` настраивается без пересборки: `GIS_NAME` (короткое имя в шапке),
`GIS_FULL_NAME` (полное имя), `GIS_OPERATOR` (оператор в подвале). Роли IdP при
этом **те же** (`courier` / `supervisor`) — меняется только их отображение
(«Специалист» / «Руководитель»), так что клиент и пользователи в Evolution MI
переиспользуются для обеих тем.

Шрифты темы `gis` (Roboto, с кириллицей) вшиты в сборку — внешних запросов нет,
тема работает в изолированных контурах. Тема `burger` подгружает Google Fonts.

### Откуда взяты паттерны «Типовой ГИС»

Оформление собрано по общим чертам десяти крупных ГИС (Госуслуги/ЕСИА и
методические рекомендации Минцифры, ГИС ЖКХ, ЕИС закупок, ГИС Торги, ЛК ФНС,
Росреестр/ЕГРН, mos.ru/ЕМИАС, Электронный бюджет, «Работа России»):

- «государственный синий» primary (`#0D4CD3`) на белом, серые поверхности
  (`#F3F5F8`), тёмно-синий текст (`#0B1F33`), семантические статусы
  зелёный/янтарный/красный, радиусы 4–8 px, без крупных теней;
- Roboto как де-факто шрифт ГИС (Lato — только у Госуслуг);
- шапка: эмблема + полное официальное имя системы, справа пользователь и роль;
  тонкая тёмная полоса сверху с оператором, техподдержкой 8-800 и
  **«Версия для слабовидящих»** (в демо реально работает);
- в кабинетах — **левый сайдбар** с разделами, хлебные крошки, реестр как таблица
  с фильтрами и статусами-бейджами, KPI-плитки у руководителя;
- страница входа — карточка «Вход в систему» с одной кнопкой «Войти» и
  примечанием о согласии на обработку ПДн (152-ФЗ);
- подвал: оператор, горячая линия, политика ПДн, ©, номер версии и дата сборки.

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
| `APP_THEME` | `VITE_APP_THEME` | тема: `burger` / `gis` (закреплена) или `auto` | `auto` (→ `burger`) |
| `APP_THEME_HOSTS` | `VITE_APP_THEME_HOSTS` | тема по хосту (`хост=тема,…`), только при `auto` | — |
| `APP_THEME_SWITCH` | `VITE_APP_THEME_SWITCH` | разрешить `?theme=` (dev), только при `auto` | `false` |
| `GIS_NAME` | `VITE_GIS_NAME` | короткое имя системы (тема `gis`) | `Типовая ГИС` |
| `GIS_FULL_NAME` | `VITE_GIS_FULL_NAME` | полное имя системы (тема `gis`) | `Типовая государственная информационная система…` |
| `GIS_OPERATOR` | `VITE_GIS_OPERATOR` | оператор системы в подвале (тема `gis`) | `Уполномоченный орган — оператор системы` |

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

Тестовым пользователям назначьте роли `courier` и/или `supervisor`. Пользователь без
этих ролей (например, вошедший через подключённый к Evolution MI внешний IdP —
Госуслуги/ЕСИА или Яндекс ID) попадает в кабинет роли по умолчанию. Чтобы в кабинете
отображались e-mail и телефон, добавьте в клиент scope `email` и `phone` (или
соответствующие мапперы клеймов) — см. `OIDC_SCOPE`.

## Локальный запуск

```bash
cp .env.example .env     # заполнить OIDC_AUTHORITY и OIDC_CLIENT_ID
npm install
npm run dev              # http://localhost:5173
```

## Docker

```bash
docker build -t burger-courier .

docker run --rm -p 8080:8080 \
  -e OIDC_AUTHORITY="https://<issuer>" \
  -e OIDC_CLIENT_ID="<client-id>" \
  -e OIDC_REDIRECT_URI="http://localhost:8080/callback" \
  -e OIDC_POST_LOGOUT_REDIRECT_URI="http://localhost:8080/" \
  -e OIDC_PROXY="true" \
  -e APP_THEME="gis" \
  burger-courier
# открыть http://localhost:8080
```

`APP_THEME=gis` закрепляет тему «Типовая ГИС» (для показа ГосТех); `APP_THEME=burger` —
«Бургерный курьер». Без переменной приложение стартует в теме `burger`.

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
    roles.ts           извлечение roles из ID + access токенов; роль по умолчанию
    profile.ts         ФИО / e-mail / телефон / СНИЛС… из клеймов токена
    registration.ts    учёт первой регистрации пользователя (JIT-provisioning demo)
    guards.tsx         RequireAuth / RequireRole
  pages/CallbackPage   общий обработчик /callback (обмен кода → роутинг по роли)
  theme/
    types.ts           контракт темы: набор экранов + метаданные (title, favicon, шрифты)
    resolve.ts         выбор темы: APP_THEME → APP_THEME_HOSTS → ?theme= → burger
    index.ts           реестр тем, applyThemeMeta()
  themes/
    burger/            «Бургерный курьер»: pages/ (…, Customer — витрина), components/, data/
    gis/               «Типовая ГИС»: pages/ (Landing, Specialist, Manager, Citizen, Session…),
                       components/ (Shell с сайдбаром, Emblem, StatusBadge…), data/, a11y.ts
docker/
  nginx.conf           SPA fallback + кэширование
  entrypoint.sh        генерация config.js из env при старте (OIDC_* + APP_THEME* + GIS_*)
Dockerfile             multi-stage: node build → nginx
```

## Демонстрация

Источники по Cloud.ru Artifact Registry:

- [Аутентификация в Artifact Registry](https://cloud.ru/docs/artifact-registry-evolution/ug/topics/guides__auth.html)
- [Настройка CI/CD с Artifact Registry](https://cloud.ru/docs/tutorials-evolution/list/topics/container-apps__ci-cd)
