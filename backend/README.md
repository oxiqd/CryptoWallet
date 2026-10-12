# CryptoWallet backend

API на Node.js и Fastify с PostgreSQL. Серверные файлы и зависимости находятся внутри `backend/`; все команды ниже выполняются из этой папки.

## Запуск

Требуются Node.js 22.12+, npm и PostgreSQL.

```sh
cd backend
npm ci
cp .env.example .env
```

Если локальный `.env` уже существует, сохраняйте его: повторно копировать шаблон поверх него не нужно.

Создайте свою базу и пользователя PostgreSQL, затем заполните в `.env` параметры `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Для `JWT_SECRET` и `JWT_REFRESH_SECRET` нужны два разных случайных значения. Выполните следующую команду дважды и перенесите результаты в соответствующие поля:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Backend ожидает таблицы `users`, `wallets`, `balances`, `transactions`. **SQL-схема и миграции пока не добавлены в репозиторий:** на пустой БД регистрация и операции не заработают. Для воспроизводимого запуска после клонирования нужно добавить схему таблиц, ограничения и индексы.

```sh
npm run dev
```

По умолчанию сервер доступен на http://localhost:3000. `/health` проверяет HTTP-сервер, но не подключение к БД и не наличие таблиц.

## Команды

- `npm run dev` — запуск с watch и локальным `.env`.
- `npm start` — запуск без watch с локальным `.env`.
- `npm run lint` — ESLint с автоматическими исправлениями.
- `npm run format` — Prettier для файлов backend.

## Структура

- `src/server.js` — запуск сервера.
- `src/app.js` — создание Fastify и регистрация плагинов и маршрутов.
- `src/modules/` — routes → controllers → services → repositories.
- `src/db/` — пул PostgreSQL и управление SQL-транзакциями.
- `src/plugins/` — JWT, cookies, CORS, авторизация, обработка ошибок.
- `src/config/env.js` — чтение настроек окружения.
- `src/info.md` — заметки об архитектуре и учебный roadmap.

## API

Успешные ответы auth, wallet и transactions обёрнуты в `{ data: ... }`; `/health` возвращает `{ status: 'OK' }`. Защищённые запросы требуют `Authorization: Bearer <accessToken>`.

| Метод | Endpoint            | Назначение                           |
| ----- | ------------------- | ------------------------------------ |
| GET   | `/health`           | Проверка HTTP-сервера                |
| POST  | `/auth/register`    | Регистрация: `{ email, password }`   |
| POST  | `/auth/login`       | Вход: `{ email, password }`          |
| POST  | `/auth/refresh`     | Новый access token по refresh cookie |
| POST  | `/auth/logout`      | Очистка refresh cookie               |
| GET   | `/wallet`           | Кошелёк и балансы                    |
| GET   | `/transactions`     | История пользователя                 |
| GET   | `/transactions/:id` | Одна операция пользователя           |
| POST  | `/transactions`     | `{ type, asset, amount }`            |

`type`: `deposit` или `withdrawal`; `asset`: `BTC`, `ETH`, `USDT`; `amount`: число больше нуля. Refresh token хранится в httpOnly cookie с `Path=/auth`. CORS разрешает `http://localhost:5173` с credentials; `127.0.0.1` — другой origin.

## Секреты и размещение

Настоящий `.env` хранится локально и исключён из Git; `.env.example` — публичный шаблон без секретов. Если ключи были опубликованы в старых коммитах, их нужно заменить: исключение файла из Git не очищает историю.

При размещении нужны серверный хостинг, PostgreSQL, HTTPS и production-настройки окружения. Текущие scripts читают `.env`; если хостинг передаёт переменные через окружение без файла, команду запуска нужно согласовать с ним, например `node src/server.js` из `backend/`.

При разных доменах frontend и backend текущие CORS и `sameSite: 'strict'` требуют настройки под выбранную схему размещения. При одном origin с `/api` нужно согласовать proxy path и cookie path; подробнее в `../frontend/README.md`.
