import { CorreiosPrepostagemForm } from "@/components/correios-prepostagem-form";

export default function PrepostagemPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">
        Criar Solicitação de Prepostagem
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <CorreiosPrepostagemForm />
      </div>
    </div>
  );
}
