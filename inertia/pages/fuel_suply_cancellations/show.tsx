import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, CalendarClock, FileText, Fuel, Hash, UserRound } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { InertiaProps } from '~/types'

type FuelSuplyCancellationDetails = {
  id: number
  plate: string
  reason: string
  user: {
    id: number
    name: string
  } | null
  gasStationName: string | null
  createdAt: string
  updatedAt: string | null
}

type Props = InertiaProps<{
  cancellation: FuelSuplyCancellationDetails
}>

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border bg-background/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

export default function FuelSuplyCancellationsShow({ cancellation }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Cancelamento #{cancellation.id}</Badge>
            <Badge variant="destructive">Abastecimento cancelado</Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{cancellation.plate}</h2>
          <p className="text-sm text-muted-foreground">
            Visualizacao completa dos detalhes registrados para este cancelamento.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/cancelamentos-abastecimento">
            <ArrowLeft className="h-4 w-4" />
            Voltar para cancelamentos
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem
          label="ID do registro"
          value={
            <span className="inline-flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              {cancellation.id}
            </span>
          }
        />
        <DetailItem
          label="Placa"
          value={
            <span className="inline-flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              {cancellation.plate}
            </span>
          }
        />
        <DetailItem label="Posto" value={cancellation.gasStationName ?? 'Nao informado'} />
        <DetailItem
          label="Usuário"
          value={
            cancellation.user ? (
              <Link
                href={`/usuarios/${cancellation.user.id}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <UserRound className="h-4 w-4" />
                {cancellation.user.name}
              </Link>
            ) : (
              'Nao informado'
            )
          }
        />
        <DetailItem
          label="Criado em"
          value={
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              {cancellation.createdAt}
            </span>
          }
        />
        <DetailItem label="Atualizado em" value={cancellation.updatedAt ?? 'Nao atualizado'} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Motivo do cancelamento
          </CardTitle>
          <CardDescription>Justificativa enviada no aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap rounded-lg border bg-background/70 p-4 text-sm leading-6 text-foreground">
            {cancellation.reason}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

FuelSuplyCancellationsShow.layout = (page: ReactNode) => (
  <AppLayout
    title="Detalhes do cancelamento"
    description="Visualize todos os dados salvos para o cancelamento de abastecimento."
  >
    {page}
  </AppLayout>
)
