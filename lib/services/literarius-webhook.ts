import { LiterariusService } from './literarius';
import { CorreiosPrepostagemService } from './correios-prepostagem';

interface WebhookConfig {
  literarius: {
    baseUrl: string;
    company: string;
    token: string;
  };
  correios: {
    baseUrl: string;
    username: string;
    password: string;
  };
}

export class LiterariusWebhookService {
  private literariusService: LiterariusService;
  private correiosService: CorreiosPrepostagemService;

  constructor(config: WebhookConfig) {
    this.literariusService = new LiterariusService(config.literarius);
    this.correiosService = new CorreiosPrepostagemService(config.correios);
  }

  async handleNotaFiscalCreated(notaFiscalId: string): Promise<void> {
    try {
      // Fetch the nota fiscal from Literarius
      const notaFiscal = await this.literariusService.getNotaFiscal(notaFiscalId);
      
      // Transform the data to Correios format
      const { remetente, objeto } = this.literariusService.transformToCorreiosFormat(notaFiscal);
      
      // Create prepostagem in Correios
      await this.correiosService.createPrepostagem(remetente, objeto);
      
      console.log(`Successfully created prepostagem for nota fiscal ${notaFiscalId}`);
    } catch (error) {
      console.error(`Failed to process nota fiscal ${notaFiscalId}:`, error);
      throw error;
    }
  }
} 