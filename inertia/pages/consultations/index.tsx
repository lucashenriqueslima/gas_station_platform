import { type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import AppLayout from '~/layouts/app'
import { InertiaProps } from '~/types'
import { DataTable, type DataTableFilters, type PaginationMeta } from '~/components/ui/data-table'

type ConsultationRow = {
  id: number
  licensePlate: string
  partner: string
  consultedBy: string
  createdAt: string
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
    accessorKey: 'partner',
    header: 'Parceiro',
    enableSorting: true,
  },
  {
    accessorKey: 'consultedBy',
    header: 'Consultado por',
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    enableSorting: true,
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
