import { router } from '@inertiajs/react'
import { type ReactNode, useEffect, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { InertiaProps } from '~/types'
import { Badge } from '~/components/ui/badge'
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

type AssociateLeadRow = {
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
  data: AssociateLeadRow[]
  meta: PaginationMeta
  filters: DataTableFilters
  filterOptions: {
    users: { value: string; label: string }[]
    gasStations: { value: string; label: string }[]
    ilevaLeadStatuses: { value: string; label: string }[]
  }
}>

const columns: ColumnDef<AssociateLeadRow>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    enableSorting: true,
    cell: ({ row }) => row.original.name ?? 'Nao informado',
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    enableSorting: true,
    cell: ({ row }) => row.original.phone ?? 'Nao informado',
  },
  {
    accessorKey: 'ilevaAssociateId',
    header: 'Associado Ileva',
    enableSorting: true,
    cell: ({ row }) => row.original.ilevaAssociateId ?? 'Nao informado',
  },
  {
    accessorKey: 'ilevaLeadId',
    header: 'Lead Ileva',
    enableSorting: true,
    cell: ({ row }) =>
      row.original.ilevaLeadId ? (
        row.original.ilevaLeadId
      ) : (
        <Badge variant="secondary">Nao vinculado</Badge>
      ),
  },
  {
    accessorKey: 'gasStationName',
    header: 'Posto',
    enableSorting: false,
    cell: ({ row }) => row.original.gasStationName ?? 'Nao informado',
  },
  {
    id: 'user',
    header: 'Usuário',
    enableSorting: false,
    cell: ({ row }) =>
      row.original.user ? (
        <Link
          href={`/usuarios/${row.original.user.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.user.name}
        </Link>
      ) : (
        'Nao informado'
      ),
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
            aria-label={`Abrir ações do lead associado ${row.original.id}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/leads-associados/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              Ver mais
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function valuesFromFilters(filters: DataTableFilters): AdminTableFilterValues {
  return {
    userId: typeof filters.userId === 'string' ? filters.userId : undefined,
    gasStationId: typeof filters.gasStationId === 'string' ? filters.gasStationId : undefined,
    ilevaLeadStatus:
      typeof filters.ilevaLeadStatus === 'string' ? filters.ilevaLeadStatus : undefined,
    startDate: typeof filters.startDate === 'string' ? filters.startDate : undefined,
    endDate: typeof filters.endDate === 'string' ? filters.endDate : undefined,
  }
}

export default function AssociateLeadsIndex({ data, meta, filters, filterOptions }: Props) {
  const [filterValues, setFilterValues] = useState<AdminTableFilterValues>(() =>
    valuesFromFilters(filters)
  )

  useEffect(() => {
    setFilterValues(valuesFromFilters(filters))
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
    if (nextValues.userId) query.userId = nextValues.userId
    if (nextValues.gasStationId) query.gasStationId = nextValues.gasStationId
    if (nextValues.ilevaLeadStatus) query.ilevaLeadStatus = nextValues.ilevaLeadStatus
    if (nextValues.startDate) query.startDate = nextValues.startDate
    if (nextValues.endDate) query.endDate = nextValues.endDate

    router.get(window.location.pathname, query, { preserveState: true, replace: true })
  }

  const filterPanel: DataTableFilterPanelProps = {
    fields: [
      {
        key: 'gasStationId',
        label: 'Posto',
        type: 'combobox',
        placeholder: 'Selecione um posto',
        options: filterOptions.gasStations,
        emptyLabel: 'Nenhum posto encontrado.',
      },
      {
        key: 'userId',
        label: 'Usuário',
        type: 'combobox',
        placeholder: 'Selecione um usuário',
        options: filterOptions.users,
        emptyLabel: 'Nenhum usuário encontrado.',
      },
      {
        key: 'ilevaLeadStatus',
        label: 'Lead Ileva',
        type: 'combobox',
        placeholder: 'Selecione um status',
        options: filterOptions.ilevaLeadStatuses,
        emptyLabel: 'Nenhum status encontrado.',
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
      searchPlaceholder="Buscar por nome, telefone ou IDs..."
      filterPanel={filterPanel}
    />
  )
}

AssociateLeadsIndex.layout = (page: ReactNode) => (
  <AppLayout
    title="Leads associados"
    description="Listagem dos leads indicados por associados no aplicativo."
  >
    {page}
  </AppLayout>
)
