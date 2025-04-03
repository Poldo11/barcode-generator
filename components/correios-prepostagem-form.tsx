"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DeliveryStyleSelector } from "./delivery-style-selector";
import { type ObjetoPostal, type Remetente } from "@/lib/constants";
import { CorreiosPrepostagemService } from "@/lib/services/correios-prepostagem";
import { SettingsService } from "@/lib/services/settings";
import { toast } from "sonner";

const formSchema = z.object({
  // Remetente
  cpfCnpj: z.string().min(11).max(14),
  nome: z.string().min(1),
  dddTelefone: z.string().min(2).max(2),
  telefone: z.string().min(8).max(9),
  dddCelular: z.string().min(2).max(2),
  celular: z.string().min(8).max(9),
  email: z.string().email(),
  // Endereço do Remetente
  cep: z.string().min(8).max(8),
  logradouro: z.string().min(1),
  numero: z.string().min(1),
  complemento: z.string().optional(),
  bairro: z.string().min(1),
  cidade: z.string().min(1),
  uf: z.string().min(2).max(2),
  // Objeto
  codigoServico: z.string().min(5).max(5),
  peso: z.string().min(1),
  pesoRegistrado: z.string().min(1),
  // Destinatário
  nomeDestinatario: z.string().min(1),
  cepDestinatario: z.string().min(8).max(8),
  logradouroDestinatario: z.string().min(1),
  numeroDestinatario: z.string().min(1),
  complementoDestinatario: z.string().optional(),
  bairroDestinatario: z.string().min(1),
  cidadeDestinatario: z.string().min(1),
  ufDestinatario: z.string().min(2).max(2),
  cnpjDestinatario: z.string().min(11).max(14),
  emailDestinatario: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export function CorreiosPrepostagemForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigoServico: "03220", // Default to SEDEX
      peso: "1",
      pesoRegistrado: "1",
    },
  });

  useEffect(() => {
    const loadRemetente = async () => {
      const remetente = await SettingsService.getRemetente();
      if (remetente) {
        form.reset({
          ...form.getValues(),
          cpfCnpj: remetente.cpfCnpj,
          nome: remetente.nome,
          dddTelefone: remetente.dddTelefone,
          telefone: remetente.telefone,
          dddCelular: remetente.dddCelular,
          celular: remetente.celular,
          email: remetente.email,
          cep: remetente.endereco.cep,
          logradouro: remetente.endereco.logradouro,
          numero: remetente.endereco.numero,
          complemento: remetente.endereco.complemento,
          bairro: remetente.endereco.bairro,
          cidade: remetente.endereco.cidade,
          uf: remetente.endereco.uf,
        });
      }
    };
    loadRemetente();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const remetente: Remetente = {
        cpfCnpj: values.cpfCnpj,
        nome: values.nome,
        dddTelefone: values.dddTelefone,
        telefone: values.telefone,
        dddCelular: values.dddCelular,
        celular: values.celular,
        email: values.email,
        endereco: {
          cep: values.cep,
          logradouro: values.logradouro,
          numero: values.numero,
          complemento: values.complemento,
          bairro: values.bairro,
          cidade: values.cidade,
          uf: values.uf,
        },
      };

      const objeto: ObjetoPostal = {
        cep: values.cepDestinatario,
        logradouro: values.logradouroDestinatario,
        numero: values.numeroDestinatario,
        complemento: values.complementoDestinatario || "",
        bairro: values.bairroDestinatario,
        cidade: values.cidadeDestinatario,
        uf: values.ufDestinatario,
        cnpj: values.cnpjDestinatario,
        email: values.emailDestinatario,
        numeroDestinatario: values.numeroDestinatario,
        complementoDestinatario: values.complementoDestinatario || "",
        nomeDestinatario: values.nomeDestinatario,
        nomeRemetente: values.nome,
        peso: values.peso,
        pesoRegistrado: values.pesoRegistrado,
        dataPostagem: new Date().toLocaleDateString("pt-BR"),
        codigoServico: values.codigoServico,
      };

      const service = new CorreiosPrepostagemService({
        baseUrl: process.env.NEXT_PUBLIC_CORREIOS_PREPOSTAGEM_URL || "",
        username: process.env.NEXT_PUBLIC_CORREIOS_USERNAME || "",
        password: process.env.NEXT_PUBLIC_CORREIOS_PASSWORD || "",
      });

      await service.createPrepostagem(remetente, objeto);

      toast.success("Solicitação de prepostagem criada com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Error creating prepostagem request:", error);
      toast.error("Erro ao criar solicitação de prepostagem");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Remetente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Remetente</h3>
            <FormField
              control={form.control}
              name="cpfCnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dddTelefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DDD</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dddCelular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DDD Celular</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Endereço do Remetente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço do Remetente</h3>
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logradouro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numero"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Destinatário */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Destinatário</h3>
            <FormField
              control={form.control}
              name="nomeDestinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnpjDestinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailDestinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Endereço do Destinatário */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço do Destinatário</h3>
            <FormField
              control={form.control}
              name="cepDestinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logradouroDestinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numeroDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="complementoDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bairroDestinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cidadeDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ufDestinatario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Objeto */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Objeto</h3>
            <FormField
              control={form.control}
              name="codigoServico"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo de Entrega</FormLabel>
                  <FormControl>
                    <DeliveryStyleSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="peso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pesoRegistrado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Registrado</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Criar Solicitação"}
        </Button>
      </form>
    </Form>
  );
}
