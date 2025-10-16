import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';

const USE_MOCK_SMS = true;

interface FirebaseSMSProps {
  phone: string;
  onVerificationSuccess: (idToken: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export const useFirebaseSMS = (phone: string, onVerificationSuccess: (idToken: string) => void, onError: (error: string) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const ensureRecaptcha = async (): Promise<RecaptchaVerifier> => {
    try {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
      
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error('reCAPTCHA контейнер не найден');
      }
      
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', { 
        size: 'invisible' 
      });
      
      await verifier.render();
      setRecaptchaVerifier(verifier);
      
      return verifier;
    } catch (error: any) {
      console.error('reCAPTCHA initialization error:', error);
      throw new Error('Ошибка инициализации reCAPTCHA');
    }
  };

  const sendSMS = async () => {
    if (!phone) return;

    try {
      setIsLoading(true);
      
      if (!phone.startsWith('+')) {
        throw new Error('Номер телефона должен быть в международном формате (начинаться с +)');
      }

      if (USE_MOCK_SMS) {
        
        const mockConfirmationResult = {
          confirm: async (code: string) => {
            if (code === '123456') {
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
        return;
      }

      const verifier = await ensureRecaptcha();
      
      const result = await signInWithPhoneNumber(auth, phone, verifier);
      setConfirmationResult(result);
      
      setCountdown(60);
      
      
    } catch (error: any) {
      console.error('SMS sending error:', error);
      
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

  const verifyCode = async (code: string) => {
    if (!confirmationResult || !code) return;

    try {
      setIsLoading(true);
      
      const cred = await confirmationResult.confirm(code);
      
      const idToken = await cred.user.getIdToken();
      
      console.log({
        uid: cred.user.uid,
        idToken: idToken.slice(0, 20) + '...'
      });
      
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