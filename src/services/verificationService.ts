export interface VerificationResult {
  success: boolean;
  message: string;
  code?: string;
}

export interface VerificationParams {
  phone: string;
  userName?: string;
}

export class VerificationService {
  private static instance: VerificationService;
  private generatedCodes: Map<string, { code: string; timestamp: number }> = new Map();
  private readonly CODE_EXPIRY_TIME = 10 * 60 * 1000; // 10 минут

  private constructor() {}

  public static getInstance(): VerificationService {
    if (!VerificationService.instance) {
      VerificationService.instance = new VerificationService();
    }
    return VerificationService.instance;
  }

  private generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  public async sendCode(params: VerificationParams): Promise<VerificationResult> {
    try {
      const code = this.generateVerificationCode();
      
      this.generatedCodes.set(params.phone, {
        code,
        timestamp: Date.now()
      });

      return await this.sendSMSCode(params.phone, code, params.userName);

    } catch (error) {
      console.error('Ошибка отправки кода:', error);
      return {
        success: false,
        message: 'Не удалось отправить код. Попробуйте еще раз.'
      };
    }
  }

  private async sendSMSCode(
    phone: string, 
    code: string, 
    userName?: string
  ): Promise<VerificationResult> {
    
    console.log(code);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: `Код подтверждения отправлен на ${phone}`,
      code: code 
    };
  }

  public verifyCode(phone: string, inputCode: string): VerificationResult {
    const storedData = this.generatedCodes.get(phone);
    
    if (!storedData) {
      return {
        success: false,
        message: 'Код не найден. Запросите новый код.'
      };
    }

    if (Date.now() - storedData.timestamp > this.CODE_EXPIRY_TIME) {
      this.generatedCodes.delete(phone);
      return {
        success: false,
        message: 'Код истек. Запросите новый код.'
      };
    }

    if (storedData.code === inputCode) {
      this.generatedCodes.delete(phone);
      return {
        success: true,
        message: 'Код подтвержден успешно!'
      };
    } else {
      return {
        success: false,
        message: 'Неверный код. Попробуйте еще раз.'
      };
    }
  }

  public hasActiveCode(phone: string): boolean {
    const storedData = this.generatedCodes.get(phone);
    if (!storedData) return false;
    
    return Date.now() - storedData.timestamp <= this.CODE_EXPIRY_TIME;
  }

  public cleanupExpiredCodes(): void {
    const now = Date.now();
    this.generatedCodes.forEach((data, phone) => {
      if (now - data.timestamp > this.CODE_EXPIRY_TIME) {
        this.generatedCodes.delete(phone);
      }
    });
  }

  public getActiveCodesCount(): number {
    this.cleanupExpiredCodes();
    return this.generatedCodes.size;
  }

  public getCodeForTesting(phone: string): string | null {
    const storedData = this.generatedCodes.get(phone);
    if (storedData && Date.now() - storedData.timestamp <= this.CODE_EXPIRY_TIME) {
      return storedData.code;
    }
    return null;
  }
}

export const verificationService = VerificationService.getInstance();
