import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, CalendarClock, Hash, IdCard, Phone, UserRound } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { InertiaProps } from '~/types'

type AssociateLeadDetails = {
  id: number
  ilevaAssociateId: number | null
  ilevaLeadId: number | null
  name: string | null
  phone: string | null
  user: {
    id: number
    name: string
  } | null
  gasStationName: string | null
  createdAt: string
  updatedAt: string | null
}

type Props = InertiaProps<{
  associateLead: AssociateLeadDetails
}>

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border bg-background/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

export default function AssociateLeadsShow({ associateLead }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Lead associado #{associateLead.id}</Badge>
            <Badge variant={associateLead.ilevaLeadId ? 'success' : 'secondary'}>
              {associateLead.ilevaLeadId ? 'Enviado ao Ileva' : 'Sem lead Ileva'}
            </Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {associateLead.name ?? 'Nome nao informado'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Visualizacao completa dos detalhes registrados para esta indicacao.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/leads-associados">
            <ArrowLeft className="h-4 w-4" />
            Voltar para leads
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem
          label="ID do registro"
          value={
            <span className="inline-flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              {associateLead.id}
            </span>
          }
        />
        <DetailItem
          label="Nome"
          value={
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {associateLead.name ?? 'Nao informado'}
            </span>
          }
        />
        <DetailItem
          label="Telefone"
          value={
            associateLead.phone ? (
              <a
                href={`tel:${associateLead.phone}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Phone className="h-4 w-4" />
                {associateLead.phone}
              </a>
            ) : (
              'Nao informado'
            )
          }
        />
        <DetailItem
          label="ID do associado Ileva"
          value={
            <span className="inline-flex items-center gap-2">
              <IdCard className="h-4 w-4 text-muted-foreground" />
              {associateLead.ilevaAssociateId ?? 'Nao informado'}
            </span>
          }
        />
        <DetailItem label="ID do lead Ileva" value={associateLead.ilevaLeadId ?? 'Nao informado'} />
        <DetailItem label="Posto" value={associateLead.gasStationName ?? 'Nao informado'} />
        <DetailItem
          label="Usuário"
          value={
            associateLead.user ? (
              <Link
                href={`/usuarios/${associateLead.user.id}`}
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <UserRound className="h-4 w-4" />
                {associateLead.user.name}
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
              {associateLead.createdAt}
            </span>
          }
        />
        <DetailItem label="Atualizado em" value={associateLead.updatedAt ?? 'Nao atualizado'} />
      </div>
    </div>
  )
}

AssociateLeadsShow.layout = (page: ReactNode) => (
  <AppLayout
    title="Detalhes do lead associado"
    description="Visualize todos os dados salvos para o lead associado."
  >
    {page}
  </AppLayout>
)
