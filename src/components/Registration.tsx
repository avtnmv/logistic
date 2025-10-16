import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import FormMessage from './FormMessage';
import PasswordToggle from './PasswordToggle';
import { usePasswordToggle } from '../hooks/usePasswordToggle';
import { useFirebaseSMS } from '../services/firebaseSMS';
import { authService } from '../services/authService';
import apiClient from '../services/apiClient';
import '../css/login.css';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'phone' | 'code' | 'details' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [codeInputs, setCodeInputs] = useState(['', '', '', '', '', '']);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [showMessage, setShowMessage] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();

  const showFormMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setShowMessage(true);
  };

  // Проверка валидности токенов
  const checkTokenValidity = useCallback(async (savedAccessToken: string, savedRefreshToken: string) => {
    try {
      // Устанавливаем токены в apiClient для проверки
      apiClient.setTokens(savedAccessToken, savedRefreshToken);
      
      // Проверяем токены через API
      const response = await authService.getMe();
      
      if (response.status && response.data) {
        // Проверяем, что регистрация не завершена
        if (response.data.registration_stage === 'PHONE_VERIFIED') {
          // Токены валидны, переходим к завершению регистрации
          setAccessToken(savedAccessToken);
          setRefreshToken(savedRefreshToken);
          setPhone(response.data.phone);
          setCurrentStep('details');
          showFormMessage('Продолжите завершение регистрации', 'info');
        } else if (response.data.registration_stage === 'COMPLETED') {
          // Регистрация уже завершена, очищаем токены
          localStorage.removeItem('registration_accessToken');
          localStorage.removeItem('registration_refreshToken');
          showFormMessage('Регистрация уже завершена. Перейдите к входу в систему.', 'info');
        }
      }
    } catch (error: any) {
      // Токены невалидны, очищаем их
      console.error('Ошибка проверки токенов:', error);
      localStorage.removeItem('registration_accessToken');
      localStorage.removeItem('registration_refreshToken');
    }
  }, []);

  // Проверяем сохраненные токены при загрузке
  useEffect(() => {
    const savedAccessToken = localStorage.getItem('registration_accessToken');
    const savedRefreshToken = localStorage.getItem('registration_refreshToken');
    
    
    if (savedAccessToken && savedRefreshToken) {
      // Проверяем валидность токенов
      checkTokenValidity(savedAccessToken, savedRefreshToken);
    } else {
    }
  }, [checkTokenValidity]);

  // Firebase SMS hook
  const firebaseSMS = useFirebaseSMS(
    phone,
    (idToken: string) => {
      handleFirebaseVerification(idToken);
    },
    (error: string) => {
      showFormMessage(error, 'error');
    }
  );

  const handleFirebaseVerification = async (idToken: string) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyFirebase({ idToken });
      
      if (response.status && response.data) {
        const { accessToken: token, refreshToken: refresh } = response.data;
        
        
        // Сохраняем токены в state
        setAccessToken(token);
        setRefreshToken(refresh);
        
        // Сохраняем токены в localStorage для восстановления регистрации
        localStorage.setItem('registration_accessToken', token);
        localStorage.setItem('registration_refreshToken', refresh);
        
        setCurrentStep('details');
        showFormMessage('Номер телефона подтвержден!', 'success');
      } else {
        showFormMessage(response.message || 'Ошибка подтверждения номера', 'error');
      }
    } catch (error: any) {
      console.error('Исключение в handleFirebaseVerification:', error);
      showFormMessage(error.message || 'Ошибка подтверждения номера', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      showFormMessage('Введите номер телефона', 'error');
      return;
    }

    const phoneRegex = /^\+\d{1,4}\d{7,14}$/;
    if (!phoneRegex.test(phone)) {
      showFormMessage('Введите корректный номер телефона в международном формате (например: +380XXXXXXXXX, +998XXXXXXXXX, +1XXXXXXXXXX)', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Проверяем, существует ли телефон
      const checkResponse = await authService.checkPhone({ phone });
      
      if (checkResponse.status && checkResponse.data) {
        
        if (checkResponse.data.existing) {
          // Пользователь уже существует, но возможно не завершил регистрацию
          // Нужно получить токены для завершения регистрации
          try {
            showFormMessage('Пользователь найден. Отправляем код для завершения регистрации...', 'info');
            
            // Отправляем SMS для получения токенов
            await firebaseSMS.sendSMS();
            setCurrentStep('code');
          } catch (error: any) {
            console.error('❌ Ошибка отправки SMS:', error);
            showFormMessage('Ошибка получения доступа. Попробуйте заново.', 'error');
          }
        } else {
          // Новый пользователь, отправляем SMS
          showFormMessage('Отправляем код...', 'info');
          await firebaseSMS.sendSMS();
          setCurrentStep('code');
        }
      } else {
        showFormMessage(checkResponse.message || 'Ошибка проверки номера', 'error');
      }
    } catch (error: any) {
      console.error('❌ Ошибка проверки номера:', error);
      showFormMessage(error.message || 'Произошла ошибка при проверке номера', 'error');
    } finally {
      setIsLoading(false);
    }
  };


  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = codeInputs.join('');
    
    if (code.length !== 6) {
      showFormMessage('Введите полный 6-значный код', 'error');
      return;
    }
    
    if (!/^\d{6}$/.test(code)) {
      showFormMessage('Код должен состоять только из цифр', 'error');
      return;
    }
    
    setIsLoading(true);
    try {
      // Верифицируем код через Firebase
      await firebaseSMS.verifyCode(code);
    } catch (error: any) {
      setIsCodeCorrect(false);
      showFormMessage(error.message || 'Неверный код подтверждения', 'error');
      setCodeInputs(['', '', '', '', '', '']);
      setTimeout(() => {
        setIsCodeCorrect(null);
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      showFormMessage('Введите имя', 'error');
      return;
    }
    
    if (!lastName.trim()) {
      showFormMessage('Введите фамилию', 'error');
      return;
    }
    
    if (!password.trim()) {
      showFormMessage('Введите пароль', 'error');
      return;
    }
    
    if (!confirmPassword.trim()) {
      showFormMessage('Повторите пароль', 'error');
      return;
    }
    
    if (password.length < 6) {
      showFormMessage('Пароль должен содержать минимум 6 символов', 'error');
      return;
    }
    
    if (!/[A-Z]/.test(password)) {
      showFormMessage('Пароль должен содержать хотя бы одну заглавную букву', 'error');
      return;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      showFormMessage('Пароль должен содержать хотя бы один специальный символ (!@#$%^&*(),.?":{}|<>)', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showFormMessage('Пароли не совпадают. Проверьте правильность ввода', 'error');
      return;
    }

    if (!accessToken || !refreshToken) {
      showFormMessage('Ошибка авторизации. Попробуйте заново.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.register({ firstName, lastName, password }, accessToken, refreshToken);
      
      if (response.status && response.data) {
        localStorage.removeItem('registration_accessToken');
        localStorage.removeItem('registration_refreshToken');
        
        showFormMessage('Регистрация завершена успешно!', 'success');
        setCurrentStep('success');
        
        setTimeout(() => {
          navigate('/search-orders');
        }, 2000);
      } else {
        showFormMessage(response.message || 'Ошибка завершения регистрации', 'error');
      }
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      showFormMessage(error.message || 'Произошла ошибка при завершении регистрации', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (firebaseSMS.countdown > 0) return;
    
    try {
      showFormMessage('Отправляем код повторно...', 'info');
      await firebaseSMS.sendSMS();
    } catch (error: any) {
      showFormMessage(error.message || 'Ошибка повторной отправки кода', 'error');
    }
  };

  const handleChangePhone = () => {
    setCurrentStep('phone');
    setPhone('');
    setCodeInputs(['', '', '', '', '', '']);
    setIsCodeCorrect(null);
  };

  const handleCodeInputChange = (index: number, value: string) => {
    // Оставляем только цифры
    const numericValue = value.replace(/\D/g, '');
    
    const newInputs = [...codeInputs];
    newInputs[index] = numericValue;
    setCodeInputs(newInputs);
    
    // Автоматически переходим к следующему полю при вводе цифры
    if (numericValue && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Обработка Backspace
    if (e.key === 'Backspace' && codeInputs[index] === '' && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newInputs = [...codeInputs];
        newInputs[index - 1] = '';
        setCodeInputs(newInputs);
      }
    }
    
    // Обработка повторного Backspace для очистки всех полей
    if (e.key === 'Backspace' && codeInputs[index] !== '') {
      if (e.repeat) {
        setCodeInputs(['', '', '', '', '', '']);
        const firstInput = document.querySelector(`input[data-index="0"]`) as HTMLInputElement;
        if (firstInput) firstInput.focus();
        e.preventDefault();
      }
    }
    
    // Обработка Backspace в первом поле
    if (e.key === 'Backspace' && index === 0 && codeInputs[index] === '') {
      setCodeInputs(['', '', '', '', '', '']);
      e.preventDefault();
    }
    
    // Обработка цифр - автоматический переход к следующему полю
    if (/^\d$/.test(e.key) && codeInputs[index] !== '') {
      const newInputs = [...codeInputs];
      newInputs[index] = e.key;
      setCodeInputs(newInputs);
      
      if (index < 5) {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
      e.preventDefault();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (/^\d{6}$/.test(pastedData)) {
      const newInputs = pastedData.split('');
      setCodeInputs([...newInputs, '', '', '', '', '', ''].slice(0, 6));
    }
  };

  return (
    <>
      <Header />
    
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
      
      <main className="main container">
        <div className="main__container">
          <AnimatePresence mode="wait">
            {currentStep === 'phone' && (
              <motion.div 
                key="phone"
                className="form-container form-container--active"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="548" height="44" viewBox="0 0 548 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '32px'}}>
                  <path d="M44 22c0 12.15-9.85 22-22 22S0 34.15 0 22 9.85 0 22 0s22 9.85 22 22" fill="#4472B8"/>
                  <path d="M24.068 15.111v14.222H21.06V17.965h-.084l-3.257 2.042V17.34l3.521-2.229z" fill="#fff"/>
                  <path fill="#E5E5E3" d="M44 20.5h208v3H44zM296 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M268.994 29.333v-2.166l5.062-4.688q.646-.624 1.084-1.125.445-.5.673-.979.23-.486.23-1.049 0-.624-.285-1.076a1.87 1.87 0 0 0-.778-.701 2.44 2.44 0 0 0-1.118-.25q-.653 0-1.139.264a1.8 1.8 0 0 0-.75.756q-.264.494-.264 1.174h-2.854q0-1.395.632-2.424a4.2 4.2 0 0 1 1.771-1.59q1.138-.562 2.625-.562 1.527 0 2.66.541 1.139.535 1.77 1.486.633.953.632 2.181 0 .806-.319 1.59-.312.785-1.118 1.743-.805.952-2.271 2.285l-2.076 2.035v.097h5.972v2.458z" fill="#fff"/>
                  <path fill="#E5E5E3" d="M296 20.5h208v3H296zM548 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M525.476 29.528q-1.557 0-2.771-.535-1.208-.541-1.91-1.486-.694-.951-.715-2.195h3.027q.028.521.341.917.32.389.847.604a3.1 3.1 0 0 0 1.187.216q.688 0 1.216-.243.528-.244.826-.674a1.7 1.7 0 0 0 .299-.993q0-.57-.32-1.007-.312-.444-.902-.695-.584-.25-1.389-.25h-1.327V20.98h1.327a2.9 2.9 0 0 0 1.201-.236q.528-.236.819-.653.292-.422.292-.986a1.71 1.71 0 0 0-.965-1.576 2.3 2.3 0 0 0-1.056-.23q-.61 0-1.118.223-.507.215-.812.618a1.63 1.63 0 0 0-.327.944h-2.882q.021-1.23.702-2.166.68-.938 1.833-1.466 1.16-.534 2.618-.534 1.472 0 2.577.534 1.104.535 1.715 1.445.618.903.611 2.028.007 1.194-.743 1.993-.742.798-1.938 1.014v.11q1.57.202 2.389 1.09.826.883.82 2.21a3.47 3.47 0 0 1-.702 2.159q-.7.945-1.937 1.486-1.236.542-2.833.542" fill="#fff"/>
                </svg>

                <h2 className="form-container__title">Создайте аккаунт</h2>
                <p className="form-container__description">Введите номер телефона для регистрации в системе</p>

                <FormMessage 
                  message={message} 
                  type={messageType} 
                  isVisible={showMessage} 
                />

                <form className="form" onSubmit={handleSubmit}>
                  <div className="form__group">
                    <input 
                      type="tel" 
                      className="form__input" 
                      placeholder=" " 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                    <label className="form__label">Номер телефона</label>
                  </div>

                  <button 
                    type="submit" 
                    className="form__button form__button--login"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Отправка...' : 'Зарегистрироваться'}
                  </button>
                </form>

                <div className="form-container__footer">
                  <p className="form-container__text">Уже зарегистрированы?</p>
                  <button 
                    className="form__button form-container__button"
                    onClick={() => navigate('/')}
                  >
                    Войти в систему
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'code' && (
              <motion.div 
                key="code"
                className="form-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="548" height="44" viewBox="0 0 548 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '32px'}}>
                  <path d="M44 22c0 12.15-9.85 22-22 22S0 34.15 0 22 9.85 0 22 0s22 9.85 22 22" fill="#4472B8"/>
                  <path d="M24.068 15.111v14.222H21.06V17.965h-.084l-3.257 2.042V17.34l3.521-2.229z" fill="#fff"/>
                  <path fill="#E5E5E3" d="M44 20.5h208v3H44zM296 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M268.994 29.333v-2.166l5.062-4.688q.646-.624 1.084-1.125.445-.5.673-.979.23-.486.23-1.049 0-.624-.285-1.076a1.87 1.87 0 0 0-.778-.701 2.44 2.44 0 0 0-1.118-.25q-.653 0-1.139.264a1.8 1.8 0 0 0-.75.756q-.264.494-.264 1.174h-2.854q0-1.395.632-2.424a4.2 4.2 0 0 1 1.771-1.59q1.138-.562 2.625-.562 1.527 0 2.66.541 1.139.535 1.77 1.486.633.953.632 2.181 0 .806-.319 1.59-.312.785-1.118 1.743-.805.952-2.271 2.285l-2.076 2.035v.097h5.972v2.458z" fill="#fff"/>
                  <path fill="#E5E5E3" d="M296 20.5h208v3H296zM548 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M525.476 29.528q-1.557 0-2.771-.535-1.208-.541-1.91-1.486-.694-.951-.715-2.195h3.027q.028.521.341.917.32.389.847.604a3.1 3.1 0 0 0 1.187.216q.688 0 1.216-.243.528-.244.826-.674a1.7 1.7 0 0 0 .299-.993q0-.57-.32-1.007-.312-.444-.902-.695-.584-.25-1.389-.25h-1.327V20.98h1.327a2.9 2.9 0 0 0 1.201-.236q.528-.236.819-.653.292-.422.292-.986a1.71 1.71 0 0 0-.965-1.576 2.3 2.3 0 0 0-1.056-.23q-.61 0-1.118.223-.507.215-.812.618a1.63 1.63 0 0 0-.327.944h-2.882q.021-1.23.702-2.166.68-.938 1.833-1.466 1.16-.534 2.618-.534 1.472 0 2.577.534 1.104.535 1.715 1.445.618.903.611 2.028.007 1.194-.743 1.993-.742.798-1.938 1.014v.11q1.57.202 2.389 1.09.826.883.82 2.21a3.47 3.47 0 0 1-.702 2.159q-.7.945-1.937 1.486-1.236.542-2.833.542" fill="#fff"/>
                </svg>

                <h2 className="form-container__title">Введите код</h2>
                <p className="form-container__description">Мы отправили код на номер <span>{phone}</span></p>

                <FormMessage 
                  message={message} 
                  type={messageType} 
                  isVisible={showMessage} 
                />

                <form className="form" onSubmit={handleCodeSubmit}>
                  <div className="code-input-container" onPaste={handleCodePaste}>
                    {codeInputs.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        className={`code-input ${
                          isCodeCorrect === true ? 'code-input--correct' : 
                          isCodeCorrect === false ? 'code-input--incorrect' : ''
                        }`}
                        maxLength={1}
                        data-index={index}
                        value={value}
                        onChange={(e) => handleCodeInputChange(index, e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        autoComplete="off"
                      />
                    ))}
                  </div>

                  <div className="form-buttons">
                    <button 
                      type="submit" 
                      className="form__button form__button--login"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Проверка...' : 'Подтвердить'}
                    </button>
                    <button 
                      type="button" 
                      className="form__button form__button--secondary"
                      onClick={handleResendCode}
                      disabled={firebaseSMS.countdown > 0 || isLoading}
                    >
                      {firebaseSMS.countdown > 0 ? `Отправить код ещё раз (${firebaseSMS.countdown}s)` : 'Отправить код ещё раз'}
                    </button>
                    <button 
                      type="button" 
                      className="form__button form__button--secondary"
                      onClick={handleChangePhone}
                    >
                      Изменить номер телефона
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentStep === 'details' && (
              <motion.div 
                key="details"
                className="form-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="548" height="44" viewBox="0 0 548 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '32px'}}>
                  <path d="M44 22c0 12.15-9.85 22-22 22S0 34.15 0 22 9.85 0 22 0s22 9.85 22 22" fill="#4472B8"/>
                  <path d="M24.068 15.111v14.222H21.06V17.965h-.084l-3.257 2.042V17.34l3.521-2.229z" fill="#fff"/>
                  <path fill="#4472B8" d="M44 20.5h208v3H44zM296 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M268.994 29.333v-2.166l5.062-4.688q.646-.624 1.084-1.125.445-.5.673-.979.23-.486.23-1.049 0-.624-.285-1.076a1.87 1.87 0 0 0-.778-.701 2.44 2.44 0 0 0-1.118-.25q-.653 0-1.139.264a1.8 1.8 0 0 0-.75.756q-.264.494-.264 1.174h-2.854q0-1.395.632-2.424a4.2 4.2 0 0 1 1.771-1.59q1.138-.562 2.625-.562 1.527 0 2.66.541 1.139.535 1.77 1.486.633.953.632 2.181 0 .806-.319 1.59-.312.785-1.118 1.743-.805.952-2.271 2.285l-2.076 2.035v.097h5.972v2.458z" fill="#fff"/>
                  <path fill="#E5E5E3" d="M296 20.5h208v3H296zM548 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M525.476 29.528q-1.557 0-2.771-.535-1.208-.541-1.91-1.486-.694-.951-.715-2.195h3.027q.028.521.341.917.32.389.847.604a3.1 3.1 0 0 0 1.187.216q.688 0 1.216-.243.528-.244.826-.674a1.7 1.7 0 0 0 .299-.993q0-.57-.32-1.007-.312-.444-.902-.695-.584-.25-1.389-.25h-1.327V20.98h1.327a2.9 2.9 0 0 0 1.201-.236q.528-.236.819-.653.292-.422.292-.986a1.71 1.71 0 0 0-.965-1.576 2.3 2.3 0 0 0-1.056-.23q-.61 0-1.118.223-.507.215-.812.618a1.63 1.63 0 0 0-.327.944h-2.882q.021-1.23.702-2.166.68-.938 1.833-1.466 1.16-.534 2.618-.534 1.472 0 2.577.534 1.104.535 1.715 1.445.618.903.611 2.028.007 1.194-.743 1.993-.742.798-1.938 1.014v.11q1.57.202 2.389 1.09.826.883.82 2.21a3.47 3.47 0 0 1-.702 2.159q-.7.945-1.937 1.486-1.236.542-2.833.542" fill="#fff"/>
                </svg>

                <h2 className="form-container__title">Заполните базовую информацию</h2>
                <p className="form-container__description">Укажите ваши данные и создайте пароль для входа в систему</p>

                <FormMessage 
                  message={message} 
                  type={messageType} 
                  isVisible={showMessage} 
                />

                <form className="form" onSubmit={handleDetailsSubmit}>
                  <div className="form__group">
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder=" " 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                    />
                    <label className="form__label">Имя</label>
                  </div>

                  <div className="form__group">
                    <input 
                      type="text" 
                      className="form__input" 
                      placeholder=" " 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                    />
                    <label className="form__label">Фамилия</label>
                  </div>

                  <div className="form__group">
                    <input 
                      type={passwordToggle.isVisible ? 'text' : 'password'}
                      className="form__input" 
                      placeholder=" " 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                    <label className="form__label">Пароль</label>
                    <PasswordToggle 
                      isVisible={passwordToggle.isVisible} 
                      onToggle={passwordToggle.toggle} 
                    />
                  </div>

                  <div className="form__group">
                    <input 
                      type={confirmPasswordToggle.isVisible ? 'text' : 'password'}
                      className="form__input" 
                      placeholder=" " 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                    />
                    <label className="form__label">Повторите пароль</label>
                    <PasswordToggle 
                      isVisible={confirmPasswordToggle.isVisible} 
                      onToggle={confirmPasswordToggle.toggle} 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="form__button form__button--login"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Завершение...' : 'Завершить регистрацию'}
                  </button>
                </form>

                <div className="form-container__footer">
                  <p className="form-container__text">Уже зарегистрированы?</p>
                  <button 
                    className="form__button form-container__button"
                    onClick={() => navigate('/')}
                  >
                    Войти в систему
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'success' && (
              <motion.div 
                key="success"
                className="form-container"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <svg width="548" height="44" viewBox="0 0 548 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: '32px'}}>
                  <path d="M44 22c0 12.15-9.85 22-22 22S0 34.15 0 22 9.85 0 22 0s22 9.85 22 22" fill="#4472B8"/>
                  <path d="M24.068 15.111v14.222H21.06V17.965h-.084l-3.257 2.042V17.34l3.521-2.229z" fill="#fff"/>
                  <path fill="#4472B8" d="M44 20.5h208v3H44zM296 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M268.994 29.333v-2.166l5.062-4.688q.646-.624 1.084-1.125.445-.5.673-.979.23-.486.23-1.049 0-.624-.285-1.076a1.87 1.87 0 0 0-.778-.701 2.44 2.44 0 0 0-1.118-.25q-.653 0-1.139.264a1.8 1.8 0 0 0-.75.756q-.264.494-.264 1.174h-2.854q0-1.395.632-2.424a4.2 4.2 0 0 1 1.771-1.59q1.138-.562 2.625-.562 1.527 0 2.66.541 1.139.535 1.77 1.486.633.953.632 2.181 0 .806-.319 1.59-.312.785-1.118 1.743-.805.952-2.271 2.285l-2.076 2.035v.097h5.972v2.458z" fill="#fff"/>
                  <path fill="#4472B8" d="M296 20.5h208v3H296zM548 22c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22"/>
                  <path d="M525.476 29.528q-1.557 0-2.771-.535-1.208-.541-1.91-1.486-.694-.951-.715-2.195h3.027q.028.521.341.917.32.389.847.604a3.1 3.1 0 0 0 1.187.216q.688 0 1.216-.243.528-.244.826-.674a1.7 1.7 0 0 0 .299-.993q0-.57-.32-1.007-.312-.444-.902-.695-.584-.25-1.389-.25h-1.327V20.98h1.327a2.9 2.9 0 0 0 1.201-.236q.528-.236.819-.653.292-.422.292-.986a1.71 1.71 0 0 0-.965-1.576 2.3 2.3 0 0 0-1.056-.23q-.61 0-1.118.223-.507.215-.812.618a1.63 1.63 0 0 0-.327.944h-2.882q.021-1.23.702-2.166.68-.938 1.833-1.466 1.16-.534 2.618-.534 1.472 0 2.577.534 1.104.535 1.715 1.445.618.903.611 2.028.007 1.194-.743 1.993-.742.798-1.938 1.014v.11q1.57.202 2.389 1.09.826.883.82 2.21a3.47 3.47 0 0 1-.702 2.159q-.7.945-1.937 1.486-1.236.542-2.833.542" fill="#fff"/>
                </svg>

                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginTop: '20px'}}>
                  <circle cx="25" cy="25" r="20.833" fill="#EDFFC6"/>
                  <path d="M25 18.055a6.945 6.945 0 1 0 0 13.89 6.945 6.945 0 0 0 0-13.89M16.32 25a8.68 8.68 0 1 1 17.361 0 8.68 8.68 0 0 1-17.361 0m12.73-2.819c.358.319.39.867.071 1.226l-4.63 5.208a.868.868 0 0 1-1.297 0L20.88 26.01a.868.868 0 1 1 1.298-1.154l1.666 1.875 3.98-4.479a.87.87 0 0 1 1.226-.072" fill="#72AA0C"/>
                </svg>

                <h2 className="form-container__title">Поздравляем!</h2>
                <p className="form-container__description">Регистрация прошла успешно!</p>
                <p className="form-container__description" style={{marginBottom: '30px'}}>Перейдите в личный кабинет, чтобы пройти верификацию личности и получить доступ ко всем функциям платформы.</p>

                <button 
                  className="form__button form__button--login"
                  onClick={() => navigate('/dashboard')}
                  style={{marginBottom: '20px'}}
                >
                  Перейти в личный кабинет
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Registration;
