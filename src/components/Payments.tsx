import React, { useEffect } from 'react';
import Header from './Header';
import LeftSidebar from './LeftSidebar';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSidebar } from '../contexts/SidebarContext';
import '../css/left-sidebar.css';
import '../css/homepage.css';

const Payments: React.FC = () => {
  const currentUser = useCurrentUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(245, 245, 245)';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleGetPremium = () => {
    alert('Функция получения премиум подписки будет реализована в ближайшее время');
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
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#0F53FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Добавление неограниченного количества грузов и транспорта
                      </li>
                      <li>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.667 5L7.5 14.167 3.333 10" stroke="#0F53FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                      Получить Premium
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

export default Payments;
