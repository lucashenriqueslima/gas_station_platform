import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, CalendarClock, Eye, Fuel, Hash, ImageIcon, Info, UserRound } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { InertiaProps } from '~/types'

type ConsultationDetails = {
  id: number
  ilevaVehicleId: number | null
  licensePlate: string
  partner: string | null
  partnerLabel: string | null
  vehicleSituation: string
  wasRefueled: boolean
  consultedBy: string
  consultedByLabel: string
  fuelPumpVisorImage: string | null
  createdAt: string
  updatedAt: string | null
}

type Props = InertiaProps<{
  consultation: ConsultationDetails
}>

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border bg-background/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

export default function ConsultationsShow({ consultation }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Consulta #{consultation.id}</Badge>
            <Badge variant={consultation.wasRefueled ? 'success' : 'secondary'}>
              {consultation.wasRefueled ? 'Abastecido' : 'Nao abastecido'}
            </Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{consultation.licensePlate}</h2>
          <p className="text-sm text-muted-foreground">
            Visualizacao completa dos detalhes registrados para este abastecimento.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/consultas">
            <ArrowLeft className="h-4 w-4" />
            Voltar para consultas
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem
          label="ID da consulta"
          value={
            <span className="inline-flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              {consultation.id}
            </span>
          }
        />
        <DetailItem
          label="ID do veiculo Ileva"
          value={consultation.ilevaVehicleId ?? 'Nao informado'}
        />
        <DetailItem
          label="Placa"
          value={
            <span className="inline-flex items-center gap-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              {consultation.licensePlate}
            </span>
          }
        />
        <DetailItem
          label="Parceiro"
          value={consultation.partnerLabel || consultation.partner || 'Nao informado'}
        />
        <DetailItem
          label="Consultado por"
          value={
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {consultation.consultedByLabel}
            </span>
          }
        />
        <DetailItem label="Origem da consulta" value={consultation.consultedBy} />
        <DetailItem
          label="Situacao do veiculo"
          value={
            <span className="inline-flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              {consultation.vehicleSituation}
            </span>
          }
        />
        <DetailItem
          label="Status do abastecimento"
          value={consultation.wasRefueled ? 'Sim' : 'Nao'}
        />
        <DetailItem
          label="Imagem do visor"
          value={
            consultation.fuelPumpVisorImage ? (
              <a
                href={consultation.fuelPumpVisorImage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Eye className="h-4 w-4" />
                Abrir imagem
              </a>
            ) : (
              'Nao enviada'
            )
          }
        />
        <DetailItem
          label="Criado em"
          value={
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              {consultation.createdAt}
            </span>
          }
        />
        <DetailItem label="Atualizado em" value={consultation.updatedAt ?? 'Nao atualizado'} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Comprovante do abastecimento
          </CardTitle>
          <CardDescription>Imagem do visor da bomba vinculada a esta consulta.</CardDescription>
        </CardHeader>
        <CardContent>
          {consultation.fuelPumpVisorImage ? (
            <a href={consultation.fuelPumpVisorImage} target="_blank" rel="noreferrer">
              <img
                src={consultation.fuelPumpVisorImage}
                alt={`Visor do abastecimento da consulta ${consultation.id}`}
                className="max-h-[28rem] w-full rounded-lg border object-contain"
              />
            </a>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Nenhuma imagem enviada para este abastecimento.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

ConsultationsShow.layout = (page: ReactNode) => (
  <AppLayout
    title="Detalhes do abastecimento"
    description="Visualize todos os dados salvos para a consulta e seu abastecimento."
  >
    {page}
  </AppLayout>
)
