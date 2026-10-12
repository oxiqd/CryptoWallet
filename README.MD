# CryptoWallet

Учебное fullstack-приложение: регистрация, вход, кошелёк BTC/ETH/USDT, пополнение, списание и история операций. Балансы и операции хранятся в PostgreSQL; реальные переводы в блокчейне и рыночные котировки не реализованы.

## Структура проекта

```text
CryptoWallet/
├── README.MD
├── backend/
│   ├── README.md
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example
│   └── src/
└── frontend/
    ├── README.md
    ├── package.json
    ├── package-lock.json
    ├── .env.example
    └── src/
```

Каждая часть имеет собственные зависимости и команды запуска. Общий `.gitignore` находится в корне и исключает локальные настройки и сгенерированные файлы на всех уровнях.

- [Backend](backend/README.md): Node.js, Fastify, PostgreSQL, bcrypt, JWT, httpOnly refresh cookie. Здесь описаны API и настройка сервера.
- [Frontend](frontend/README.md): React, Vite, JavaScript, React Router, CSS Modules, native fetch. Здесь описаны интерфейс, API-клиент и сборка.

## Локальный запуск

Требуются Node.js 22.12+, npm и PostgreSQL. Перед первым запуском настройте свою БД и локальные env-файлы по инструкциям в соответствующих папках. Не копируйте шаблон поверх уже заполненного `.env`.

**Текущее ограничение:** SQL-схема и миграции пока не добавлены в репозиторий. На пустой БД регистрация и операции не заработают. Подробнее в [инструкции backend](backend/README.md#запуск).

Backend, из корня репозитория:

```sh
cd backend
npm ci
npm run dev
```

Frontend, в отдельном терминале из корня репозитория:

```sh
cd frontend
npm ci
npm run front_dev
```

Открыть http://localhost:5173. Backend по умолчанию доступен на http://localhost:3000. Используйте `localhost` для обеих частей: серверный CORS разрешает именно `http://localhost:5173`.

## Публичный репозиторий

Исходный код, package.json, оба package-lock.json, конфигурации инструментов, README и `.env.example` хранятся в Git. Lockfiles обеспечивают воспроизводимую установку через `npm ci`.

Настоящие `backend/.env` и `frontend/.env`, зависимости, сборки, логи, настройки IDE и `.DS_Store` исключены из Git. Если секрет уже был опубликован, его нужно заменить: перемещение файла и последующее удаление из Git не очищают старые коммиты. [Рекомендации GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

Переменные `VITE_*` попадают в браузерную сборку. `VITE_API_URL` — публичный адрес API; пароли БД и JWT-секреты должны оставаться только на сервере. [Документация Vite](https://vite.dev/guide/env-and-mode).

## Размещение

Деплой ещё не настроен. Для Vite frontend на Vercel корневая директория проекта — `frontend`, команда сборки — `npm run build`, выходная папка — `dist`. Нужны production URL API и fallback на `index.html` для клиентских маршрутов.

Backend располагается в `backend`. Серверный хостинг, PostgreSQL, HTTPS, CORS и cookies настраиваются отдельно; публикация frontend сама по себе их не размещает. Подробности — в README каждой части.
