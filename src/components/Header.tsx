import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { logoutUser } from '../data/testData';

import '../css/header.css';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentUser = useCurrentUser();

  const isActive = (path: string) => location.pathname === path;
  
  const isAuthorizedPage = ['/dashboard', '/search-orders', '/homepage', '/my-transports', '/companies', '/security', '/profile'].includes(location.pathname);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }


    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  if (isAuthorizedPage) {
    return (
      <header className="header">
        <div className="container flex-between-center">
          <Link to="/search-orders" className="logo header__logo">
            <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="header__logo-img" width="180" height="62" />
          </Link>
          
          <div className="header__user-section">

            <div className="header__user-info">
              <div className="header__user-avatar">
                <img 
                  src="/img/default-avatar.svg" 
                  alt="Аватар пользователя"
                  width="42" 
                  height="42"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMjEiIGZpbGw9IiNFNUY1RjUiLz4KPHBhdGggZD0iTTIxIDIwQzIzLjIwOTEgMjAgMjUgMTguMjA5MSAyNSAxNkMyNSAxMy43OTA5IDIzLjIwOTEgMTIgMjEgMTJDMTAuOCAxMiAxMyAxNCAxMyAxNkMxMyAxOC4yMDkxIDE0Ljc5MDkgMjAgMjEgMjBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yMSAyMkMxNi4wMzA0IDIyIDEyIDI2LjAzMDQgMTIgMzFIMzBDMzAgMjYuMDMwNCAyNS45Njk2IDIyIDIxIDIyWiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K';
                  }}
                />
              </div>
              <div className="header__user-details">
                <div className="header__user-name">
                  {currentUser ? 
                    `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Пользователь' 
                    : 'Пользователь'
                  }
                </div>
              </div>
            </div>

            <button 
              className={`burger-menu ${isMobileMenuOpen ? 'burger-menu--active' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Открыть меню"
            >
              <div className="burger-menu__lines">
                <span className="burger-menu__line"></span>
                <span className="burger-menu__line"></span>
                <span className="burger-menu__line"></span>
              </div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                className="mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={closeMobileMenu}
              />
              
              <motion.nav
                className="header__nav--mobile"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.3 }}
              >
                <div className="mobile-menu__header">
                  <div className="mobile-menu__header-content">
                    <Link to="/homepage" className="mobile-menu__logo" onClick={closeMobileMenu}>
                      <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="mobile-menu__logo-img" />
                    </Link>
                    <button 
                      className="mobile-menu__close-btn"
                      onClick={closeMobileMenu}
                      aria-label="Закрыть меню"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="mobile-menu__content">
                  <div className="mobile-menu__user-info">
                    <div className="mobile-menu__user-avatar">
                      <img 
                        src="/img/default-avatar.svg" 
                        alt="Аватар пользователя"
                        width="42" 
                        height="42"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0MiA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjEiIGN5PSIyMSIgcj0iMjEiIGZpbGw9IiNFNUY1RjUiLz4KPHBhdGggZD0iTTIxIDIwQzIzLjIwOTEgMjAgMjUgMTguMjA5MSAyNSAxNkMyNSAxMy43OTA5IDIzLjIwOTEgMTIgMjEgMTJDMTAuOCAxMiAxMyAxNCAxMyAxNkMxMyAxOC4yMDkxIDE0Ljc5MDkgMjAgMjEgMjBaIiBmaWxsPSIjQ0NDIi8+CjxwYXRoIGQ9Ik0yMSAyMkMxNi4wMzA0IDIyIDEyIDI2LjAzMDQgMTIgMzFIMzBDMzAgMjYuMDMwNCAyNS45Njk2IDIyIDIxIDIyWiIgZmlsbD0iI0NDQyIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    <div className="mobile-menu__user-details">
                      <div className="mobile-menu__user-name">
                        {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Пользователь'}
                      </div>
                    </div>
                    <Link 
                      to="/profile-settings" 
                      className="mobile-menu__profile-link"
                      onClick={closeMobileMenu}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" color="#000" fill="none">
                        <path d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M21.011 14.097c.522-.141.783-.212.886-.346.103-.135.103-.351.103-.784v-1.934c0-.433 0-.65-.103-.784s-.364-.205-.886-.345c-1.95-.526-3.171-2.565-2.668-4.503.139-.533.208-.8.142-.956s-.256-.264-.635-.479l-1.725-.98c-.372-.21-.558-.316-.725-.294s-.356.21-.733.587c-1.459 1.455-3.873 1.455-5.333 0-.377-.376-.565-.564-.732-.587-.167-.022-.353.083-.725.295l-1.725.979c-.38.215-.57.323-.635.48-.066.155.003.422.141.955.503 1.938-.718 3.977-2.669 4.503-.522.14-.783.21-.886.345S2 10.6 2 11.033v1.934c0 .433 0 .65.103.784s.364.205.886.346c1.95.526 3.171 2.565 2.668 4.502-.139.533-.208.8-.142.956s.256.264.635.48l1.725.978c.372.212.558.317.725.295s.356-.21.733-.587c1.46-1.457 3.876-1.457 5.336 0 .377.376.565.564.732.587.167.022.353-.083.726-.295l1.724-.979c.38-.215.57-.323.635-.48s-.003-.422-.141-.955c-.504-1.937.716-3.976 2.666-4.502Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </Link>
                  </div>

                  <button 
                    className="mobile-menu__add-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/homepage?form=cargo');
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Добавить груз
                  </button>

                  <button 
                    className="mobile-menu__add-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/homepage?form=transport');
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Добавить транспорт
                  </button>

                  <Link 
                    to="/profile" 
                    className={`mobile-menu__item ${isActive('/profile') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 6a6 6 0 1 1 12 0A6 6 0 0 1 3 6m2 10a3 3 0 0 0-3 3 1 1 0 1 1-2 0 5 5 0 0 1 5-5h8a5 5 0 0 1 5 5 1 1 0 1 1-2 0 3 3 0 0 0-3-3z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Профиль</span>
                  </Link>

                  <Link 
                    to="/companies" 
                    className={`mobile-menu__item ${isActive('/companies') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 3h-3V2a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v1H3a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3M8 2h4v1H8zm10 13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V9.39L6.68 11q.16.021.32 0h6q.163-.003.32-.05L18 9.39zm0-7.72L12.84 9H7.16L2 7.28V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Компании</span>
                  </Link>

                  <Link 
                    to="/payments" 
                    className={`mobile-menu__item ${isActive('/payments') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2zm-2 2H2V2h16zM2 7h16v7H2z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Платежи</span>
                  </Link>

                  <Link 
                    to="/homepage" 
                    className={`mobile-menu__item ${isActive('/homepage') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 0a2 2 0 0 1 2 2v1h1.52a2 2 0 0 1 1.561.75l1.48 1.851A2 2 0 0 1 20 6.851V11a2 2 0 0 1-2 2 3 3 0 0 1-6 0H8a3 3 0 0 1-6 0 2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2m10 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M13 2H2v9h.764a2.996 2.996 0 0 1 4.341-.138l.131.138h5.528l.115-.121.121-.115zm3.52 3H15v5c.82 0 1.563.33 2.105.862l.131.138H18V6.85z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Мои перевозки</span>
                  </Link>

                  <Link 
                    to="/security" 
                    className={`mobile-menu__item ${isActive('/security') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2c1.648 0 3 1.352 3 3v3H5V5c0-1.648 1.352-3 3-3m5 6V5c0-2.752-2.248-5-5-5S3 2.248 3 5v3H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zM2 10h12v8H2z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Безопасность</span>
                  </Link>

                  <Link 
                    to="/help" 
                    className={`mobile-menu__item ${isActive('/help') ? 'mobile-menu__item--active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <div className="mobile-menu__item-icon">
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
                    className="mobile-menu__item mobile-menu__item--logout"
                    onClick={() => {
                      logoutUser();
                      closeMobileMenu();
                    }}
                  >
                    <div className="mobile-menu__item-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="19" height="18" color="#000" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 17C8 16.4477 7.55228 16 7 16H2V2H7C7.55228 2 8 1.55228 8 1C8 0.447714 7.55228 0 7 0H2C0.895431 0 0 0.895431 0 2V16C0 17.1046 0.895431 18 2 18H7C7.55228 18 8 17.5523 8 17Z" fill="currentColor"/>
                        <path d="M18.7136 9.70055C18.8063 9.6062 18.8764 9.49805 18.9241 9.38278C18.9727 9.26575 18.9996 9.1375 19 9.003L19 9L19 8.997C18.9992 8.74208 18.9016 8.48739 18.7071 8.29289L14.7071 4.29289C14.3166 3.90237 13.6834 3.90237 13.2929 4.29289C12.9024 4.68342 12.9024 5.31658 13.2929 5.70711L15.5858 8H6C5.44771 8 5 8.44771 5 9C5 9.55229 5.44771 10 6 10H15.5858L13.2929 12.2929C12.9024 12.6834 12.9024 13.3166 13.2929 13.7071C13.6834 14.0976 14.3166 14.0976 14.7071 13.7071L18.7064 9.70782L18.7136 9.70055Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <span>Выйти</span>
                  </Link>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container flex-between-center">
        <Link to="/" className="logo header__logo">
          <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="header__logo-img" width="180" height="62" />
        </Link>
        
        <nav className="header__nav header__nav--desktop">
          <Link 
            to="/" 
            className={`header__nav-button header__nav-button--login ${isActive('/') ? 'header__nav-button--active' : ''}`}
          >
            Вход
          </Link>
          <Link 
            to="/registration" 
            className={`header__nav-button header__nav-button--registration ${isActive('/registration') ? 'header__nav-button--active' : ''}`}
          >
            Регистрация
          </Link>
        </nav>

        <button 
          className={`burger-menu ${isMobileMenuOpen ? 'burger-menu--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
        >
          <span className="burger-menu__line"></span>
          <span className="burger-menu__line"></span>
          <span className="burger-menu__line"></span>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMobileMenu}
            />
            
            <motion.nav
              className="header__nav--mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-menu__header">
                <div className="mobile-menu__header-content">
                  <Link to="/" className="mobile-menu__logo" onClick={closeMobileMenu}>
                    <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="mobile-menu__logo-img" />
                  </Link>
                </div>
              </div>
              
              <div className="mobile-menu__content">
                <Link 
                  to="/" 
                  className={`mobile-menu__item ${isActive('/') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Вход</span>
                </Link>
                
                <Link 
                  to="/registration" 
                  className={`mobile-menu__item ${isActive('/registration') ? 'mobile-menu__item--active' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <div className="mobile-menu__item-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M15 8A5 5 0 1 0 5 8a5 5 0 0 0 10 0m2.5 13v-7M14 17.5h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 20a7 7 0 0 1 11-5.745" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Регистрация</span>
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
