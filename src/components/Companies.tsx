import React from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSidebar } from '../contexts/SidebarContext';
import '../css/left-sidebar.css';
import '../css/homepage.css';

const Companies: React.FC = () => {
  const currentUser = useCurrentUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  React.useEffect(() => {
    document.body.style.backgroundColor = 'rgb(245, 245, 245)';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleAddBusiness = () => {
  };

  const handleGetPremium = () => {
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
                    <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="homepage-form-header-content">
                  <h2>Создайте бизнес-профиль</h2>
                  <p>Работаете от имени компании? Создайте бизнес-профиль и получите расширенные возможности.</p>
                </div>
              </div>
              
              <div className="companies-content">
                <div className="companies-blocks-row">
                  <div className="companies-block">
                    <div className="companies-block-header">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" fill="#3B82F6"/>
                      </svg>
                      <h3>Название компании</h3>
                    </div>
                    <p>Теперь вы можете добавить до 5 сотрудников в свою компанию для совместной работы.</p>
                  </div>

                  <div className="companies-block">
                    <div className="companies-block-header">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#10B981"/>
                      </svg>
                      <h3>Повышайте доверие</h3>
                    </div>
                    <p>Обычно клиенты доверяют компаниям больше, чем частным лицам.</p>
                  </div>
                </div>

                <div className="companies-actions">
                  <button className="btn btn-primary companies-btn" onClick={handleAddBusiness}>
                    Добавить бизнес
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="homepage-form-container">
            <div className="homepage-form-content">
              <div className="homepage-form-header-block">
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
        </div>
      </div>
    </>
  );
};

export default Companies;
