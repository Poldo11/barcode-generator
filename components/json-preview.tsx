"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

interface JsonPreviewProps {
  data: any[]
  previewCount?: number
  downloadFilename: string
}

export function JsonPreview({ data, previewCount = 3, downloadFilename }: JsonPreviewProps) {
  const downloadJSON = () => {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = downloadFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="border rounded-md p-4 max-h-96 overflow-auto">
        <pre className="text-xs">
          {JSON.stringify(data.slice(0, previewCount), null, 2)}
          {data.length > previewCount ? `\n... e mais ${data.length - previewCount} itens` : ""}
        </pre>
      </div>
      {data.length > 0 && (
        <Button variant="outline" className="mt-4 flex items-center gap-2" onClick={downloadJSON}>
          <FileDown className="h-4 w-4" />
          Baixar JSON
        </Button>
      )}
    </div>
  )
}

