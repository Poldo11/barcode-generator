import { z } from 'zod';

// Schema for the Nota Fiscal data
export const NotaFiscalSchema = z.object({
  id: z.string(),
  destinatarioBairro: z.string(),
  destinatarioCep: z.string(),
  destinatarioCidade: z.string(),
  destinatarioComplemento: z.string(),
  destinatarioEmail: z.string().email(),
  destinatarioEndereco: z.string(),
  destinatarioEnderecoNumero: z.string(),
  destinatarioEstado: z.string(),
  destinatarioNome: z.string(),
  emitenteBairro: z.string(),
  emitenteCep: z.string(),
  emitenteCidade: z.string(),
  emitenteComplemento: z.string(),
  emitenteEndereco: z.string(),
  emitenteEstado: z.string(),
  emitenteNome: z.string(),
  emitenteNumero: z.string(),
  emitenteCnpjOuCpf: z.string(),
  pesoBruto: z.number(),
  pesoLiquido: z.number(),
});

// Schema for the webhook event data
export const LiterariusWebhookSchema = z.object({
  event: z.enum(['nota_fiscal.created']),
  data: z.object({
    id: z.string(),
  }),
  timestamp: z.string().datetime(),
  version: z.string(),
});

export type NotaFiscal = z.infer<typeof NotaFiscalSchema>;
export type LiterariusWebhook = z.infer<typeof LiterariusWebhookSchema>; 