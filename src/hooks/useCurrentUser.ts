import { useState, useEffect } from 'react';
import { getGlobalTestDB } from '../data/testData';

export interface CurrentUser {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const useCurrentUser = (): CurrentUser | null => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const clearedAll = localStorage.getItem('CLEARED_ALL_DATA');
    if (clearedAll === 'true') {
      setCurrentUser(null);
      return;
    }
    
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        if (!userData.id) {
          const testDB = getGlobalTestDB();
          const dbUser = testDB.users[userData.phone];
          
          if (dbUser && dbUser.id) {
            const updatedUserData = {
              ...userData,
              id: dbUser.id
            };
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            setCurrentUser(updatedUserData);
          } else {
            const updatedUserData = {
              ...userData,
              id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };
            
            localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            setCurrentUser(updatedUserData);
          }
        } else {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.warn('Ошибка парсинга данных пользователя:', error);
      }
    }
  }, []);

  return currentUser;
};
