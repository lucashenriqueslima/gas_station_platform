import { type ReactNode } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Link } from '@adonisjs/inertia/react'
import { Edit, Eye, MoreHorizontal, Plus } from 'lucide-react'
import { Data } from '@generated/data'
import AppLayout from '~/layouts/app'
import { InertiaProps } from '~/types'
import { DataTable, type DataTableFilters, type PaginationMeta } from '~/components/ui/data-table'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

type Props = InertiaProps<{
  data: Data.User.Variants['toIndexView'][]
  meta: PaginationMeta
  filters: DataTableFilters
}>

const columns: ColumnDef<Data.User.Variants['toIndexView']>[] = [
  {
    accessorKey: 'fullName',
    header: 'Nome',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'E-mail',
    enableSorting: true,
  },
  {
    accessorKey: 'roleLabel',
    header: 'Perfil',
    enableSorting: true,
    cell: ({ row }) => row.original.roleLabel ?? 'Desconhecido',
  },
  {
    accessorKey: 'formattedCreatedAt',
    header: 'Cadastrado em',
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
            aria-label={`Abrir ações do usuário ${row.original.id}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/usuarios/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              Ver mais
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/usuarios/${row.original.id}/edit`}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function UsersIndex({ data, meta, filters }: Props) {
  return (
    <DataTable
      columns={columns}
      data={data}
      meta={meta}
      filters={filters}
      searchPlaceholder="Buscar por nome ou e-mail..."
      actions={
        <Link route="users.create">
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Novo usuário
          </Button>
        </Link>
      }
    />
  )
}

UsersIndex.layout = (page: ReactNode) => (
  <AppLayout title="Usuários" description="Gerencie os usuários da plataforma.">
    {page}
  </AppLayout>
)
