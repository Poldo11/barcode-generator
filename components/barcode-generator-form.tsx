"use client";

import { useState, FormEvent } from "react";
import { Barcode } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BarcodeInfo {
  cleanIsbn: string;
  filename: string;
  formattedIsbn: string;
}

interface BarcodeGeneratorFormProps {
  onBarcodeGenerated: (info: BarcodeInfo) => void;
}

export function BarcodeGeneratorForm({
  onBarcodeGenerated,
}: BarcodeGeneratorFormProps) {
  const [isbnData, setIsbnData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper function to clean ISBN input
  const cleanIsbnInput = (input: string): string => {
    return input.replace(/[^\d-]/g, "");
  };

  // Function to validate ISBN format
  const isValidIsbn = (isbn: string): boolean => {
    const cleanIsbn = isbn.replace(/[-\s]/g, "");
    return /^978\d{10}$/.test(cleanIsbn);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate input
      if (!isValidIsbn(isbnData)) {
        throw new Error(
          "Digite um ISBN-13 válido que comece com 978 e contenha 13 dígitos no total"
        );
      }

      const response = await fetch(`/api/generate-barcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isbnData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error validating ISBN");
      }

      onBarcodeGenerated(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro desconhecido"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Barcode className="h-5 w-5" />
          Gerador de Código de Barras
        </CardTitle>
        <CardDescription>
          Gere códigos de barras ISBN-13 para seus produtos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="isbnData" className="text-sm font-medium">
              Digite o ISBN-13 (deve começar com 978)
            </label>
            <Input
              id="isbnData"
              value={isbnData}
              onChange={(e) => setIsbnData(cleanIsbnInput(e.target.value))}
              placeholder="978-65-85892-35-3"
            />
            <p className="text-xs text-muted-foreground">
              Formato: 978-xx-xxxxx-xx-x (hífens são opcionais)
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-500">
              <p>{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Gerando..." : "Gerar Código de Barras"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
