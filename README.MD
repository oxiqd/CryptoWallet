# CryptoWallet

Учебное fullstack-приложение: регистрация, вход, кошелёк BTC/ETH/USDT, пополнение, списание и история операций. Операции учитываются в PostgreSQL; реальные переводы в блокчейне и рыночные котировки не реализованы.

## Стек и структура

- Backend: Node.js, Fastify, PostgreSQL, pg, bcrypt, JWT, httpOnly refresh cookie.
- Frontend: React, Vite, JavaScript, React Router, CSS Modules, native fetch.
- `src/` — сервер. Зависимости направлены от routes через controllers и services к repositories.
- `frontend/` — отдельное приложение со своим package.json и lockfile.

## Локальный запуск

Требуются Node.js 22.12+ (для текущего Vite), npm и PostgreSQL. После клонирования команды backend выполняются из корня проекта.

### 1. База данных

Создайте свою базу и пользователя PostgreSQL. Backend ожидает таблицы `users`, `wallets`, `balances`, `transactions`.

**Ограничение текущей версии:** SQL-схема и миграции ещё не добавлены в репозиторий. На пустой БД регистрация и операции не заработают. Для полностью воспроизводимого запуска после клонирования нужно добавить SQL-файл или миграции со структурой таблиц, ограничениями и индексами.

### 2. Настройки backend

```sh
npm ci
cp .env.example .env
```

В локальном `.env` укажите свои `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Для `JWT_SECRET` и `JWT_REFRESH_SECRET` сгенерируйте два разных случайных значения: выполните следующую команду дважды и перенесите результаты в соответствующие поля.

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Значения по умолчанию в шаблоне: сервер `localhost:3000`, access token `15m`, refresh token `7d`. Пароль БД и JWT-секреты в публичный шаблон не записываются.

```sh
npm run dev
```

`GET http://localhost:3000/health` проверяет HTTP-сервер; доступность БД и её таблиц проверяется отдельно через пользовательские сценарии.

### 3. Frontend

В другом терминале:

```sh
cd frontend
npm ci
cp .env.example .env
npm run front_dev
```

Открыть http://localhost:5173. `VITE_API_URL=http://localhost:3000` задаёт адрес API. CORS сервера сейчас разрешает именно `http://localhost:5173` с cookies. Для этого сценария используйте `localhost`, а не `127.0.0.1`.

Сборка и локальный просмотр сборки из папки `frontend`:

```sh
npm run build
npm run preview
```

Preview нужен для просмотра production-сборки. Его origin отличается от dev-сервера: для запросов к backend нужно отдельно согласовать CORS или настроить прокси.

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

`type`: `deposit` или `withdrawal`; `asset`: `BTC`, `ETH`, `USDT`; `amount`: число больше нуля. Frontend хранит access token только в памяти и восстанавливает сессию через httpOnly cookie.

## Что хранить в публичном репозитории

Исходный код, package.json, оба package-lock.json, конфигурации инструментов, README и `.env.example` остаются в Git. Lockfiles нужны для воспроизводимой установки через `npm ci`.

Настоящие `.env`, зависимости, сборки, логи, настройки IDE и `.DS_Store` исключены через `.gitignore`. `.DS_Store` — служебные метаданные Finder, они не относятся к приложению. `.env` нормально хранить локально в корне: исключение из Git защищает от публикации, а не скрывает файл в редакторе.

Backend-секреты при размещении задаются в окружении серверного хостинга. `VITE_API_URL` не является секретом: Vite встраивает переменные `VITE_*` в браузерную сборку. Пароли БД и JWT-секреты нельзя помещать в переменные `VITE_*`.

Если секрет уже был опубликован, его нужно заменить. Удаление файла из следующего коммита не удаляет предыдущие версии из истории Git. Очистка истории — отдельная операция с переписыванием коммитов и согласованием с теми, кто уже клонировал репозиторий.

## Размещение

Деплой ещё не настроен. Для Vite frontend на Vercel корневая директория проекта — `frontend`, команда сборки — `npm run build`, выходная папка — `dist`. Нужны production URL API и fallback на `index.html` для клиентских маршрутов.

Публикация frontend сама по себе не размещает PostgreSQL и не настраивает backend. Сервер, БД, HTTPS и правила работы cookies нужно подготовить отдельно. При разных доменах текущие CORS и `sameSite: 'strict'` требуют пересмотра под выбранную схему размещения. При одном origin с `/api` нужно согласовать proxy path и cookie path; подробнее в `frontend/README.md`.

## Документация

- [Node.js](https://nodejs.org/docs/latest/api/)
- [Fastify](https://fastify.dev/docs/latest/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Vite: переменные окружения](https://vite.dev/guide/env-and-mode)
- [GitHub: удаление опубликованных секретов](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
