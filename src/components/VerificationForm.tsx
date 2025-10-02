import React, { useState } from 'react';
import '../css/verification-form.css';

interface VerificationFormProps {
  onClose: () => void;
  onSubmit: (formData: VerificationFormData) => void;
  isInline?: boolean;
}

export interface VerificationFormData {
  passportFront: File | null;
  passportBack: File | null;
  selfieWithPassport: File | null;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onClose, onSubmit, isInline = false }) => {
  const [formData, setFormData] = useState<VerificationFormData>({
    passportFront: null,
    passportBack: null,
    selfieWithPassport: null
  });
  
  const [dragStates, setDragStates] = useState({
    passportFront: false,
    passportBack: false,
    selfieWithPassport: false
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleFileChange = (field: keyof VerificationFormData, file: File | null) => {
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => [...prev, `${field === 'passportFront' ? 'Лицевая сторона паспорта' : field === 'passportBack' ? 'Обратная сторона паспорта' : 'Селфи с паспортом'} должна быть изображением`]);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => [...prev, `Файл ${field === 'passportFront' ? 'лицевой стороны паспорта' : field === 'passportBack' ? 'обратной стороны паспорта' : 'селфи с паспортом'} слишком большой. Максимальный размер: 5MB`]);
        return;
      }

      setFormData(prev => ({ ...prev, [field]: file }));
      setErrors(prev => prev.filter(error => !error.includes(field === 'passportFront' ? 'лицевой стороны паспорта' : field === 'passportBack' ? 'обратной стороны паспорта' : 'селфи с паспортом')));
    }
  };

  const handleDragOver = (e: React.DragEvent, field: keyof VerificationFormData) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: keyof VerificationFormData) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: keyof VerificationFormData) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(field, files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.passportFront || !formData.passportBack || !formData.selfieWithPassport) {
      setErrors(['Пожалуйста, загрузите все необходимые документы']);
      return;
    }

    if (errors.length === 0) {
      onSubmit(formData);
    }
  };

  const removeFile = (field: keyof VerificationFormData) => {
    setFormData(prev => ({ ...prev, [field]: null }));
  };

  const getFieldLabel = (field: keyof VerificationFormData): string => {
    switch (field) {
      case 'passportFront': return 'Лицевая сторона паспорта';
      case 'passportBack': return 'Обратная сторона паспорта';
      case 'selfieWithPassport': return 'Селфи с паспортом';
      default: return '';
    }
  };

  const getFieldDescription = (field: keyof VerificationFormData): string => {
    switch (field) {
      case 'passportFront': return 'Загрузите фото лицевой стороны паспорта';
      case 'passportBack': return 'Загрузите фото обратной стороны паспорта';
      case 'selfieWithPassport': return 'Сделайте селфи, держа паспорт в руках';
      default: return '';
    }
  };

  return (
    <div className={isInline ? "verification-form-inline" : "verification-form-overlay"}>
      <div className={isInline ? "verification-form-inline-content" : "verification-form-modal"}>
        {!isInline && (
          <div className="verification-form-header">
            <h2>Верификация личности</h2>
            <button className="close-btn" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        <div className="verification-form-content">
          <div className="verification-info">
            <div className="verification-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#EDFFC6"/>
                <path d="M24 12c.442 0 .845.25 1.044.646l3.007 6.014 6.615.963c.442.064.618.608.298.92l-4.816 4.695 1.085 6.618c.075.46-.387.81-.75.588L24 33.94l-5.943 3.124c-.363.222-.825-.128-.75-.588l1.085-6.618-4.816-4.695c-.32-.312-.144-.856.298-.92l6.615-.963 3.007-6.014c.199-.396.602-.646 1.044-.646z" fill="#72AA0C"/>
              </svg>
            </div>
            <div className="verification-text">
              <h3>Загрузите документы для верификации</h3>
              <p>Для прохождения верификации необходимо загрузить фотографии документов. Все данные обрабатываются в соответствии с политикой конфиденциальности.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="verification-form">
            {Object.keys(formData).map((field) => (
              <div key={field} className="file-upload-field">
                <label className="file-upload-label">
                  {getFieldLabel(field as keyof VerificationFormData)}
                  <span className="required">*</span>
                </label>
                <p className="field-description">{getFieldDescription(field as keyof VerificationFormData)}</p>
                
                {!formData[field as keyof VerificationFormData] ? (
                  <div
                    className={`file-upload-area ${dragStates[field as keyof VerificationFormData] ? 'drag-over' : ''}`}
                    onDragOver={(e) => handleDragOver(e, field as keyof VerificationFormData)}
                    onDragLeave={(e) => handleDragLeave(e, field as keyof VerificationFormData)}
                    onDrop={(e) => handleDrop(e, field as keyof VerificationFormData)}
                  >
                    <div className="upload-icon">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 4L16 20M16 4L10 10M16 4L22 10" stroke="#3796F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 20V24C4 25.1046 4.89543 26 6 26H26C27.1046 26 28 25.1046 28 24V20" stroke="#3796F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="upload-text">Перетащите файл сюда или <span className="browse-link" onClick={() => {
                      const input = document.querySelector(`input[data-field="${field}"]`) as HTMLInputElement;
                      if (input) input.click();
                    }}>выберите файл</span></p>
                    <p className="upload-hint">Поддерживаются: JPG, PNG, WEBP. Максимум 5MB</p>
                                         <input
                       type="file"
                       accept="image/*"
                       onChange={(e) => handleFileChange(field as keyof VerificationFormData, e.target.files?.[0] || null)}
                       className="file-input"
                       data-field={field}
                     />
                  </div>
                ) : (
                  <div className="file-preview">
                    <div className="file-info">
                      <div className="file-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#3796F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="#3796F8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="file-details">
                        <p className="file-name">{formData[field as keyof VerificationFormData]?.name}</p>
                        <p className="file-size">{((formData[field as keyof VerificationFormData]?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => removeFile(field as keyof VerificationFormData)}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {errors.length > 0 && (
              <div className="error-messages">
                {errors.map((error, index) => (
                  <p key={index} className="error-message">{error}</p>
                ))}
              </div>
            )}

            <div className="verification-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Отмена
              </button>
              <button type="submit" className="btn btn-primary">
                Отправить на верификацию
              </button>
            </div>
          </form>

          <div className="verification-footer">
            <div className="security-info">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1L18 5V11C18 15.4183 14.4183 19 10 19C5.58172 19 2 15.4183 2 11V5L10 1Z" stroke="#72AA0C" strokeWidth="2"/>
                <path d="M8 9L10 11L14 7" stroke="#72AA0C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>Ваши данные защищены и используются только для верификации</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
