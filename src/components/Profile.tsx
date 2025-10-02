import React, { useEffect, useState } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSidebar } from '../contexts/SidebarContext';
import VerificationForm, { VerificationFormData } from './VerificationForm';
import NotificationModal from './NotificationModal';
import documentVerificationService, { VerificationStatus } from '../services/documentVerificationService';
import '../css/left-sidebar.css';
import '../css/homepage.css';

const Profile: React.FC = () => {
  const currentUser = useCurrentUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [userLocation, setUserLocation] = useState<string>('Определяется...');
  const [registrationDate, setRegistrationDate] = useState<string>('');
  const [showVerificationForm, setShowVerificationForm] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [notificationData, setNotificationData] = useState<{
    isOpen: boolean;
    status: 'approved' | 'rejected';
    notes?: string;
    verificationId: string;
  }>({
    isOpen: false,
    status: 'approved',
    verificationId: ''
  });

  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(245, 245, 245)';
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (latitude > 35 && latitude < 45 && longitude > 55 && longitude < 75) {
            setUserLocation('Узбекистан');
          } else if (latitude > 45 && latitude < 55 && longitude > 20 && longitude < 40) {
            setUserLocation('Украина');
          } else if (latitude > 45 && latitude < 55 && longitude > 25 && longitude < 45) {
            setUserLocation('Молдова');
          } else {
            setUserLocation('Не определено');
          }
        },
        () => {
          setUserLocation('Не определено');
        }
      );
    } else {
      setUserLocation('Не поддерживается');
    }

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.createdAt) {
          setRegistrationDate(new Date(user.createdAt).toLocaleDateString('en-US'));
        } else {
          setRegistrationDate(new Date().toLocaleDateString('en-US'));
        }
      } catch (e) {
        setRegistrationDate(new Date().toLocaleDateString('en-US'));
      }
    }

    return () => {
      document.body.style.backgroundColor = 'white';
    };
  }, []);

  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (currentUser?.id) {
        const status = await documentVerificationService.getVerificationStatus(currentUser.id);
        if (status) {
          setVerificationStatus(status.status);
          if (status.status === 'rejected' && status.notes) {
            setRejectionReason(status.notes);
          } else {
            setRejectionReason('');
          }
        } else {
          setVerificationStatus('none');
          setRejectionReason('');
        }
      } else {
        setVerificationStatus('none');
        setRejectionReason('');
      }
    };
    
    checkVerificationStatus();
  }, [currentUser?.id]);

  useEffect(() => {
    const checkForNotifications = async () => {
      if (currentUser?.id) {
        const notification = await documentVerificationService.checkForNewNotifications(currentUser.id);
        if (notification) {
          setNotificationData({
            isOpen: true,
            status: notification.status as 'approved' | 'rejected',
            notes: notification.notes,
            verificationId: notification.id
          });
        }
      }
    };
    
    checkForNotifications();
  }, [currentUser?.id]);

  const handleGetPremium = () => {
    alert('Функция получения премиум-доступа будет доступна в ближайшее время!');
  };

  const handleVerification = () => {
    setShowVerificationForm(true);
  };

  const handleVerificationSubmit = async (formData: VerificationFormData) => {
    try {
      if (!currentUser?.id) {
        alert('Ошибка: пользователь не найден');
        return;
      }

      const response = await documentVerificationService.submitVerification(currentUser.id, formData);
      
      if (response.success) {
        const updatedStatus = await documentVerificationService.getVerificationStatus(currentUser.id);
        if (updatedStatus) {
          setVerificationStatus(updatedStatus.status);
        } else {
          setVerificationStatus('pending');
        }
        setShowVerificationForm(false);
      } else {
        alert(`Ошибка: ${response.message}`);
      }
    } catch (error) {
      console.error('Ошибка при отправке верификации:', error);
      alert('Произошла ошибка при отправке документов. Попробуйте еще раз.');
    }
  };

  const handleVerificationClose = () => {
    setShowVerificationForm(false);
  };

  const handleNotificationClose = async () => {
    if (notificationData.verificationId) {
      await documentVerificationService.markNotificationAsShown(notificationData.verificationId);
    }
    setNotificationData({
      isOpen: false,
      status: 'approved',
      verificationId: ''
    });
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
              <div className="homepage-form-header-block">
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Пройдите верификацию и выделяйтесь</h2>
                  <p>Верификация не обязательна — вы можете пользоваться платформой и без неё. Но проверенные участники получают значок доверия и приоритет у других пользователей.</p>
                </div>
              </div>
              
              <div className="verification-blocks-row verification-blocks-spacing">
                <div className="verification-block">
                  <div className="verification-block-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="12" fill="#EDFFC6"/>
                      <path d="M12 5.667c.253 0 .483.143.597.369l1.719 3.438 3.78.55a.667.667 0 0 1 .37 1.137l-2.752 2.683.62 3.782a.667.667 0 0 1-.971.697L12 16.538l-3.362 1.785a.667.667 0 0 1-.97-.697l.618-3.782-2.751-2.683a.667.667 0 0 1 .37-1.137l3.78-.55 1.719-3.438A.67.67 0 0 1 12 5.667m0 2.157-1.278 2.558a.67.67 0 0 1-.5.361l-2.79.406 2.034 1.982c.155.152.227.37.192.585L9.2 16.515l2.488-1.32a.67.67 0 0 1 .625 0l2.487 1.32-.458-2.799a.67.67 0 0 1 .193-.585l2.033-1.982-2.789-.406a.67.67 0 0 1-.5-.361z" fill="#72AA0C"/>
                    </svg>
                    <h3>Получите значок «Верифицирован»</h3>
                  </div>
                  <p>Верификация не обязательна — вы можете пользоваться платформой и без неё. Но проверенные участники получают значок доверия и приоритет у других пользователей.</p>
                </div>

                <div className="verification-block">
                  <div className="verification-block-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="12" fill="#EDFFC6"/>
                      <path d="M12 5.667c.253 0 .483.143.597.369l1.719 3.438 3.78.55a.667.667 0 0 1 .37 1.137l-2.752 2.683.62 3.782a.667.667 0 0 1-.971.697L12 16.538l-3.362 1.785a.667.667 0 0 1-.97-.697l.618-3.782-2.751-2.683a.667.667 0 0 1 .37-1.137l3.78-.55 1.719-3.438A.67.67 0 0 1 12 5.667m0 2.157-1.278 2.558a.67.67 0 0 1-.5.361l-2.79.406 2.034 1.982c.155.152.227.37.192.585L9.2 16.515l2.488-1.32a.67.67 0 0 1 .625 0l2.487 1.32-.458-2.799a.67.67 0 0 1 .193-.585l2.033-1.982-2.789-.406a.67.67 0 0 1-.5-.361z" fill="#72AA0C"/>
                    </svg>
                    <h3>Приоритет в поиске и сделках</h3>
                  </div>
                  <p>В фильтрах заказов есть пункт «Только верифицированные». Вы будете попадать под этот фильтр, что увеличит шансы, что выберут именно ваш заказ.</p>
                </div>
              </div>
              
              <div className="verification-actions">
                {verificationStatus === 'none' && (
                  <button className="btn btn-primary verification-btn" onClick={handleVerification}>
                    Пройти верификацию
                  </button>
                )}
                {verificationStatus === 'pending' && (
                  <div className="verification-pending">
                    <div className="verification-pending-content">
                      <div className="verification-pending-text">
                        <h4>Документы на рассмотрении</h4>
                        <p>Мы проверяем ваши документы. Это может занять 1-3 рабочих дня.</p>
                        <div className="progress-bar">
                          <div className="progress-fill"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {verificationStatus === 'approved' && (
                  <div className="verification-approved">
                    <div className="verification-approved-content">
                      <div className="verification-approved-text">
                        <h4>Верификация пройдена успешно!</h4>
                        <p>Поздравляем! Ваша верификация подтверждена. Теперь вы можете пользоваться всеми преимуществами проверенного аккаунта.</p>
                      </div>
                    </div>
                  </div>
                )}
                {verificationStatus === 'rejected' && (
                  <div className="verification-rejected">
                    <div className="verification-rejected-content">
                      <div className="verification-rejected-text">
                        <h4>Верификация отклонена</h4>
                        {rejectionReason && (
                          <div className="rejection-reason">
                            <p><strong>Причина:</strong> {rejectionReason}</p>
                          </div>
                        )}
                        <p>Пожалуйста, исправьте указанные ошибки и повторите попытку.</p>
                      </div>
                    </div>
                    <button className="btn btn-primary verification-btn" onClick={handleVerification}>
                      Повторить верификацию
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {showVerificationForm && (
            <VerificationForm
              onClose={handleVerificationClose}
              onSubmit={handleVerificationSubmit}
              isInline={true}
            />
          )}

          <div className="homepage-form-container">
            <div className="homepage-form-content">
              <div className="homepage-form-header-block">
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Получить полный доступ</h2>
                  <p>Получите полный доступ к информации с нашим безлимитным пакетом — всего 9.99 USD в месяц</p>
                </div>
              </div>
              
              <div className="premium-section">
                <div className="premium-info">
                  <div className="premium-package">
                    <div className="premium-title">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="60" height="60" rx="5" fill="#fff"/>
                        <path d="M20.667 40.667V38h18.667v2.667zm0-4.667-1.7-10.7a1 1 0 0 0-.15.018.7.7 0 0 1-.15.016 1.93 1.93 0 0 1-1.416-.584 1.94 1.94 0 0 1-.584-1.416q0-.833.584-1.416a1.93 1.93 0 0 1 1.416-.584q.83 0 1.417.584.587.583.583 1.416 0 .233-.05.433a3 3 0 0 1-.117.367L24.667 26l4.167-5.7a2.05 2.05 0 0 1-.6-.7 1.94 1.94 0 0 1-.234-.933q0-.834.584-1.417.585-.585 1.416-.583a1.94 1.94 0 0 1 1.418.584q.585.582.582 1.416 0 .5-.233.933a2.05 2.05 0 0 1-.6.7l4.167 5.7 4.166-1.866a3 3 0 0 1-.117-.367 1.7 1.7 0 0 1-.05-.433q0-.834.585-1.418.584-.583 1.416-.582a1.94 1.94 0 0 1 1.417.584q.585.582.583 1.416a1.95 1.95 0 0 1-.583 1.417q-.581.585-1.417.583a1 1 0 0 1-.15-.016 1 1 0 0 0-.15-.018l-1.7 10.7z" fill="#0F53FA"/>
                      </svg>
                      <div className="premium-title-content">
                        <h3>Yangi Osiyo Premium</h3>
                        <p>Полный доступ к всей информации в одном пакете</p>
                      </div>
                    </div>
                    <ul>
                      <li>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#EDFFC6"/>
                          <path d="M17.7763 7.50141C18.0514 7.74602 18.0762 8.1674 17.8316 8.44259L10.7205 16.4426C10.594 16.5849 10.4127 16.6663 10.2222 16.6663C10.0318 16.6663 9.85047 16.5849 9.72396 16.4426L6.1684 12.4426C5.92379 12.1674 5.94858 11.746 6.22376 11.5014C6.49895 11.2568 6.92033 11.2816 7.16495 11.5568L10.2222 14.9962L16.8351 7.55677C17.0797 7.28158 17.5011 7.2568 17.7763 7.50141Z" fill="#72AA0C"/>
                        </svg>
                        Добавление неограниченного количества грузов и транспорта
                      </li>
                      <li>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="12" fill="#EDFFC6"/>
                          <path d="M17.7763 7.50141C18.0514 7.74602 18.0762 8.1674 17.8316 8.44259L10.7205 16.4426C10.594 16.5849 10.4127 16.6663 10.2222 16.6663C10.0318 16.6663 9.85047 16.5849 9.72396 16.4426L10.7222 14.9962L16.8351 7.55677C17.0797 7.28158 17.5011 7.2568 17.7763 7.50141Z" fill="#72AA0C"/>
                        </svg>
                        Доступ к детальной информации о грузах и транспорте (включено 3 пользователя для бизнес-аккаунта)
                      </li>
                    </ul>
                  </div>
                  
                  <div className="premium-pricing">
                    <div className="price-block">
                      <div className="price">9.99$/месяц</div>
                      <p className="price-note">*Платёж будет списываться автоматически каждый месяц. Отменить подписку можно в любой момент.</p>
                    </div>
                    <button className="btn btn-primary premium-btn" onClick={handleGetPremium}>
                      Получить премиум
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        
          <div className="homepage-form-container">
            <div className="homepage-form-content">
              <div className="homepage-form-header-block">
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Общая информация</h2>
                  <p>Здесь отображается основная информация о вашем профиле. Эти данные видны другим пользователям.</p>
                </div>
              </div>
              
              <div className="general-info-content">
                <div className="user-profile-section">
                  <div className="user-avatar">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#3796F8"/>
                    </svg>
                  </div>
                  <div className="user-details">
                    <div className="user-name-section">
                      <h3>{currentUser?.firstName ? currentUser.firstName.toUpperCase() : 'НЕ УКАЗАНО'} {currentUser?.lastName ? currentUser.lastName.toUpperCase() : ''}</h3>
                    </div>
                    <div className="user-info-row">
                      <span className="user-location">Местоположение: {userLocation}</span>
                      <span className="user-registration">Дата регистрации: {registrationDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="homepage-form-container">
            <div className="homepage-form-content">
              <div className="homepage-form-header-block">
                <div className="homepage-form-header-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" color="#000000" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Контактная информация</h2>
                  <p>Основной E-mail используется для входа на сайт, а также для получения важных сообщений на почту.</p>
                </div>
              </div>
              
              <div className="contact-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Телефон</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={currentUser?.phone || ''} 
                      readOnly 
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>E-mail</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={currentUser?.email || ''} 
                      placeholder="Не указан"
                      readOnly 
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-field">
                    <label>Имя</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={currentUser?.firstName || ''} 
                      placeholder="Не указано"
                      readOnly 
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Фамилия</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={currentUser?.lastName || ''} 
                      placeholder="Не указано"
                      readOnly 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={notificationData.isOpen}
        onClose={handleNotificationClose}
        status={notificationData.status}
        notes={notificationData.notes}
        verificationId={notificationData.verificationId}
      />
    </>
  );
};

export default Profile;
