// Types for Correios API
export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Remetente {
  cpfCnpj: string;
  nome: string;
  dddTelefone: string;
  telefone: string;
  dddCelular: string;
  celular: string;
  email: string;
  endereco: Endereco;
}

export interface ObjetoPostal {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cnpj: string;
  email: string;
  numeroDestinatario: string;
  complementoDestinatario: string;
  nomeDestinatario: string;
  nomeRemetente: string;
  peso: string;
  pesoRegistrado: string;
  dataPostagem: string;
  codigoServico: string;
}

// Service codes for registered mail
export const CODIGOS_SERVICO_REGISTRADO = [
  "03220", // SEDEX
  "03204", // SEDEX HOJE
  "40215", // SEDEX 10
  "40290", // SEDEX Hoje
  "04162", // SEDEX Internacional
  "04669", // PAC com registro
  "04510", // PAC com registro
  "04014", // SEDEX com registro
] as const;

// Default values for Correios API
export const VALORES_PADRAO = {
  cep: "00000000",
  logradouro: "Rua Exemplo",
  numero: "0",
  complemento: "",
  bairro: "Centro",
  cidade: "São Paulo",
  uf: "SP",
  cnpj: "00000000000000",
  email: "exemplo@email.com",
  nomeRemetente: "Remetente Padrão",
  nomeDestinatario: "Destinatário Padrão",
  numeroDestinatario: "0",
  complementoDestinatario: "",
  peso: "1",
  pesoRegistrado: "1",
  dataPostagem: new Date().toISOString().split('T')[0],
  codigoServicoPAC: "04669",
  codigoServicoSEDEX: "03220",
} as const;

// Default sender for Correios API
export const REMETENTE_PADRAO: Remetente = {
  cpfCnpj: VALORES_PADRAO.cnpj,
  nome: VALORES_PADRAO.nomeRemetente,
  dddTelefone: "11",
  telefone: "0000000000",
  dddCelular: "11",
  celular: "0000000000",
  email: VALORES_PADRAO.email,
  endereco: {
    cep: VALORES_PADRAO.cep,
    logradouro: VALORES_PADRAO.logradouro,
    numero: VALORES_PADRAO.numero,
    complemento: VALORES_PADRAO.complemento,
    bairro: VALORES_PADRAO.bairro,
    cidade: VALORES_PADRAO.cidade,
    uf: VALORES_PADRAO.uf,
  },
};

