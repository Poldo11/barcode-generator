"use client"

import type React from "react"

import { Upload } from "lucide-react"

interface FileUploadAreaProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  isProcessing: boolean
}

export function FileUploadArea({ onFileUpload, isProcessing }: FileUploadAreaProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
          </p>
          <p className="text-xs text-muted-foreground">Arquivos Excel (.xlsx, .xls, .csv)</p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx,.xls,.csv"
          onChange={onFileUpload}
          disabled={isProcessing}
        />
      </label>
    </div>
  )
}

