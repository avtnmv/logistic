import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import FormMessage from './FormMessage';
import PasswordToggle from './PasswordToggle';
import { getGlobalTestDB, logTestData, isUserRegistered, registerUser, saveUsersToStorage, updateUserInDB } from '../data/testData';
import { usePasswordToggle } from '../hooks/usePasswordToggle';
import { verificationService } from '../services/verificationService';
import '../css/login.css';

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'phone' | 'code' | 'details' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [codeInputs, setCodeInputs] = useState(['', '', '', '']);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [showMessage, setShowMessage] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState<boolean | null>(null);
  const [countdown, setCountdown] = useState(0);

  const passwordToggle = usePasswordToggle();
  const confirmPasswordToggle = usePasswordToggle();

  const testDB = getGlobalTestDB();

  React.useEffect(() => {
    logTestData('ТЕСТОВЫЕ ДАННЫЕ ДЛЯ РЕГИСТРАЦИИ');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

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

    if (isUserRegistered(phone, testDB)) {
      showFormMessage('Пользователь с этим номером уже зарегистрирован', 'info');
      return;
    }

    try {
      showFormMessage('Отправляем код...', 'info');
      
      const result = await verificationService.sendCode({ phone });
      
      if (result.success) {
        showFormMessage(result.message, 'success');
        setCurrentStep('code');
        setCountdown(30);
        
        if (result.code) {
          console.log(result.code);
        }
      } else {
        showFormMessage(result.message, 'error');
      }
    } catch (error) {
      console.error('Ошибка отправки кода:', error);
      showFormMessage('Произошла ошибка при отправке кода. Попробуйте еще раз.', 'error');
    }
  };

  const showFormMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setShowMessage(true);
    
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = codeInputs.join('');
    
    if (code.length !== 4) {
      showFormMessage('Введите полный 4-значный код', 'error');
      return;
    }
    
    if (!/^\d{4}$/.test(code)) {
      showFormMessage('Код должен состоять только из цифр', 'error');
      return;
    }
    
    const result = verificationService.verifyCode(phone, code);
    
    if (result.success) {
      setIsCodeCorrect(true);
      showFormMessage(result.message, 'success');
      
      const tempPassword = 'Temp' + Math.random().toString(36).substring(2, 8) + '!';
      registerUser(phone, tempPassword, testDB);
      
      setTimeout(() => {
        setCurrentStep('details');
        setIsCodeCorrect(null);
      }, 1000);
    } else {
      setIsCodeCorrect(false);
      showFormMessage(result.message, 'error');
      setCodeInputs(['', '', '', '']);
      setTimeout(() => {
        setIsCodeCorrect(null);
      }, 2000);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
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
    
    testDB.users[phone].password = password;
    testDB.users[phone].firstName = firstName;
    testDB.users[phone].lastName = lastName;
    
    saveUsersToStorage(testDB.users);
    
    updateUserInDB(phone, testDB.users[phone]);
    
    localStorage.removeItem('CLEARED_ALL_DATA');
    
    const newUser = testDB.users[phone];
    if (newUser) {
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        phone: phone,
        firstName: firstName,
        lastName: lastName
      }));
    }
    
    showFormMessage('Данные сохранены!', 'success');
    
    setTimeout(() => {
      setCurrentStep('success');
    }, 1000);
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    try {
      showFormMessage('Повторно отправляем код...', 'info');
      
      const result = await verificationService.sendCode({ phone });
      
      if (result.success) {
        showFormMessage('Код был повторно отправлен на ваш номер телефона', 'success');
        setCountdown(30);
        
        if (result.code) {
          console.log(result.code);
        }
      } else {
        showFormMessage(result.message, 'error');
      }
    } catch (error) {
      console.error('Ошибка повторной отправки кода:', error);
      showFormMessage('Произошла ошибка при повторной отправке кода. Попробуйте еще раз.', 'error');
    }
  };

  const handleChangePhone = () => {
    setCurrentStep('phone');
    setPhone('');
    setCodeInputs(['', '', '', '']);
    setCountdown(0);
    setIsCodeCorrect(null);
  };

  const handleCodeInputChange = (index: number, value: string) => {
    const newInputs = [...codeInputs];
    newInputs[index] = value;
    setCodeInputs(newInputs);
    
    if (value && index < 3) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && codeInputs[index] === '' && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
        const newInputs = [...codeInputs];
        newInputs[index - 1] = '';
        setCodeInputs(newInputs);
      }
    }
    
    if (e.key === 'Backspace' && codeInputs[index] !== '') {
      if (e.repeat) {
        setCodeInputs(['', '', '', '']);
        const firstInput = document.querySelector(`input[data-index="0"]`) as HTMLInputElement;
        if (firstInput) firstInput.focus();
        e.preventDefault();
      }
    }
    
    if (e.key === 'Backspace' && index === 0 && codeInputs[index] === '') {
      setCodeInputs(['', '', '', '']);
      e.preventDefault();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    
    if (/^\d{4}$/.test(pastedData)) {
      const newInputs = pastedData.split('');
      setCodeInputs([...newInputs, '', '', '', ''].slice(0, 4));
    }
  };

  return (
    <>
      <Header />
      
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

                  <button type="submit" className="form__button form__button--login">
                    Зарегистрироваться
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
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        autoComplete="off"
                      />
                    ))}
                  </div>

                  <div className="form-buttons">
                    <button type="submit" className="form__button form__button--login">
                      Подтвердить
                    </button>
                    <button 
                      type="button" 
                      className="form__button form__button--secondary"
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `Отправить код ещё раз (${countdown}s)` : 'Отправить код ещё раз'}
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

                  <button type="submit" className="form__button form__button--login">
                    Завершить регистрацию
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
