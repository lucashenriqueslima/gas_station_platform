import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { InertiaProps } from '~/types'
import { Button } from '~/components/ui/button'
import { DataTable, type DataTableFilters, type PaginationMeta } from '~/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

type ConsultationRow = {
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
  data: ConsultationRow[]
  meta: PaginationMeta
  filters: DataTableFilters
}>

const columns: ColumnDef<ConsultationRow>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
  },
  {
    accessorKey: 'licensePlate',
    header: 'Placa',
    enableSorting: true,
  },
  {
    accessorKey: 'partnerLabel',
    header: 'Parceiro',
    enableSorting: true,
  },
  {
    accessorKey: 'consultedByLabel',
    header: 'Consultado por',
    enableSorting: true,
  },
  {
    accessorKey: 'wasRefueled',
    header: 'Foi Abastecido',
    enableSorting: true,
    cell: ({ row }) => (row.original.wasRefueled ? 'Sim' : 'Não'),
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Abrir ações da consulta ${row.original.id}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/consultas/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              Ver mais
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function ConsultationsIndex({ data, meta, filters }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      meta={meta}
      filters={filters}
      searchPlaceholder="Buscar por placa, parceiro ou origem..."
    />
  )
}

ConsultationsIndex.layout = (page: ReactNode) => (
  <AppLayout title="Consultas" description="Listagem das consultas realizadas na plataforma.">
    {page}
  </AppLayout>
)
