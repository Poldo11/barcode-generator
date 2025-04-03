"use client"

import type React from "react"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { FileUploadArea } from "@/components/file-upload-area"
import { JsonPreview } from "@/components/json-preview"
import { ProcessingIndicator } from "@/components/processing-indicator"
import {
  processarDados,
  type ResultadoProcessamento,
  type ObjetoSimples,
  type ObjetoRegistrado,
} from "@/lib/utils/converters"

export function ExcelToJsonConverter() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [objetosSimples, setObjetosSimples] = useState<ObjetoSimples[]>([])
  const [objetosRegistrados, setObjetosRegistrados] = useState<ObjetoRegistrado[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [nomeArquivo, setNomeArquivo] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    try {
      setIsProcessing(true)
      setProgress(10)
      setErro(null)
      setNomeArquivo(arquivo.name)

      // Lê o arquivo Excel
      const dados = await arquivo.arrayBuffer()
      setProgress(30)

      // Analisa os dados do Excel
      const workbook = XLSX.read(dados, { type: "array" })
      setProgress(50)

      // Obtém a primeira planilha
      const nomeWorksheet = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[nomeWorksheet]

      // Converte para JSON
      const dadosJson = XLSX.utils.sheet_to_json(worksheet)
      setProgress(70)

      // Processa os dados
      const resultado: ResultadoProcessamento = processarDados(dadosJson)
      setObjetosSimples(resultado.objetosSimples)
      setObjetosRegistrados(resultado.objetosRegistrados)
      setProgress(100)
    } catch (err) {
      console.error("Erro ao processar arquivo:", err)
      setErro("Erro ao processar arquivo. Por favor, verifique o formato e tente novamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Conversor de Excel para JSON dos Correios</CardTitle>
      </CardHeader>
      <CardContent>
        {erro && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{erro}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <FileUploadArea onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        </div>

        {isProcessing && <ProcessingIndicator fileName={nomeArquivo} progress={progress} />}

        {(objetosSimples.length > 0 || objetosRegistrados.length > 0) && (
          <Tabs defaultValue="simples" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simples">Objetos Simples ({objetosSimples.length})</TabsTrigger>
              <TabsTrigger value="registrados">Objetos Registrados ({objetosRegistrados.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="simples" className="mt-4">
              <JsonPreview data={objetosSimples} downloadFilename="correios_objetos_simples.json" />
            </TabsContent>
            <TabsContent value="registrados" className="mt-4">
              <JsonPreview data={objetosRegistrados} downloadFilename="correios_objetos_registrados.json" />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {objetosSimples.length > 0 || objetosRegistrados.length > 0
            ? `Processados ${objetosSimples.length + objetosRegistrados.length} registros`
            : "Faça upload de um arquivo Excel para convertê-lo em JSON"}
        </p>
      </CardFooter>
    </Card>
  )
}

