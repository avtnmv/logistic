import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__container">
          <div className="footer__info">
            <Link to="/" className="logo footer__logo">
              <img src={`${process.env.PUBLIC_URL}/img/logo.webp`} alt="logo" className="footer__logo-img" width="180" height="62" />
            </Link>

            <ul className="footer__list">
              <li className="footer__item"><span className="footer__link">Name Company</span></li>
              <li className="footer__item"><span className="footer__link">Adress Company</span></li>
              <li className="footer__item"><span className="footer__link">City Company</span></li>
            </ul>
          </div>

          <div className="footer__info footer__info--company">
            <h4 className="footer__title">Компания</h4>

            <ul className="footer__list footer__list--company">
              <li className="footer__item"><a href="#" className="footer__link">О компании</a></li>
              <li className="footer__item"><a href="#" className="footer__link">Контакты</a></li>
              <li className="footer__item"><a href="#" className="footer__link">Вопросы и ответы</a></li>
              <li className="footer__item"><a href="#" className="footer__link">Поддержка</a></li>
            </ul>
          </div>

          <div className="footer__info footer__info--policy">
            <h4 className="footer__title">Условия и политика</h4>

            <ul className="footer__list footer__list--policy">
              <li className="footer__item"><a href="#" className="footer__link">Политика cookie</a></li>
              <li className="footer__item"><a href="#" className="footer__link">Условия использования</a></li>
              <li className="footer__item"><a href="#" className="footer__link">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
