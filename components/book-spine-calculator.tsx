"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Tipos de papel e seus fatores
const PAPER_TYPES = [
  { name: "Polen Soft 80g/m²", factor: 0.095, grammage: 80 },
  { name: "Polen Soft Premium 80g/m²", factor: 0.108, grammage: 80 },
  { name: "Polen Bold 70g/m²", factor: 0.124, grammage: 70 },
  { name: "Polen Bold 90g/m²", factor: 0.144, grammage: 90 },
  { name: "Offset 56g/m²", factor: 0.074, grammage: 56 },
  { name: "Offset 63g/m²", factor: 0.081, grammage: 63 },
  { name: "Offset 70g/m²", factor: 0.09, grammage: 70 },
  { name: "Offset 75g/m²", factor: 0.097, grammage: 75 },
  { name: "Offset 80g/m²", factor: 0.102, grammage: 80 },
  { name: "Offset 90g/m²", factor: 0.115, grammage: 90 },
  { name: "Offset 120g/m²", factor: 0.145, grammage: 120 },
  { name: "Lux Cream 70g/m²", factor: 0.131578947368421, grammage: 70 },
  { name: "Chamois Bulk 80g/m²", factor: 0.13, grammage: 80 },
  { name: "Couchê Fosco 90g/m²", factor: 0.96, grammage: 90 },
  { name: "Ivory Cold 65g/m²", factor: 0.96, grammage: 65 },
];

export default function BookSpineCalculator() {
  const [pages, setPages] = useState<number>(0);
  const [selectedPaperIndex, setSelectedPaperIndex] = useState<number>(0);
  const [bookHeight, setBookHeight] = useState<number>(210);
  const [bookWidth, setBookWidth] = useState<number>(140);
  const [results, setResults] = useState<{
    sheets: number;
    spineWidth: number;
    insideWeight: number;
    coverWeight: number;
    totalWeight: number;
  } | null>(null);

  const calculateSpineAndWeight = () => {
    if (pages <= 0 || bookHeight <= 0 || bookWidth <= 0) return;

    const sheets = pages / 2;
    const selectedPaper = PAPER_TYPES[selectedPaperIndex];
    const spineWidth = selectedPaper.factor * sheets;

    // Converter dimensões de mm para m para cálculo de peso
    const heightInM = bookHeight / 1000;
    const widthInM = bookWidth / 1000;
    const spineWidthInM = spineWidth / 10; // Converter de mm para cm para m

    // Calcular peso do miolo (g)
    const insideWeight = heightInM * widthInM * sheets * selectedPaper.grammage;

    // Calcular peso da capa (g) - assumindo papel de capa de 250g/m²
    const coverWeight = (widthInM * 2 + spineWidthInM) * heightInM * 250;

    // Peso total em gramas
    const totalWeight = insideWeight + coverWeight;

    setResults({
      sheets,
      spineWidth,
      insideWeight,
      coverWeight,
      totalWeight,
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Especificações do Livro</CardTitle>
          <CardDescription>
            Insira os detalhes do seu livro para calcular a largura da lombada e
            o peso.
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calculateSpineAndWeight();
          }}
        >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pages">Número de Páginas</Label>
              <Input
                id="pages"
                type="number"
                min="0"
                value={pages || ""}
                onChange={(e) => setPages(Number.parseInt(e.target.value) || 0)}
                placeholder="Insira o número de páginas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paper-type">Tipo de Papel</Label>
              <Select
                value={selectedPaperIndex.toString()}
                onValueChange={(value) =>
                  setSelectedPaperIndex(Number.parseInt(value))
                }
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

            <Separator className="my-4" />

            <div className="space-y-2">
              <Label htmlFor="book-height">Altura do Livro (mm)</Label>
              <Input
                id="book-height"
                type="number"
                min="0"
                value={bookHeight || ""}
                onChange={(e) =>
                  setBookHeight(Number.parseInt(e.target.value) || 0)
                }
                placeholder="Insira a altura do livro em mm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="book-width">Largura do Livro (mm)</Label>
              <Input
                id="book-width"
                type="number"
                min="0"
                value={bookWidth || ""}
                onChange={(e) =>
                  setBookWidth(Number.parseInt(e.target.value) || 0)
                }
                placeholder="Insira a largura do livro em mm"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calcular
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
          <CardDescription>
            Cálculos de largura da lombada e peso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {results ? (
            <div className="space-y-6">
              {/* Resultados Principais - Mais Importantes */}
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Largura da Lombada
                  </p>
                  <p className="text-3xl font-bold">
                    {results.spineWidth.toFixed(2)} mm
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Peso Total
                  </p>
                  <p className="text-3xl font-bold">
                    {results.totalWeight.toFixed(2)} g
                  </p>
                  <p className="text-lg">
                    ({(results.totalWeight / 1000).toFixed(3)} kg)
                  </p>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Resultados Secundários - Informações de Apoio */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Folhas</p>
                  <p className="font-medium">{results.sheets.toFixed(0)}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Peso do Miolo</p>
                  <p className="font-medium">
                    {results.insideWeight.toFixed(2)} g
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-muted-foreground">Peso da Capa</p>
                  <p className="font-medium">
                    {results.coverWeight.toFixed(2)} g
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-muted-foreground">
                Insira os detalhes do livro e clique em Calcular para ver os
                resultados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
