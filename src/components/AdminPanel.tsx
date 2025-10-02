import React, { useState, useEffect } from 'react';
import documentVerificationService, { VerificationStatus } from '../services/documentVerificationService';
import ImageModal from './ImageModal';
import '../css/admin-panel.css';

const AdminPanel: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    alt: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    alt: ''
  });
  const [rejectionTemplate, setRejectionTemplate] = useState<string>('');

  // Шаблоны для отказа в верификации
  const rejectionTemplates = [
    'плохое качество изображения',
    'ошибка при заполнении данных, проверьте ваши данные при регистрации',
    'ошибка селфи с документом',
    'истёк срок действия документа'
  ];

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      const data = await documentVerificationService.getAllVerifications();
      setVerifications(data);
    } catch (error) {
      console.error('Ошибка при загрузке верификаций:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (verificationId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const response = await documentVerificationService.updateVerificationStatus(verificationId, status, notes);
      if (response.success) {
        alert(response.message);
        loadVerifications();
        setRejectionTemplate(''); // Сброс выбранного шаблона
      } else {
        alert(`Ошибка: ${response.message}`);
      }
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      alert('Произошла ошибка при обновлении статуса');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge approved">Одобрено</span>;
      case 'rejected':
        return <span className="status-badge rejected">Отклонено</span>;
      case 'pending':
        return <span className="status-badge pending">На рассмотрении</span>;
      default:
        return <span className="status-badge unknown">Неизвестно</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const clearAllData = async () => {
    if (window.confirm('Вы уверены, что хотите очистить все данные верификации? Это действие нельзя отменить.')) {
      documentVerificationService.clearAllVerifications();
      await loadVerifications();
      alert('Все данные верификации очищены');
    }
  };

  const openImageModal = (imageUrl: string, title: string, alt: string) => {
    setImageModal({
      isOpen: true,
      imageUrl,
      title,
      alt
    });
  };

  const closeImageModal = () => {
    setImageModal({
      isOpen: false,
      imageUrl: '',
      title: '',
      alt: ''
    });
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Панель администратора - Верификации</h1>
        <div className="admin-actions">
          <button className="btn btn-secondary" onClick={loadVerifications}>
            Обновить
          </button>
          <button className="btn btn-danger" onClick={clearAllData}>
            Очистить все данные
          </button>
        </div>
      </div>

      {verifications.length === 0 ? (
        <div className="no-data">
          <p>Нет данных верификации</p>
        </div>
      ) : (
        <div className="verifications-list">
          {verifications.map((verification) => (
            <div key={verification.id} className="verification-item">
              <div className="verification-header">
                <div className="verification-info">
                  <h3>Верификация #{verification.id.slice(-8)}</h3>
                  <p>Пользователь ID: {verification.userId}</p>
                  <p>Отправлено: {formatDate(verification.submittedAt)}</p>
                  {verification.reviewedAt && (
                    <p>Рассмотрено: {formatDate(verification.reviewedAt)}</p>
                  )}
                </div>
                <div className="verification-status">
                  {getStatusBadge(verification.status)}
                </div>
              </div>

              <div className="verification-documents">
                <h4>Документы:</h4>
                <div className="documents-grid">
                  <div className="document-item">
                    <strong>Лицевая сторона паспорта:</strong>
                    <div className="document-preview">
                      <img 
                        src={verification.documents.passportFront} 
                        alt="Лицевая сторона паспорта"
                        className="document-image clickable-image"
                        onClick={() => openImageModal(
                          verification.documents.passportFront,
                          `Лицевая сторона паспорта - Верификация #${verification.id.slice(-8)}`,
                          "Лицевая сторона паспорта"
                        )}
                      />
                    </div>
                  </div>
                  <div className="document-item">
                    <strong>Обратная сторона паспорта:</strong>
                    <div className="document-preview">
                      <img 
                        src={verification.documents.passportBack} 
                        alt="Обратная сторона паспорта"
                        className="document-image clickable-image"
                        onClick={() => openImageModal(
                          verification.documents.passportBack,
                          `Обратная сторона паспорта - Верификация #${verification.id.slice(-8)}`,
                          "Обратная сторона паспорта"
                        )}
                      />
                    </div>
                  </div>
                  <div className="document-item">
                    <strong>Селфи с паспортом:</strong>
                    <div className="document-preview">
                      <img 
                        src={verification.documents.selfieWithPassport} 
                        alt="Селфи с паспортом"
                        className="document-image clickable-image"
                        onClick={() => openImageModal(
                          verification.documents.selfieWithPassport,
                          `Селфи с паспортом - Верификация #${verification.id.slice(-8)}`,
                          "Селфи с паспортом"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {verification.notes && (
                <div className="verification-notes">
                  <h4>Примечания:</h4>
                  <p>{verification.notes}</p>
                </div>
              )}

              {verification.status === 'pending' && (
                <div className="verification-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(verification.id, 'approved')}
                  >
                    Одобрить
                  </button>
                  <div className="rejection-section">
                    <select
                      className="rejection-template-select"
                      value={rejectionTemplate}
                      onChange={(e) => setRejectionTemplate(e.target.value)}
                    >
                      <option value="">Выберите причину отклонения</option>
                      {rejectionTemplates.map((template, index) => (
                        <option key={index} value={template}>
                          {template}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        if (rejectionTemplate) {
                          handleStatusUpdate(verification.id, 'rejected', rejectionTemplate);
                        } else {
                          alert('Пожалуйста, выберите причину отклонения');
                        }
                      }}
                      disabled={!rejectionTemplate}
                    >
                      Отклонить
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ImageModal
        isOpen={imageModal.isOpen}
        onClose={closeImageModal}
        imageUrl={imageModal.imageUrl}
        title={imageModal.title}
        alt={imageModal.alt}
      />
    </div>
  );
};

export default AdminPanel;
