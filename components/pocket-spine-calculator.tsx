"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Simplified paper types with just the most common ones
const PAPER_TYPES = [
  { name: "Polen Bold 70g/m²", factor: 0.136 },
  { name: "Polen Soft 80g/m²", factor: 0.095 },
  { name: "Offset 70g/m²", factor: 0.09 },
  { name: "Offset 90g/m²", factor: 0.115 },
  { name: "Couchê Fosco 90g/m²", factor: 0.96 },
];

export default function PocketSpineCalculator() {
  const [pages, setPages] = useState<number>(0);
  const [selectedPaperIndex, setSelectedPaperIndex] = useState<number>(0);
  const [spineWidth, setSpineWidth] = useState<number | null>(null);

  const calculateSpine = () => {
    if (pages <= 0) return;

    const sheets = pages / 2;
    const selectedPaper = PAPER_TYPES[selectedPaperIndex];
    const calculatedSpineWidth = selectedPaper.factor * sheets;
    setSpineWidth(calculatedSpineWidth);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora de Lombada</CardTitle>
        <CardDescription>
          Calcule a largura da lombada do seu livro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pages">Número de Páginas</Label>
          <Input
            id="pages"
            type="number"
            min="0"
            value={pages || ""}
            onChange={(e) => {
              const value = Number.parseInt(e.target.value) || 0;
              setPages(value);
              if (value > 0) calculateSpine();
            }}
            placeholder="Insira o número de páginas"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paper-type">Tipo de Papel</Label>
          <Select
            value={selectedPaperIndex.toString()}
            onValueChange={(value) => {
              setSelectedPaperIndex(Number.parseInt(value));
              if (pages > 0) calculateSpine();
            }}
          >
            <SelectTrigger id="paper-type">
              <SelectValue placeholder="Selecione o tipo de papel" />
            </SelectTrigger>
            <SelectContent>
              {PAPER_TYPES.map((paper, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {paper.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {spineWidth !== null && (
          <div className="p-4 bg-muted rounded-lg mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Largura da Lombada
            </p>
            <p className="text-2xl font-bold">{spineWidth.toFixed(2)} mm</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
