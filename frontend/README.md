# Crypto Wallet frontend

Отдельное приложение React + Vite + JavaScript. CSS Modules, React Router, native fetch. Бэкенд в корне проекта не изменён.

## Запуск

Из папки `frontend`:

```sh
npm install
npm run dev
```

Открыть http://localhost:5173. По умолчанию API: http://localhost:3000. Для изменения скопировать `.env.example` в `.env` и указать `VITE_API_URL`. После изменения env перезапустить Vite.

```sh
npm run build
npm run preview
```

## Подключение бэкенда

Фронтенд уже отправляет реальные запросы по существующему контракту. Для работы требуется запущенный бэкенд и PostgreSQL. В текущем `src/app.js` бэкенда нет CORS: при разных origins добавить разрешение для `http://localhost:5173` и `credentials: true`. Не использовать wildcard origin с cookies. Это задача интеграции, код бэкенда здесь не менялся.

Все ответы читаются из `data`. Балансы: `wallet.balances[]`, суммы: PostgreSQL NUMERIC strings, даты операций: `created_at`. Строковые суммы отображаются без преобразования в Number; POST amount отправляется числом, как требует текущая схема API. Точность входящих сумм ограничена JavaScript Number и контрактом сервера.

При старте вызывается `/auth/refresh`. Access token хранится только в памяти Context, cookie не читается JavaScript. Все запросы используют credentials include. Защищённые запросы используют Bearer token. При 401 общий refresh обновляет сессию, затем запрос повторяется один раз. При ошибке logout сессия сохраняется, чтобы можно было повторить очистку cookie на сервере.

После успешной операции заново загружаются балансы и история. Ошибка повторной загрузки показывается отдельно; операция повторно не отправляется. Кнопка «Обновить» позволяет повторить загрузку. Нет курсов, USD-оценки или реальных переводов: API их не предоставляет.

## Production позже

Установить `VITE_API_URL=/api` **при сборке**, проксировать `/api/*` на бэкенд с удалением префикса `/api`. SPA server должен отдавать `index.html` для `/login`, `/register`, `/dashboard`.

Важно: текущий бэкенд выставляет cookie с `Path=/auth`. При проксировании через `/api` нужно на этапе интеграции переписать cookie path на `/api/auth` (например, `proxy_cookie_path /auth /api/auth` в Nginx) либо согласовать path в бэкенде. Production cookie требует HTTPS. Frontend сам не меняет cookie или настройки серверов.
