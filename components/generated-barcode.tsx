"use client";

import { useRef, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import JsBarcode from "jsbarcode";

interface BarcodeInfo {
  cleanIsbn: string;
  filename: string;
  formattedIsbn: string;
}

interface GeneratedBarcodeProps {
  barcodeInfo: BarcodeInfo;
}

export function GeneratedBarcode({ barcodeInfo }: GeneratedBarcodeProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [barcodeUrl, setBarcodeUrl] = useState<string>("");

  // Generate the barcode SVG when barcodeInfo changes
  useEffect(() => {
    if (barcodeInfo && barcodeRef.current) {
      try {
        // Clear previous barcode
        barcodeRef.current.innerHTML = "";

        // Generate new barcode
        JsBarcode(barcodeRef.current, barcodeInfo.cleanIsbn, {
          format: "EAN13",
          width: 3,
          height: 100,
          displayValue: false,
          margin: 10,
          background: "#FFFFFF",
          lineColor: "#000000",
        });

        // Create download URL
        const svgData = new XMLSerializer().serializeToString(
          barcodeRef.current
        );
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        setBarcodeUrl(url);

        // Clean up URL when component unmounts
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Error generating barcode:", err);
      }
    }
  }, [barcodeInfo]);

  const handleDownload = () => {
    if (barcodeUrl) {
      const link = document.createElement("a");
      link.href = barcodeUrl;
      link.download = barcodeInfo.filename || "isbn-barcode.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Código de Barras Gerado</CardTitle>
        <CardDescription>
          Código de barras vetorial adequado para impressão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <div className="border p-4 w-full max-w-xs">
            <div className="flex justify-center">
              <svg ref={barcodeRef} className="w-full h-auto"></svg>
            </div>
            <div className="mt-2 text-center text-sm">
              {barcodeInfo.formattedIsbn}
            </div>
          </div>
        </div>
        <Button
          className="w-full"
          onClick={handleDownload}
          disabled={!barcodeUrl}
        >
          Baixar Código de Barras SVG
        </Button>
      </CardContent>
    </Card>
  );
}
