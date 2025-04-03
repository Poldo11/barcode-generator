"use client"

import { Progress } from "@/components/ui/progress"

interface ProcessingIndicatorProps {
  fileName: string | null
  progress: number
}

export function ProcessingIndicator({ fileName, progress }: ProcessingIndicatorProps) {
  return (
    <div className="space-y-2 mb-4">
      <p className="text-sm text-muted-foreground">Processando {fileName}...</p>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

