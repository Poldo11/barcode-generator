import { Search, Truck, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CorreiosManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestão de Entregas Correios</h1>
      <p className="text-muted-foreground">
        Gerencie suas entregas pelos Correios, rastreie pacotes e gere relatórios.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Rastreamento
            </CardTitle>
            <CardDescription>Rastreie pacotes e acompanhe o status das entregas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <a href="/correios/tracking">Acessar Rastreamento</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Envios
            </CardTitle>
            <CardDescription>Gerencie seus envios e crie novas postagens</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <a href="/correios/shipping">Gerenciar Envios</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Relatórios
            </CardTitle>
            <CardDescription>Visualize e exporte relatórios de entregas</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <a href="/correios/reports">Ver Relatórios</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

