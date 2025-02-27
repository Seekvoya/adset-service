# AdSet Service

Этот сервис предназначен для динамической сборки Ad Set на основе поиска по дереву условий с вероятностным распределением.

## 🚀 Развертывание

### 📌 Требования:
- Node.js (v18+)
- PostgreSQL
- Redis
- Yarn (рекомендуется)

### 📥 Установка зависимостей:
```sh
yarn install
```

### ⚙️ Настройка окружения:
Создайте файл `.env` в корне проекта и укажите необходимые переменные окружения:

```
APP_PORT=port

DB_HOST=host
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=adset_db

REDIS_HOST=host
REDIS_PORT=6379
```

### 📦 Запуск сервиса:
#### В режиме разработки:
```sh
yarn start:dev
```

#### В продакшн:
```sh
yarn start:prod
```

#### yarn build запускать не нужно, он добавлен в команды

### 🛠️ Миграции базы данных:
#### Генерация миграций:
```sh
MIGRATION_NAME=<name> yarn migration:generate
```
#### Применение миграций:
```sh
yarn migration:run
```
#### Удаление миграций:
```sh
yarn migration:down //удаление одной миграции
yarn migration:dropAll //полностью удалит все миграции
```

### 📝 API Эндпоинты:
- **GET `/adset?geo=RU&device=mobile`** – получить AdSet на основе параметров
- **POST `/adset/probability`** – обновить вероятность узла

### Чтобы проверить GET запрос рекомендуется наполнить бд своими сущностями, например:
``` sh
INSERT INTO tree_node (name, conditions, probability, type, parent_id) VALUES   ('Node 1', '{"geo": "RU", "device": "mobile"}', 0.5, 'type1', 1),  ('Node 2', '{"geo": "US", "device": "desktop"}', 0.5, 'type2', 1);
```
---
💡 *Проект использует NestJS, TypeORM, Redis и PostgreSQL.*
