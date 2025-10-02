import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../data/testData';

interface LeftSidebarProps {
  currentUser: { id: string; firstName?: string; lastName?: string; phone?: string } | null;
  isOpen?: boolean;
  onClose?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentUser, isOpen = false, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay sidebar-overlay--visible" onClick={onClose} />
      )}
      
      <aside className={`left-sidebar ${isOpen ? 'left-sidebar--open' : ''}`}>
      <nav className="left-sidebar__nav">
        <div className="left-sidebar__section">
          <Link 
            to="/search-orders" 
            className={`left-sidebar__item ${isActive('/search-orders') ? 'left-sidebar__item--active' : ''}`}
          >
            <div className="left-sidebar__item-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m15 15 1.5 1.5m.433 2.525a1.48 1.48 0 1 1 2.092-2.092l2.042 2.042a1.48 1.48 0 1 1-2.092 2.092zM16.5 9.5a7 7 0 1 0-14 0 7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Поиск заказов</span>
          </Link>

          <Link 
            to="/profile" 
            className={`left-sidebar__item ${isActive('/profile') ? 'left-sidebar__item--active' : ''}`}
          >
            <div className="left-sidebar__item-icon">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 6a6 6 0 1 1 12 0A6 6 0 0 1 3 6m2 10a3 3 0 0 0-3 3 1 1 0 1 1-2 0 5 5 0 0 1 5-5h8a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3z" fill="currentColor"/>
              </svg>
            </div>
            <span>Профиль</span>
          </Link>

          <Link 
            to="/companies" 
            className={`left-sidebar__item ${isActive('/companies') ? 'left-sidebar__item--active' : ''}`}
          >
            <div className="left-sidebar__item-icon">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3h-3V2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H3a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3M8 2h4v1H8zm10 13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9.39L6.68 11q.16.021.32 0h6q.163-.003.32-.05L18 9.39zm0-7.72L12.84 9H7.16L2 7.28V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z" fill="currentColor"/>
              </svg>
            </div>
            <span>Компании</span>
          </Link>



          <Link 
            to="/payments" 
            className={`left-sidebar__item ${isActive('/payments') ? 'left-sidebar__item--active' : ''}`}
          >
            <div className="left-sidebar__item-icon">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2zm-2 2H2V2h16zM2 7h16v7H2z" fill="currentColor"/>
              </svg>
            </div>
            <span>Платежи</span>
          </Link>

          <button 
            className={`left-sidebar__item ${location.pathname === '/homepage' && !location.search ? 'left-sidebar__item--active' : ''}`}
            onClick={() => {
              navigate('/homepage');
              if (onClose) onClose();
            }}
          >
            <div className="left-sidebar__item-icon">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 0a2 2 0 0 1 2 2v1h1.52a2 2 0 0 1 1.561.75l1.48 1.851A2 2 0 0 1 20 6.851V11a2 2 0 0 1-2 2 3 3 0 0 1-6 0H8a3 3 0 0 1-6 0 2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M13 2H2v9h.764a2.996 2.996 0 0 1 4.341-.138l.131.138h5.528l.115-.121.121-.115zm3.52 3H15v5c.82 0 1.563.33 2.105.862l.131.138H18V6.85z" fill="currentColor"/>
              </svg>
            </div>
            <span>Мои перевозки</span>
            <span className="left-sidebar__item-count">
              {(() => {
                if (!currentUser?.id) return 0;
                
                const storageKey = `transportCards_${currentUser.id}`;
                const userCards = JSON.parse(localStorage.getItem(storageKey) || '[]');
                return userCards.length;
              })()}
            </span>
          </button>
        </div>

        <div className="left-sidebar__section">
          <button 
            className={`left-sidebar__button left-sidebar__button--add-cargo ${location.pathname === '/homepage' && location.search === '?form=cargo' ? 'left-sidebar__button--active' : ''}`} 
            onClick={() => {
              navigate('/homepage?form=cargo');
              if (onClose) onClose();
            }}
          >
            <div className="left-sidebar__button-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Добавить груз</span>
          </button>

          <button 
            className={`left-sidebar__button left-sidebar__button--add-transport ${location.pathname === '/homepage' && location.search === '?form=transport' ? 'left-sidebar__button--active' : ''}`} 
            onClick={() => {
              navigate('/homepage?form=transport');
              if (onClose) onClose();
            }}
          >
            <div className="left-sidebar__button-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Добавить транспорт</span>
          </button>
        </div>

        <hr className="left-sidebar__divider" />

        <div className="left-sidebar__section">
          <Link 
            to="/security" 
            className={`left-sidebar__item ${isActive('/security') ? 'left-sidebar__item--active' : ''}`}
          >
            <div className="left-sidebar__item-icon">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2c1.648 0 3 1.352 3 3v3H5V5c0-1.648 1.352-3 3-3m5 6V5c0-2.752-2.248-5-5-5S3 2.248 3 5v3H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM2 10h12v8H2z" fill="currentColor"/>
              </svg>
            </div>
            <span>Безопасность</span>
          </Link>

          <Link 
            to="/help" 
            className={`left-sidebar__item ${isActive('/help') ? 'left-sidebar__item--active' : ''}`}
          >
            <div className="left-sidebar__item-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16M0 10C0 4.477 4.477 0 10 0s10 4.477 10 10-4.477 10-10 10S0 15.523 0 10" fill="currentColor"/>
                <path d="M10 12a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1m-1.5 2.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" fill="currentColor"/>
                <path d="M10.39 5.811c-.957-.045-1.76.49-1.904 1.353a1 1 0 1 1-1.972-.328C6.87 4.7 8.817 3.734 10.485 3.814c.854.04 1.733.347 2.409.979C13.587 5.44 14 6.368 14 7.5c0 1.291-.508 2.249-1.383 2.832-.803.535-1.788.668-2.617.668a1 1 0 1 1 0-2c.67 0 1.186-.117 1.508-.332.25-.167.492-.46.492-1.168 0-.618-.212-1.003-.472-1.246-.277-.259-.68-.42-1.138-.443" fill="currentColor"/>
              </svg>
            </div>
            <span>Помощь и поддержка</span>
          </Link>

          <Link 
            to="/" 
            className="left-sidebar__item left-sidebar__item--logout"
            onClick={() => {
              logoutUser();
              if (onClose) onClose();
            }}
          >
            <div className="left-sidebar__item-icon">
              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 17C8 16.4477 7.55228 16 7 16H2V2H7C7.55228 2 8 1.55228 8 1C8 0.447714 7.55228 0 7 0H2C0.895431 0 0 0.895431 0 2V16C0 17.1046 0.895431 18 2 18H7C7.55228 18 8 17.5523 8 17Z" fill="currentColor"/>
                <path d="M18.7136 9.70055C18.8063 9.6062 18.8764 9.49805 18.9241 9.38278C18.9727 9.26575 18.9996 9.1375 19 9.003L19 9L19 8.997C18.9992 8.74208 18.9016 8.48739 18.7071 8.29289L14.7071 4.29289C14.3166 3.90237 13.6834 3.90237 13.2929 4.29289C12.9024 4.68342 12.9024 5.31658 13.2929 5.70711L15.5858 8H6C5.44771 8 5 8.44771 5 9C5 9.55229 5.44771 10 6 10H15.5858L13.2929 12.2929C12.9024 12.6834 12.9024 13.3166 13.2929 13.7071C13.6834 14.0976 14.3166 14.0976 14.7071 13.7071L18.7064 9.70782L18.7136 9.70055Z" fill="currentColor"/>
              </svg>
            </div>
            <span>Выйти из аккаунта</span>
          </Link>
        </div>
      </nav>
    </aside>
    </>
  );
};

export default LeftSidebar;
