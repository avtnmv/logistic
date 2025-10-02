import React, { useEffect } from 'react';
import '../css/notification-modal.css';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'approved' | 'rejected';
  notes?: string;
  verificationId: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  status, 
  notes, 
  verificationId 
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isApproved = status === 'approved';

  return (
    <div className="notification-modal-overlay" onClick={handleBackdropClick}>
      <div className="notification-modal-container">
        <div className="notification-modal-header">
          <div className={`notification-icon ${isApproved ? 'success' : 'error'}`}>
            {isApproved ? (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#EDFFC6"/>
                <path d="M22.368 10.668c.201.201.201.527 0 .728l-8.5 8.5c-.201.201-.527.201-.728 0l-4.5-4.5c-.201-.201-.201-.527 0-.728.201-.201.527-.201.728 0l4.136 4.136 8.136-8.136c.201-.201.527-.201.728 0z" fill="#72AA0C"/>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#FEE2E2"/>
                <path d="M20 12L12 20M12 12L20 20" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <h2 className="notification-title">
            {isApproved ? 'Верификация одобрена!' : 'Верификация отклонена'}
          </h2>
        </div>

        <div className="notification-modal-content">
          <div className="notification-info">
            <p className="notification-message">
              {isApproved 
                ? 'Поздравляем! Ваши документы успешно прошли проверку. Теперь у вас есть значок верификации.'
                : 'К сожалению, ваши документы не прошли проверку. Пожалуйста, ознакомьтесь с причиной ниже.'
              }
            </p>
            
            <div className="verification-details">
              <div className="detail-item">
                <span className="detail-label">Номер заявки:</span>
                <span className="detail-value">#{verificationId.slice(-8)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Дата рассмотрения:</span>
                <span className="detail-value">{new Date().toLocaleString('ru-RU')}</span>
              </div>
            </div>

            {!isApproved && notes && (
              <div className="rejection-reason">
                <h4>Причина отклонения:</h4>
                <p>{notes}</p>
              </div>
            )}

            {isApproved && (
              <div className="approval-benefits">
                <h4>Что это дает:</h4>
                <ul>
                  <li>Значок "Верифицирован" в вашем профиле</li>
                  <li>Приоритет в поиске и сделках</li>
                  <li>Повышенное доверие других пользователей</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="notification-modal-footer">
          <button 
            className={`notification-btn ${isApproved ? 'btn-success' : 'btn-primary'}`}
            onClick={onClose}
          >
            {isApproved ? 'Отлично!' : 'Понятно'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
