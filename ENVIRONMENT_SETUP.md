# Настройка переменных окружения

## Создание файла .env

Создайте файл `.env` в корне проекта со следующим содержимым:

```env
# API Configuration
REACT_APP_API_BASE_URL=https://api.demo-logistica.com

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyC-zFIkGSokxhBtHyf_gaBORKceaBBhq5c
REACT_APP_FIREBASE_AUTH_DOMAIN=smsverify-edd18.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=smsverify-edd18
REACT_APP_FIREBASE_STORAGE_BUCKET=smsverify-edd18.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=835326116153
REACT_APP_FIREBASE_APP_ID=1:835326116153:web:637a14ef1cbb452976a8e8

# App Configuration
REACT_APP_APP_NAME=Logistics Platform
REACT_APP_VERSION=1.0.0

# Development/Production flags
REACT_APP_ENVIRONMENT=development
REACT_APP_DEBUG=true
REACT_APP_ENABLE_DEBUG_TOOLS=true
REACT_APP_ENABLE_API_TESTS=true
```

## Важные замечания

### 🔒 Безопасность
- **НЕ добавляйте** файл `.env` в git репозиторий
- Добавьте `.env` в `.gitignore`
- Используйте `.env.example` для документации
- В продакшене используйте переменные окружения сервера

### 📋 Обязательные переменные
- `REACT_APP_API_BASE_URL` - URL API сервера
- `REACT_APP_FIREBASE_API_KEY` - API ключ Firebase
- `REACT_APP_FIREBASE_PROJECT_ID` - ID проекта Firebase

### 🛠️ Опциональные переменные
- `REACT_APP_DEBUG` - включить отладочные логи
- `REACT_APP_ENABLE_DEBUG_TOOLS` - включить инструменты отладки
- `REACT_APP_ENVIRONMENT` - окружение (development/production)

## Структура конфигурации

Все переменные окружения централизованы в файле `src/config/environment.ts`:

```typescript
import { config } from '../config/environment';

// Использование конфигурации
const apiUrl = config.apiBaseUrl;
const firebaseConfig = config.firebase;
const isDebug = config.app.debug;
```

## Проверка конфигурации

При запуске приложения выполняется валидация:

1. **Обязательные переменные** проверяются в продакшене
2. **Отладочная информация** выводится в консоль при `REACT_APP_DEBUG=true`
3. **Ошибки конфигурации** блокируют запуск приложения

## Развертывание

### Development
```bash
# Создайте .env файл с настройками для разработки
cp .env.example .env
# Отредактируйте .env под ваши нужды
npm start
```

### Production
```bash
# Установите переменные окружения на сервере
export REACT_APP_API_BASE_URL=https://api.production.com
export REACT_APP_FIREBASE_API_KEY=your_production_key
# ... остальные переменные
npm run build
```

## Troubleshooting

### Ошибка "Missing required environment variables"
- Проверьте наличие файла `.env`
- Убедитесь, что все обязательные переменные установлены
- Перезапустите сервер разработки после изменения `.env`

### Firebase не работает
- Проверьте правильность Firebase конфигурации
- Убедитесь, что проект Firebase активен
- Проверьте права доступа к Firebase проекту
