import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';

// Флаг для использования mock SMS (временно, пока не настроен биллинг Firebase)
const USE_MOCK_SMS = true;

// Интерфейс для Firebase SMS верификации
interface FirebaseSMSProps {
  phone: string;
  onVerificationSuccess: (idToken: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

// Хук для использования Firebase SMS
export const useFirebaseSMS = (phone: string, onVerificationSuccess: (idToken: string) => void, onError: (error: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  // Обратный отсчет для повторной отправки SMS
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  // Инициализация reCAPTCHA
  const ensureRecaptcha = async (): Promise<RecaptchaVerifier> => {
    try {
      // Очищаем предыдущий reCAPTCHA
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
      
      // Проверяем, что элемент существует
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error('reCAPTCHA контейнер не найден');
      }
      
      // Создаем новый reCAPTCHA
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
        size: 'invisible' 
      });
      
      // Рендерим reCAPTCHA
      await verifier.render();
      setRecaptchaVerifier(verifier);
      
      return verifier;
    } catch (error: any) {
      console.error('reCAPTCHA initialization error:', error);
      throw new Error('Ошибка инициализации reCAPTCHA');
    }
  };

  // Отправка SMS через Firebase
  const sendSMS = async () => {
    if (!phone) return;

    try {
      setIsLoading(true);
      
      // Проверяем формат телефона
      if (!phone.startsWith('+')) {
        throw new Error('Номер телефона должен быть в международном формате (начинаться с +)');
      }

      // Mock SMS для тестирования (временно, пока не настроен биллинг Firebase)
      if (USE_MOCK_SMS) {
        console.log('🔧 Mock SMS отправлен на номер:', phone);
        console.log('🔧 Тестовый код: 123456');
        
        // Создаем mock confirmation result
        const mockConfirmationResult = {
          confirm: async (code: string) => {
            if (code === '123456') {
              // Возвращаем mock пользователя с idToken
              return {
                user: {
                  getIdToken: async () => 'mock_id_token_' + Date.now()
                }
              };
            } else {
              throw new Error('Неверный код');
            }
          }
        };
        
        setConfirmationResult(mockConfirmationResult);
        setCountdown(60);
        console.log('✅ Mock SMS успешно отправлен');
        return;
      }

      // Инициализируем reCAPTCHA
      const verifier = await ensureRecaptcha();
      
      // Отправляем SMS
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);
      
      setCountdown(60); // 60 секунд до возможности повторной отправки
      
      console.log('SMS sent successfully', { phone });
      
    } catch (error: any) {
      console.error('SMS sending error:', error);
      
      // Очищаем reCAPTCHA при ошибке
      if (recaptchaVerifier) {
        try {
          recaptchaVerifier.clear();
        } catch (e) {
          console.error('Error clearing reCAPTCHA:', e);
        }
        setRecaptchaVerifier(null);
      }
      
      onError(error.message || 'Ошибка отправки SMS');
    } finally {
      setIsLoading(false);
    }
  };

  // Верификация SMS кода
  const verifyCode = async (code: string) => {
    if (!confirmationResult || !code) return;

    try {
      setIsLoading(true);
      
      // Верифицируем код
      const cred = await confirmationResult.confirm(code);
      
      // Получаем idToken
      const idToken = await cred.user.getIdToken();
      
      console.log('Code verified successfully', { 
        uid: cred.user.uid,
        idToken: idToken.slice(0, 20) + '...'
      });
      
      // Вызываем callback с idToken
      onVerificationSuccess(idToken);
      
    } catch (error: any) {
      console.error('Code verification error:', error);
      onError(error.message || 'Неверный код подтверждения');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendSMS,
    verifyCode,
    isLoading,
    countdown,
    canResend: countdown === 0 && !isLoading
  };
};

export default useFirebaseSMS;