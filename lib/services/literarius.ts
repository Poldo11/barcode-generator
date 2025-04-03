import { type ObjetoPostal, type Remetente } from '../constants';
import { NotaFiscalSchema, type NotaFiscal } from '../schemas/literarius';

interface LiterariusNotaFiscal {
  destinatarioBairro: string;
  destinatarioCep: string;
  destinatarioCidade: string;
  destinatarioComplemento: string;
  destinatarioEmail: string;
  destinatarioEndereco: string;
  destinatarioEnderecoNumero: string;
  destinatarioEstado: string;
  destinatarioNome: string;
  emitenteBairro: string;
  emitenteCep: string;
  emitenteCidade: string;
  emitenteComplemento: string;
  emitenteEndereco: string;
  emitenteEstado: string;
  emitenteNome: string;
  emitenteNumero: string;
  emitenteCnpjOuCpf: string;
  pesoBruto: number;
  pesoLiquido: number;
}

interface LiterariusApiConfig {
  baseUrl: string;
  company: string;
  token: string;
}

export class LiterariusService {
  private config: LiterariusApiConfig;

  constructor(config: LiterariusApiConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${this.config.token}`,
      'Company': this.config.company,
      'Content-Type': 'application/json',
    };
  }

  async getNotaFiscal(id: string): Promise<NotaFiscal> {
    const response = await fetch(`${this.config.baseUrl}/v1/notas-fiscais/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch nota fiscal: ${response.statusText}`);
    }

    const data = await response.json();
    const validationResult = NotaFiscalSchema.safeParse(data);

    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      throw new Error('Invalid nota fiscal data received from API');
    }

    return validationResult.data;
  }

  transformToCorreiosFormat(notaFiscal: NotaFiscal): {
    remetente: Remetente;
    objeto: ObjetoPostal;
  } {
    return {
      remetente: {
        cpfCnpj: notaFiscal.emitenteCnpjOuCpf,
        nome: notaFiscal.emitenteNome,
        dddTelefone: '', // Not available in the API response
        telefone: '', // Not available in the API response
        dddCelular: '', // Not available in the API response
        celular: '', // Not available in the API response
        email: '', // Not available in the API response
        endereco: {
          cep: notaFiscal.emitenteCep,
          logradouro: notaFiscal.emitenteEndereco,
          numero: notaFiscal.emitenteNumero,
          complemento: notaFiscal.emitenteComplemento,
          bairro: notaFiscal.emitenteBairro,
          cidade: notaFiscal.emitenteCidade,
          uf: notaFiscal.emitenteEstado,
        },
      },
      objeto: {
        cep: notaFiscal.destinatarioCep,
        logradouro: notaFiscal.destinatarioEndereco,
        numero: notaFiscal.destinatarioEnderecoNumero,
        complemento: notaFiscal.destinatarioComplemento,
        bairro: notaFiscal.destinatarioBairro,
        cidade: notaFiscal.destinatarioCidade,
        uf: notaFiscal.destinatarioEstado,
        cnpj: '', // Not available in the API response
        email: notaFiscal.destinatarioEmail,
        numeroDestinatario: notaFiscal.destinatarioEnderecoNumero,
        complementoDestinatario: notaFiscal.destinatarioComplemento,
        nomeDestinatario: notaFiscal.destinatarioNome,
        nomeRemetente: notaFiscal.emitenteNome,
        peso: notaFiscal.pesoBruto.toString(),
        pesoRegistrado: notaFiscal.pesoLiquido.toString(),
        dataPostagem: new Date().toLocaleDateString('pt-BR'),
        codigoServico: '03220', // Default to SEDEX
      },
    };
  }
} 