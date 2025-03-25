"use client";

import { Barcode, Search, Truck, FileText } from "lucide-react";
import { BarcodeGeneratorForm } from "@/components/barcode-generator-form";
import { CorreiosCard } from "@/components/correios-card";
import { GeneratedBarcode } from "@/components/generated-barcode";
import { useState } from "react";

interface BarcodeInfo {
  cleanIsbn: string;
  filename: string;
  formattedIsbn: string;
}

export default function Home() {
  const [barcodeInfo, setBarcodeInfo] = useState<BarcodeInfo | null>(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gerador de Código de Barras ISBN</h1>
      <p className="text-muted-foreground">
        Gere e baixe códigos de barras ISBN de alta qualidade para seus
        produtos.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <BarcodeGeneratorForm onBarcodeGenerated={setBarcodeInfo} />

        <CorreiosCard
          icon={<Search className="h-5 w-5" />}
          title="Rastreamento"
          description="Rastreie pacotes e acompanhe o status das entregas"
          href="/correios/tracking"
        />

        <CorreiosCard
          icon={<Truck className="h-5 w-5" />}
          title="Envios"
          description="Gerencie seus envios e crie novas postagens"
          href="/correios/shipping"
        />

        <CorreiosCard
          icon={<FileText className="h-5 w-5" />}
          title="Relatórios"
          description="Visualize e exporte relatórios de entregas"
          href="/correios/reports"
        />
      </div>

      {barcodeInfo && <GeneratedBarcode barcodeInfo={barcodeInfo} />}
    </div>
  );
}
