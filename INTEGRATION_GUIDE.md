# 🚀 Руководство по интеграции новой системы аутентификации

## 📋 Обзор

Новая система аутентификации использует:
- **Axios** для HTTP запросов с автоматическими interceptors
- **Zustand** для управления состоянием пользователя
- **TypeScript** для типизации

## 🏗️ Структура файлов

```
src/
├── entities/
│   └── user/
│       ├── model/
│       │   └── user.store.ts          # Zustand store для пользователя
│       └── types/
│           └── user.types.ts          # TypeScript типы для пользователя
├── shared/
│   └── api/
│       └── apiClient.ts               # Axios instance с interceptors
├── services/
│   ├── apiClientNew.ts                # Новый API клиент
│   └── authServiceNew.ts              # Новый сервис аутентификации
└── contexts/
    └── AuthContextNew.tsx             # Новый контекст аутентификации
```

## 🔧 Установка

```bash
npm install axios zustand
```

## 📖 Использование

### 1. Оберните приложение в новый AuthProvider

```tsx
import { AuthProviderNew } from './contexts/AuthContextNew';

function App() {
  return (
    <AuthProviderNew>
      {/* Ваши компоненты */}
    </AuthProviderNew>
  );
}
```

### 2. Используйте хук useAuthNew в компонентах

```tsx
import { useAuthNew } from '../contexts/AuthContextNew';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuthNew();
  
  // Ваша логика
};
```

### 3. Используйте Zustand store напрямую

```tsx
import { useUserStore } from '../entities/user/model/user.store';

const MyComponent = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  
  // Ваша логика
};
```

## 🔄 Миграция с старой системы

### Замена useCurrentUser на useAuthNew

**Было:**
```tsx
import { useCurrentUser } from '../hooks/useCurrentUser';

const currentUser = useCurrentUser();
```

**Стало:**
```tsx
import { useAuthNew } from '../contexts/AuthContextNew';

const { user: currentUser } = useAuthNew();
```

### Замена полей пользователя

**Было:**
```tsx
currentUser.firstName
currentUser.lastName
```

**Стало:**
```tsx
currentUser.first_name
currentUser.last_name
```

## 🎯 Преимущества новой системы

1. **Автоматическое управление токенами** - interceptors автоматически добавляют/обновляют токены
2. **Централизованное состояние** - Zustand store синхронизирован с API
3. **Типизация** - полная TypeScript поддержка
4. **Отладка** - подробные логи для диагностики
5. **Производительность** - оптимизированные re-renders

## 🔍 Отладка

Новая система включает подробные логи:

```
🔍 AuthContextNew: Инициализируем аутентификацию...
🔍 AuthContextNew: Текущий пользователь: {...}
🔍 AuthContextNew: Выполняем вход...
🔍 AuthContextNew: Вход выполнен успешно
```

## 📝 Пример компонента

См. `src/components/ExampleNewAuth.tsx` для полного примера использования.

## 🚀 Готово к продакшену

Новая система полностью готова к использованию и решает проблемы с аутентификацией на продакшене.
