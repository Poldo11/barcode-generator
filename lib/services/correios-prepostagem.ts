import { type ObjetoPostal, type Remetente } from '../constants';

interface CorreiosPrepostagemConfig {
  username: string;
  password: string;
  baseUrl: string;
}

interface PrepostagemRequest {
  remetente: {
    cpfCnpj: string;
    nome: string;
    dddTelefone: string;
    telefone: string;
    dddCelular: string;
    celular: string;
    email: string;
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      uf: string;
    };
  };
  destinatario: {
    cpfCnpj: string;
    nome: string;
    dddTelefone: string;
    telefone: string;
    dddCelular: string;
    celular: string;
    email: string;
    endereco: {
      cep: string;
      logradouro: string;
      numero: string;
      complemento: string;
      bairro: string;
      cidade: string;
      uf: string;
    };
  };
  objeto: {
    peso: string;
    pesoRegistrado: string;
    dataPostagem: string;
    codigoServico: string;
  };
}

export class CorreiosPrepostagemService {
  private config: CorreiosPrepostagemConfig;
  private token: string | null = null;

  constructor(config: CorreiosPrepostagemConfig) {
    this.config = config;
  }

  private async login(): Promise<void> {
    const response = await fetch(`${this.config.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.config.username,
        password: this.config.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to login to Correios Prepostagem');
    }

    const data = await response.json();
    this.token = data.token;
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.token) {
      await this.login();
    }
  }

  async createPrepostagem(remetente: Remetente, objeto: ObjetoPostal): Promise<void> {
    await this.ensureAuthenticated();

    const request: PrepostagemRequest = {
      remetente: {
        cpfCnpj: remetente.cpfCnpj,
        nome: remetente.nome,
        dddTelefone: remetente.dddTelefone,
        telefone: remetente.telefone,
        dddCelular: remetente.dddCelular,
        celular: remetente.celular,
        email: remetente.email,
        endereco: {
          cep: remetente.endereco.cep,
          logradouro: remetente.endereco.logradouro,
          numero: remetente.endereco.numero,
          complemento: remetente.endereco.complemento || '',
          bairro: remetente.endereco.bairro,
          cidade: remetente.endereco.cidade,
          uf: remetente.endereco.uf,
        },
      },
      destinatario: {
        cpfCnpj: objeto.cnpj,
        nome: objeto.nomeDestinatario,
        dddTelefone: '', // Not available in the current data
        telefone: '', // Not available in the current data
        dddCelular: '', // Not available in the current data
        celular: '', // Not available in the current data
        email: objeto.email,
        endereco: {
          cep: objeto.cep,
          logradouro: objeto.logradouro,
          numero: objeto.numero,
          complemento: objeto.complemento,
          bairro: objeto.bairro,
          cidade: objeto.cidade,
          uf: objeto.uf,
        },
      },
      objeto: {
        peso: objeto.peso,
        pesoRegistrado: objeto.pesoRegistrado,
        dataPostagem: objeto.dataPostagem,
        codigoServico: objeto.codigoServico,
      },
    };

    const response = await fetch(`${this.config.baseUrl}/prepostagem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to create prepostagem');
    }
  }
} 