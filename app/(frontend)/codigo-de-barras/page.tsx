"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JsBarcode from "jsbarcode";

interface BarcodeInfo {
  cleanIsbn: string;
  filename: string;
  formattedIsbn: string;
}

export default function ISBNBarcodeGenerator() {
  const [isbn, setIsbn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [barcodeInfo, setBarcodeInfo] = useState<BarcodeInfo | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [barcodeUrl, setBarcodeUrl] = useState<string>("");

  // Helper function to clean ISBN input
  const cleanIsbnInput = (input: string): string => {
    return input.replace(/[^\d-]/g, "");
  };

  // Function to validate ISBN format
  const isValidIsbn = (isbn: string): boolean => {
    const cleanIsbn = isbn.replace(/[-\s]/g, "");
    return /^978\d{10}$/.test(cleanIsbn);
  };

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
        setError("Failed to generate barcode SVG");
      }
    }
  }, [barcodeInfo]);

  const handleGenerateBarcode = () => {
    setLoading(true);
    setError("");
    setBarcodeInfo(null);
    setBarcodeUrl("");
    setIsGenerated(false);

    try {
      // Validate input
      if (!isValidIsbn(isbn)) {
        throw new Error(
          "Digite um ISBN-13 válido que comece com 978 e contenha 13 dígitos no total"
        );
      }

      // Format the ISBN
      const cleanIsbn = isbn.replace(/[-\s]/g, "");
      const formattedIsbn = cleanIsbn.replace(
        /^(\d{3})(\d{1,5})(\d{1,7})(\d{1,6})(\d{1})$/,
        "$1-$2-$3-$4-$5"
      );

      // Set barcode info
      setBarcodeInfo({
        cleanIsbn,
        filename: `isbn-${cleanIsbn}.svg`,
        formattedIsbn,
      });
      setIsGenerated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSVG = () => {
    if (barcodeUrl) {
      const link = document.createElement("a");
      link.href = barcodeUrl;
      link.download = barcodeInfo?.filename || "isbn-barcode.svg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Gerador de Código de Barras ISBN
          </CardTitle>
          <CardDescription>
            Gere e baixe códigos de barras ISBN de alta qualidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="isbn" className="block text-sm font-medium">
              Digite o ISBN-13 (deve começar com 978)
            </label>
            <Input
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(cleanIsbnInput(e.target.value))}
              placeholder="978-65-83003-47-8"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Formato: 978-xx-xxxxx-xx-x (hífens são opcionais)
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              <p>{error}</p>
            </div>
          )}

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600"
            onClick={handleGenerateBarcode}
            disabled={loading}
          >
            {loading ? "Gerando..." : "Gerar Código de Barras ISBN"}
          </Button>

          {isGenerated && barcodeInfo && (
            <div className="space-y-4 pt-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  Código de Barras ISBN Gerado!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Código de barras vetorial adequado para impressão
                </p>
              </div>

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
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={handleDownloadSVG}
                disabled={!barcodeUrl}
              >
                Baixar Código de Barras SVG
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
