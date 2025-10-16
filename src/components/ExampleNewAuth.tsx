import React from 'react';
import { useAuthNew } from '../contexts/AuthContextNew';
import { useUserStore } from '../entities/user/model/user.store';

const ExampleNewAuth: React.FC = () => {
  const { user, isAuthenticated, isLoading, login, logout, error } = useAuthNew();
  const userFromStore = useUserStore((state) => state.user);

  const handleLogin = async () => {
    try {
      await login('+31645263963', 'password123');
      console.log('✅ Вход выполнен успешно');
    } catch (error) {
      console.error('❌ Ошибка входа:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('✅ Выход выполнен успешно');
    } catch (error) {
      console.error('❌ Ошибка выхода:', error);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Пример новой системы аутентификации</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Статус аутентификации:</h4>
        <p>Авторизован: {isAuthenticated ? 'Да' : 'Нет'}</p>
        <p>Загрузка: {isLoading ? 'Да' : 'Нет'}</p>
        {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Пользователь из контекста:</h4>
        {user ? (
          <div>
            <p>ID: {user.id}</p>
            <p>Имя: {user.first_name} {user.last_name}</p>
            <p>Телефон: {user.phone}</p>
            <p>Email: {user.email}</p>
            <p>Админ: {user.is_admin ? 'Да' : 'Нет'}</p>
          </div>
        ) : (
          <p>Пользователь не авторизован</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Пользователь из Zustand Store:</h4>
        {userFromStore ? (
          <div>
            <p>ID: {userFromStore.id}</p>
            <p>Имя: {userFromStore.first_name} {userFromStore.last_name}</p>
            <p>Телефон: {userFromStore.phone}</p>
          </div>
        ) : (
          <p>Пользователь не найден в store</p>
        )}
      </div>

      <div>
        <h4>Действия:</h4>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={{ padding: '10px', marginRight: '10px' }}>
            Выйти
          </button>
        ) : (
          <button onClick={handleLogin} style={{ padding: '10px', marginRight: '10px' }}>
            Войти (тестовый аккаунт)
          </button>
        )}
      </div>
    </div>
  );
};

export default ExampleNewAuth;
