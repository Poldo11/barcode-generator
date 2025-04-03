"use client";

import { useEffect } from "react";
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
import { type Remetente } from "@/lib/constants";
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
});

type FormValues = z.infer<typeof formSchema>;

export function SenderSettingsForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const remetente = await SettingsService.getRemetente();
        if (remetente) {
          form.reset({
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
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Erro ao carregar configurações");
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (values: FormValues) => {
    try {
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

      await SettingsService.saveRemetente(remetente);
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erro ao salvar configurações");
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
        </div>

        <Button type="submit">Salvar Configurações</Button>
      </form>
    </Form>
  );
}
