import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import FormMessage from './FormMessage';
import PasswordToggle from './PasswordToggle';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSidebar } from '../contexts/SidebarContext';
import '../css/left-sidebar.css';
import '../css/homepage.css';
import { getGlobalTestDB, updateUserEmail } from '../data/testData';

const Security: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [messageVisible, setMessageVisible] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordToggles, setPasswordToggles] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(245, 245, 245)';
    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }
  }, [currentUser?.email]);

  const validateEmail = (value: string) => {
    const re = /^(?:[a-zA-Z0-9_'^&+\-])+(?:\.(?:[a-zA-Z0-9_'^&+\-])+)*@(?:(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})$/;
    return re.test(value);
  };

  const handleSendCode = () => {
    if (!email.trim()) {
      setMessage('Пожалуйста, укажите E-mail');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }

    if (!validateEmail(email.trim())) {
      setMessage('Некорректный E-mail. Проверьте адрес и попробуйте снова.');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }

    const db = getGlobalTestDB();
    const normalized = email.trim().toLowerCase();
    const isTaken = Object.values(db.users).some(u => (u.email || '').toLowerCase() === normalized && u.phone !== currentUser?.phone);
    if (isTaken) {
      setMessage('Этот E-mail уже используется другим аккаунтом. Укажите другой адрес.');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(code);
    console.log(code);
    setMessage(`Код подтверждения отправлен на ${email}`);
    setMessageType('success');
    setMessageVisible(true);
    setIsCodeSent(true);
  };

  const handleChangePassword = () => {
    setShowPasswordForm(true);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordToggles(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Пароль должен содержать минимум 6 символов';
    }
    if (password.length > 50) {
      return 'Пароль не должен превышать 50 символов';
    }
    if (!/[A-Za-z]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну букву';
    }
    if (!/[0-9]/.test(password)) {
      return 'Пароль должен содержать хотя бы одну цифру';
    }
    return null;
  };

  const validateCurrentPassword = (password: string) => {

    const db = getGlobalTestDB();
    if (currentUser?.phone) {
      const user = db.users[currentUser.phone];
      if (user && user.password !== password) {
        return 'Неверный текущий пароль';
      }
    }
    return null;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    

    setMessageVisible(false);
    

    if (!currentPassword.trim()) {
      setMessage('Введите текущий пароль');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }


    const currentPasswordError = validateCurrentPassword(currentPassword);
    if (currentPasswordError) {
      setMessage(currentPasswordError);
      setMessageType('error');
      setMessageVisible(true);
      return;
    }


    if (!newPassword.trim()) {
      setMessage('Введите новый пароль');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }


    if (currentPassword === newPassword) {
      setMessage('Новый пароль должен отличаться от текущего');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }


    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setMessage(passwordError);
      setMessageType('error');
      setMessageVisible(true);
      return;
    }


    if (!confirmPassword.trim()) {
      setMessage('Подтвердите новый пароль');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Пароли не совпадают');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }


    try {
      const db = getGlobalTestDB();
      if (currentUser?.phone) {
        const user = db.users[currentUser.phone];
        if (user) {
          user.password = newPassword;

          const storedUser = localStorage.getItem('currentUser');
          if (storedUser) {
            try {
              const u = JSON.parse(storedUser);
              localStorage.setItem('currentUser', JSON.stringify({ ...u, password: newPassword }));
            } catch (e) {
              console.error('Ошибка обновления localStorage:', e);
            }
          }
          
          setMessage('Пароль успешно изменен');
          setMessageType('success');
          setMessageVisible(true);
          

          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setShowPasswordForm(false);
        } else {
          setMessage('Ошибка: пользователь не найден');
          setMessageType('error');
          setMessageVisible(true);
        }
      } else {
        setMessage('Ошибка: не удалось определить пользователя');
        setMessageType('error');
        setMessageVisible(true);
      }
    } catch (error) {
      console.error('Ошибка при смене пароля:', error);
      setMessage('Произошла ошибка при смене пароля. Попробуйте еще раз.');
      setMessageType('error');
      setMessageVisible(true);
    }
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'currentPassword':
        if (!value.trim()) {
          return 'Введите текущий пароль';
        }
        return validateCurrentPassword(value);
      
      case 'newPassword':
        if (!value.trim()) {
          return 'Введите новый пароль';
        }
        if (currentPassword && value === currentPassword) {
          return 'Новый пароль должен отличаться от текущего';
        }
        return validatePassword(value);
      
      case 'confirmPassword':
        if (!value.trim()) {
          return 'Подтвердите новый пароль';
        }
        if (newPassword && value !== newPassword) {
          return 'Пароли не совпадают';
        }
        return '';
      
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {

    switch (field) {
      case 'currentPassword':
        setCurrentPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }

    const error = validateField(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));


    if (field === 'confirmPassword' && newPassword) {
      const confirmError = value !== newPassword ? 'Пароли не совпадают' : '';
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }


    if (field === 'newPassword' && confirmPassword) {
      const confirmError = confirmPassword !== value ? 'Пароли не совпадают' : '';
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleCancelPasswordChange = () => {
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordToggles({
      current: false,
      new: false,
      confirm: false
    });
    setFieldErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleConfirmEmail = () => {
    if (!verificationCode.trim()) {
      setMessage('Введите код подтверждения');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }

    if (verificationCode !== generatedCode) {
      setMessage('Неверный код. Попробуйте еще раз.');
      setMessageType('error');
      setMessageVisible(true);
      return;
    }

    const db = getGlobalTestDB();
    if (currentUser?.phone) {
      updateUserEmail(currentUser.phone, email, db);
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const u = JSON.parse(storedUser);
          localStorage.setItem('currentUser', JSON.stringify({ ...u, email }));
        } catch (e) {}
      }
      setMessage('E-mail подтвержден и сохранен.');
      setMessageType('success');
      setMessageVisible(true);
      setIsCodeSent(false);
      setVerificationCode('');
    }
  };

  return (
    <>
      <Header />
      <div className="homepage-container container">
        <LeftSidebar 
          currentUser={currentUser}
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <div className="homepage-content">
          <div className="homepage-form-container">
            <div className="homepage-form-content">
              <div className="homepage-form-header-block" style={{ marginBottom: '16px' }}>
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M12 22C12 22 20 16 20 10V5L12 2L4 5V10C4 16 12 22 12 22Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Хотите добавить E-mail?</h2>
                  <p>Основной номер телефона используется для входа в систему. После добавления E-mail вы также сможете использовать его для входа и получения важных уведомлений.</p>
                </div>
              </div>
              <div className="form-section">
                {currentUser?.email && !isEditingEmail ? (
                  <div className="form-row email-form-row">
                    <div className="form-field" style={{ maxWidth: '405px' }}>
                      <label>E-mail</label>
                      <input type="email" className="form-input" value={currentUser.email} readOnly />
                    </div>
                    <div className="form-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <button className="submit-transport-btn" onClick={() => { setIsEditingEmail(true); setIsCodeSent(false); setVerificationCode(''); }}>Изменить почту</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="form-row email-form-row">
                      <div className="form-field" style={{ maxWidth: '405px' }}>
                        <label>E-mail</label>
                        <input 
                          type="email" 
                          className="form-input" 
                          placeholder="example@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <div style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
                          На указанный адрес будет отправлен код подтверждения. Используйте его для завершения добавления почты.
                        </div>
                      </div>
                      <div className="form-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button className="submit-cargo-btn" onClick={handleSendCode}>Отправить код</button>
                      </div>
                    </div>

                    {isCodeSent && (
                      <div className="form-row email-form-row" style={{ marginTop: '16px' }}>
                        <div className="form-field" style={{ maxWidth: '405px' }}>
                          <label>Введите код</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="4-значный код" 
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                          />
                        </div>
                        <div className="form-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
                          <button className="submit-transport-btn" onClick={handleConfirmEmail}>Подтвердить</button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <FormMessage message={message} type={messageType} isVisible={messageVisible} />
              </div>
            </div>
          </div>

          <div className="homepage-form-container">
            <div className="homepage-form-content">
              <h3>Хотите сменить пароль?</h3>
              <p style={{ marginTop: '8px' }}>
                Пароли хранятся в зашифрованном виде, поэтому мы не можем отобразить их в настройках. Если вы хотите изменить пароль, нажмите «Сменить пароль».
              </p>

              {!showPasswordForm ? (
                <div style={{ marginTop: '16px' }}>
                  <button className="submit-transport-btn" onClick={handleChangePassword}>Сменить пароль</button>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="form-section" style={{ marginTop: '16px' }}>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Текущий пароль</label>
                      {fieldErrors.currentPassword && (
                        <div className="error-message" style={{ marginBottom: '4px', fontSize: '12px', color: '#e53e3e' }}>
                          {fieldErrors.currentPassword}
                        </div>
                      )}
                      <div style={{ position: 'relative' }}>
                        <input
                          type={passwordToggles.current ? 'text' : 'password'}
                          className={`form-input ${fieldErrors.currentPassword ? 'form-input--error' : ''}`}
                          placeholder="Введите текущий пароль"
                          value={currentPassword}
                          onChange={(e) => handleFieldChange('currentPassword', e.target.value)}
                          style={{ paddingRight: '50px' }}
                        />
                        <PasswordToggle
                          isVisible={passwordToggles.current}
                          onToggle={() => togglePasswordVisibility('current')}
                          className="password-toggle--inline"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Новый пароль</label>
                      {fieldErrors.newPassword && (
                        <div className="error-message" style={{ marginBottom: '4px', fontSize: '12px', color: '#e53e3e' }}>
                          {fieldErrors.newPassword}
                        </div>
                      )}
                      <div style={{ position: 'relative' }}>
                        <input
                          type={passwordToggles.new ? 'text' : 'password'}
                          className={`form-input ${fieldErrors.newPassword ? 'form-input--error' : ''}`}
                          placeholder="Введите новый пароль"
                          value={newPassword}
                          onChange={(e) => handleFieldChange('newPassword', e.target.value)}
                          style={{ paddingRight: '50px' }}
                        />
                        <PasswordToggle
                          isVisible={passwordToggles.new}
                          onToggle={() => togglePasswordVisibility('new')}
                          className="password-toggle--inline"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Подтвердите новый пароль</label>
                      {fieldErrors.confirmPassword && (
                        <div className="error-message" style={{ marginBottom: '4px', fontSize: '12px', color: '#e53e3e' }}>
                          {fieldErrors.confirmPassword}
                        </div>
                      )}
                      <div style={{ position: 'relative' }}>
                        <input
                          type={passwordToggles.confirm ? 'text' : 'password'}
                          className={`form-input ${fieldErrors.confirmPassword ? 'form-input--error' : ''}`}
                          placeholder="Повторите новый пароль"
                          value={confirmPassword}
                          onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                          style={{ paddingRight: '50px' }}
                        />
                        <PasswordToggle
                          isVisible={passwordToggles.confirm}
                          onToggle={() => togglePasswordVisibility('confirm')}
                          className="password-toggle--inline"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field" style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" className="submit-transport-btn">Изменить пароль</button>
                      <button type="button" className="submit-cargo-btn" onClick={handleCancelPasswordChange}>Отмена</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;


