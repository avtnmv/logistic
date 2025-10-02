import { VerificationFormData } from '../components/VerificationForm';

export interface VerificationStatus {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  documents: {
    passportFront: string;
    passportBack: string;
    selfieWithPassport: string;
  };
  notes?: string;
  notificationShown?: boolean;
}

export interface VerificationResponse {
  success: boolean;
  verificationId?: string;
  message: string;
  errors?: string[];
}

class DocumentVerificationService {
  private readonly STORAGE_KEY_PREFIX = 'document_verification_';

  async submitVerification(userId: string, formData: VerificationFormData): Promise<VerificationResponse> {
    try {
      
      const verificationData: VerificationStatus = {
        id: `verification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        documents: {
          passportFront: await this.fileToBase64(formData.passportFront!),
          passportBack: await this.fileToBase64(formData.passportBack!),
          selfieWithPassport: await this.fileToBase64(formData.selfieWithPassport!)
        }
      };

      this.saveVerificationToStorage(verificationData);

      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        verificationId: verificationData.id,
        message: 'Документы успешно отправлены на верификацию'
      };

    } catch (error) {
      console.error('Ошибка при отправке верификации:', error);
      return {
        success: false,
        message: 'Произошла ошибка при отправке документов. Попробуйте еще раз.',
        errors: ['Ошибка сервера']
      };
    }
  }

  async getVerificationStatus(userId: string): Promise<VerificationStatus | null> {
    try {
      const storageKey = `${this.STORAGE_KEY_PREFIX}${userId}`;
      
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const verification: VerificationStatus = JSON.parse(stored);
        return verification;
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении статуса верификации:', error);
      return null;
    }
  }

  async getAllVerifications(): Promise<VerificationStatus[]> {
    try {
      const allStorageKey = 'document_verification_data';
      const stored = localStorage.getItem(allStorageKey);
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch (error) {
      console.error('Ошибка при получении всех верификаций:', error);
      return [];
    }
  }

  async updateVerificationStatus(
    verificationId: string, 
    status: 'approved' | 'rejected', 
    notes?: string
  ): Promise<VerificationResponse> {
    try {
      const allStorageKey = 'document_verification_data';
      const stored = localStorage.getItem(allStorageKey);
      if (stored) {
        const verifications: VerificationStatus[] = JSON.parse(stored);
        const verificationIndex = verifications.findIndex(v => v.id === verificationId);
        
        if (verificationIndex !== -1) {
          const verification = verifications[verificationIndex];
          
          verifications[verificationIndex].status = status;
          verifications[verificationIndex].reviewedAt = new Date().toISOString();
          if (notes) {
            verifications[verificationIndex].notes = notes;
          }
          
          localStorage.setItem(allStorageKey, JSON.stringify(verifications));
          
          const userStorageKey = `${this.STORAGE_KEY_PREFIX}${verification.userId}`;
          localStorage.setItem(userStorageKey, JSON.stringify(verifications[verificationIndex]));
          
          return {
            success: true,
            message: `Статус верификации обновлен на: ${status === 'approved' ? 'одобрено' : 'отклонено'}`
          };
        }
      }
      
      return {
        success: false,
        message: 'Верификация не найдена'
      };
    } catch (error) {
      console.error('Ошибка при обновлении статуса верификации:', error);
      return {
        success: false,
        message: 'Произошла ошибка при обновлении статуса'
      };
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private saveVerificationToStorage(verificationData: VerificationStatus): void {
    try {
      const storageKey = `${this.STORAGE_KEY_PREFIX}${verificationData.userId}`;
      
      localStorage.setItem(storageKey, JSON.stringify(verificationData));
      
      const allStorageKey = 'document_verification_data';
      const stored = localStorage.getItem(allStorageKey);
      let verifications: VerificationStatus[] = [];
      
      if (stored) {
        verifications = JSON.parse(stored);
        verifications = verifications.filter(v => v.userId !== verificationData.userId);
      }
      
      verifications.push(verificationData);
      localStorage.setItem(allStorageKey, JSON.stringify(verifications));
      
    } catch (error) {
      console.error('Ошибка при сохранении верификации в localStorage:', error);
    }
  }

  clearAllVerifications(): void {
    try {
      localStorage.removeItem('document_verification_data');
      
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      
      // Все данные верификации очищены
    } catch (error) {
      console.error('Ошибка при очистке данных верификации:', error);
    }
  }

  async checkForNewNotifications(userId: string): Promise<VerificationStatus | null> {
    try {
      const verification = await this.getVerificationStatus(userId);
      if (verification && 
          (verification.status === 'approved' || verification.status === 'rejected') &&
          !verification.notificationShown) {
        return verification;
      }
      return null;
    } catch (error) {
      console.error('Ошибка при проверке уведомлений:', error);
      return null;
    }
  }

  async markNotificationAsShown(verificationId: string): Promise<void> {
    try {
      const allStorageKey = 'document_verification_data';
      const stored = localStorage.getItem(allStorageKey);
      if (stored) {
        const verifications: VerificationStatus[] = JSON.parse(stored);
        const verificationIndex = verifications.findIndex(v => v.id === verificationId);
        
        if (verificationIndex !== -1) {
          verifications[verificationIndex].notificationShown = true;
          localStorage.setItem(allStorageKey, JSON.stringify(verifications));
          
          const userStorageKey = `${this.STORAGE_KEY_PREFIX}${verifications[verificationIndex].userId}`;
          localStorage.setItem(userStorageKey, JSON.stringify(verifications[verificationIndex]));
        }
      }
    } catch (error) {
      console.error('Ошибка при отметке уведомления как показанного:', error);
    }
  }
}

export const documentVerificationService = new DocumentVerificationService();
export default documentVerificationService;


