import { SenderSettingsForm } from "@/components/sender-settings-form";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Configurações</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Remetente Padrão</h2>
          <p className="text-gray-600">
            Configure as informações do remetente que serão usadas como padrão
            em todas as solicitações de prepostagem.
          </p>
        </div>
        <SenderSettingsForm />
      </div>
    </div>
  );
}
