import { router } from '@inertiajs/react'
import { type ReactNode, useEffect, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { InertiaProps } from '~/types'
import { Button } from '~/components/ui/button'
import {
  DataTable,
  type DataTableFilterPanelProps,
  type DataTableFilters,
  type PaginationMeta,
} from '~/components/ui/data-table'
import type { AdminTableFilterValues } from '~/components/ui/admin-table-filter-panel'
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
  filterOptions: {
    types: { value: string; label: string }[]
    wasRefueledOptions: { value: string; label: string }[]
    consultedByOptions: { value: string; label: string }[]
  }
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

export default function ConsultationsIndex({ data, meta, filters, filterOptions }: Props) {
  const [filterValues, setFilterValues] = useState<AdminTableFilterValues>(() => ({
    type: typeof filters.type === 'string' ? filters.type : undefined,
    consultedBy: typeof filters.consultedBy === 'string' ? filters.consultedBy : undefined,
    wasRefueled: typeof filters.wasRefueled === 'string' ? filters.wasRefueled : undefined,
    startDate: typeof filters.startDate === 'string' ? filters.startDate : undefined,
    endDate: typeof filters.endDate === 'string' ? filters.endDate : undefined,
  }))

  useEffect(() => {
    setFilterValues({
      type: typeof filters.type === 'string' ? filters.type : undefined,
      consultedBy: typeof filters.consultedBy === 'string' ? filters.consultedBy : undefined,
      wasRefueled: typeof filters.wasRefueled === 'string' ? filters.wasRefueled : undefined,
      startDate: typeof filters.startDate === 'string' ? filters.startDate : undefined,
      endDate: typeof filters.endDate === 'string' ? filters.endDate : undefined,
    })
  }, [filters])

  const navigateWithFilters = (nextValues: AdminTableFilterValues) => {
    setFilterValues(nextValues)

    const query: Record<string, string> = {}
    if (typeof filters.search === 'string' && filters.search) query.search = filters.search
    if (typeof filters.sort === 'string' && filters.sort) query.sort = filters.sort
    if (typeof filters.order === 'string' && filters.order) query.order = filters.order
    if (typeof filters.perPage === 'number' && filters.perPage !== 10) {
      query.perPage = String(filters.perPage)
    }
    if (nextValues.type) query.type = nextValues.type
    if (nextValues.consultedBy) query.consultedBy = nextValues.consultedBy
    if (nextValues.wasRefueled) query.wasRefueled = nextValues.wasRefueled
    if (nextValues.startDate) query.startDate = nextValues.startDate
    if (nextValues.endDate) query.endDate = nextValues.endDate

    router.get(window.location.pathname, query, { preserveState: true, replace: true })
  }

  const filterPanel: DataTableFilterPanelProps = {
    fields: [
      {
        key: 'type',
        label: 'Type',
        type: 'combobox',
        placeholder: 'Selecione um tipo',
        options: filterOptions.types,
        emptyLabel: 'Nenhum tipo encontrado.',
      },
      {
        key: 'wasRefueled',
        label: 'Was Refueled',
        type: 'combobox',
        placeholder: 'Selecione uma opção',
        options: filterOptions.wasRefueledOptions,
        emptyLabel: 'Nenhuma opção encontrada.',
      },
      {
        key: 'consultedBy',
        label: 'Consulted By',
        type: 'combobox',
        placeholder: 'Selecione uma origem',
        options: filterOptions.consultedByOptions,
        emptyLabel: 'Nenhuma origem encontrada.',
      },
      {
        key: 'startDate',
        label: 'Data inicial',
        type: 'date',
      },
      {
        key: 'endDate',
        label: 'Data final',
        type: 'date',
      },
    ],
    values: filterValues,
    onValuesChange: navigateWithFilters,
    onClear: () => navigateWithFilters({}),
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      meta={meta}
      filters={filters}
      searchPlaceholder="Buscar por placa, parceiro ou origem..."
      filterPanel={filterPanel}
    />
  )
}

ConsultationsIndex.layout = (page: ReactNode) => (
  <AppLayout title="Consultas" description="Listagem das consultas realizadas na plataforma.">
    {page}
  </AppLayout>
)
