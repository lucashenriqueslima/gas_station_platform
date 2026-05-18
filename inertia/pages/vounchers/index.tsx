import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Plus } from 'lucide-react'
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

type VouncherRow = {
  id: number
  type: string | null
  typeLabel: string
  partner: string | null
  partnerLabel: string
  currentUtilizations: number
  maxUtilizations: number
  createdBy: string
  isActive: boolean
  isValid: boolean
  expiresAt: string
  createdAt: string
}

type Props = InertiaProps<{
  data: VouncherRow[]
  meta: PaginationMeta
  filters: DataTableFilters
}>

const columns: ColumnDef<VouncherRow>[] = [
  {
    accessorKey: 'type',
    header: 'Tipo',
    enableSorting: true,
    cell: ({ row }) => row.original.typeLabel,
  },
  {
    accessorKey: 'partner',
    header: 'Parceiro',
    enableSorting: true,
    cell: ({ row }) => row.original.partnerLabel,
  },
  {
    id: 'utilizations',
    accessorFn: (row) => `${row.currentUtilizations}/${row.maxUtilizations}`,
    header: 'Utilizações',
    cell: ({ row }) => `${row.original.currentUtilizations}/${row.original.maxUtilizations}`,
  },
  {
    accessorKey: 'createdBy',
    header: 'Criado por',
  },
  {
    accessorKey: 'isValid',
    header: 'Ativo',
    enableSorting: true,
    cell: ({ row }) => (row.original.isValid ? 'Sim' : 'Não'),
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expira em',
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Criado em',
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
            aria-label={`Abrir ações do vouncher ${row.original.id}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/vounchers/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              Ver mais
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function VounchersIndex({ data, meta, filters }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      meta={meta}
      filters={filters}
      searchPlaceholder="Buscar por código, tipo ou parceiro..."
      actions={
        <Link route="vounchers.create">
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo vouncher
          </Button>
        </Link>
      }
    />
  )
}

VounchersIndex.layout = (page: ReactNode) => (
  <AppLayout title="Vounchers" description="Listagem de vouchers disponíveis na plataforma.">
    {page}
  </AppLayout>
)
