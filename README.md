# Logistics Platform

Логистическая платформа для управления грузами и транспортом.

## 🚀 Быстрый старт

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
```bash
# Автоматическая настройка (создает .env из env.example)
npm run setup-env

# Или вручную
cp env.example .env
# Отредактируйте .env с вашими настройками
```

### 3. Запуск приложения
```bash
npm start
```

## 🔧 Конфигурация

### Обязательные переменные окружения

Создайте файл `.env` в корне проекта:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://api.demo-logistica.com

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Опциональные переменные

```env
# App Configuration
REACT_APP_APP_NAME=Logistics Platform
REACT_APP_VERSION=1.0.0

# Debug flags
REACT_APP_DEBUG=true
REACT_APP_ENABLE_DEBUG_TOOLS=true
REACT_APP_ENABLE_API_TESTS=true
```

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
├── config/             # Конфигурация приложения
│   ├── environment.ts  # Централизованная конфигурация
│   └── firebase.ts     # Firebase настройки
├── contexts/           # React контексты
├── services/           # API сервисы
├── utils/              # Утилиты
└── css/               # Стили
```

## 🔐 Безопасность

- ✅ Все чувствительные данные в переменных окружения
- ✅ Файл `.env` исключен из git
- ✅ Централизованная конфигурация
- ✅ Валидация переменных окружения

## 🛠️ Доступные скрипты

- `npm start` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm test` - Запуск тестов
- `npm run setup-env` - Настройка переменных окружения

## 🐛 Отладка

### Админ панель не загружает пользователей?

1. Откройте консоль браузера (F12)
2. Перейдите в админ панель
3. Нажмите кнопку "Тест API"
4. Проверьте логи в консоли

### Проверка конфигурации

```bash
# Проверка переменных окружения
npm run setup-env

# Проверка Firebase конфигурации
# Смотрите консоль браузера при запуске
```

## 📚 Документация

- [Настройка переменных окружения](ENVIRONMENT_SETUP.md)
- [Диагностика админ панели](DEBUG_ADMIN_PANEL.md)

## 🚀 Развертывание

### Development
```bash
npm run setup-env
npm start
```

### Production
```bash
# Установите переменные окружения на сервере
export REACT_APP_API_BASE_URL=https://api.production.com
export REACT_APP_FIREBASE_API_KEY=production_key
# ... остальные переменные

npm run build
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## 📄 Лицензия

Этот проект лицензирован под MIT License.
