"use client";

import { BarcodeGeneratorForm } from "@/components/barcode-generator-form";
import { GeneratedBarcode } from "@/components/generated-barcode";
import PocketSpineCalculator from "@/components/pocket-spine-calculator";
import { useState } from "react";

interface BarcodeInfo {
  cleanIsbn: string;
  filename: string;
  formattedIsbn: string;
}

export default function Home() {
  const [barcodeInfo, setBarcodeInfo] = useState<BarcodeInfo | null>(null);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Gerador de Código de Barras ISBN</h1>
      <p className="text-muted-foreground">
        Gere e baixe códigos de barras ISBN de alta qualidade para seus
        produtos.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <BarcodeGeneratorForm onBarcodeGenerated={setBarcodeInfo} />
        <PocketSpineCalculator />
      </div>

      {barcodeInfo && <GeneratedBarcode barcodeInfo={barcodeInfo} />}
    </div>
  );
}
