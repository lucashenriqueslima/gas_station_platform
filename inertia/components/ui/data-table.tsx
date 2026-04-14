import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { router, usePoll } from '@inertiajs/react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Button } from '~/components/ui/button'
import {
  AdminTableFilterPanel,
  type AdminTableFilterField,
  type AdminTableFilterValues,
} from '~/components/ui/admin-table-filter-panel'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  SlidersHorizontal,
  Search,
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

export type PaginationMeta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

export type DataTableFilters = {
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  perPage?: number
  [key: string]: string | number | undefined
}

export type DataTableFilterPanelProps = {
  storageKey?: string
  fields: AdminTableFilterField[]
  values: AdminTableFilterValues
  onValuesChange: (values: AdminTableFilterValues) => void
  onClear: () => void
}

type DataTableProps<T> = {
  columns: ColumnDef<T>[]
  data: T[]
  meta: PaginationMeta
  filters?: DataTableFilters
  searchable?: boolean
  searchPlaceholder?: string
  actions?: ReactNode
  filterPanel?: DataTableFilterPanelProps
  showToolbar?: boolean
  showFooter?: boolean
  pollInterval?: number
  pollOnly?: string[]
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

function countActiveFilterValues(values: AdminTableFilterValues) {
  return Object.values(values).filter((value) => typeof value === 'string' && value.trim().length > 0)
    .length
}

export function DataTable<T>({
  columns,
  data,
  meta,
  filters = {},
  searchable = true,
  searchPlaceholder = 'Pesquisar...',
  actions,
  filterPanel,
  showToolbar = true,
  showFooter = true,
  pollInterval,
  pollOnly = ['data', 'meta'],
}: DataTableProps<T>) {
  const [search, setSearch] = useState(filters.search ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [sorting, setSorting] = useState<SortingState>(
    filters.sort ? [{ id: filters.sort, desc: filters.order === 'desc' }] : []
  )

  usePoll(
    pollInterval ?? 0,
    {
      only: pollOnly,
    },
    {
      autoStart: Boolean(pollInterval),
    }
  )

  useEffect(() => {
    const offStart = router.on('start', () => setIsLoading(true))
    const offFinish = router.on('finish', () => setIsLoading(false))
    return () => {
      offStart()
      offFinish()
    }
  }, [])

  const navigate = useCallback(
    (overrides: Partial<DataTableFilters & { page: number }>) => {
      const merged = {
        ...filters,
        search,
        sort: filters.sort ?? '',
        order: filters.order ?? 'asc',
        page: meta.currentPage,
        perPage: meta.perPage,
        ...overrides,
      }

      const qs: Record<string, string> = {}
      Object.entries(merged).forEach(([key, value]) => {
        if (value === undefined || value === '') return
        if (key === 'page') {
          if (Number(value) > 1) qs.page = String(value)
          return
        }
        if (key === 'perPage') {
          if (Number(value) !== 10) qs.perPage = String(value)
          return
        }

        qs[key] = String(value)
      })

      router.get(window.location.pathname, qs, { preserveState: true, replace: true })
    },
    [search, filters, meta]
  )

  const handleSearch = (value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => navigate({ search: value, page: 1 }), 400)
  }

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex: meta.currentPage - 1, pageSize: meta.perPage },
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: meta.lastPage,
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      setSorting(next)
      const s = next[0]
      navigate({ sort: s?.id ?? '', order: s?.desc ? 'desc' : 'asc', page: 1 })
    },
    onPaginationChange: () => {},
    getCoreRowModel: getCoreRowModel(),
  })

  const from = meta.total === 0 ? 0 : (meta.currentPage - 1) * meta.perPage + 1
  const to = Math.min(meta.currentPage * meta.perPage, meta.total)
  const activeFilterCount = filterPanel ? countActiveFilterValues(filterPanel.values) : 0

  const filterButton = filterPanel ? (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      onClick={() => setIsFilterPanelOpen(true)}
      aria-label={
        activeFilterCount > 0
          ? `Abrir filtros (${activeFilterCount} ativo${activeFilterCount > 1 ? 's' : ''})`
          : 'Abrir filtros'
      }
      className="relative"
    >
      <SlidersHorizontal className="h-4 w-4" />
      {activeFilterCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -right-2 -top-2 min-w-5 px-1 h-5 text-[10px] leading-none"
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  ) : null

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {(actions || filterPanel) && (
            <div className="flex shrink-0 justify-end gap-2 sm:hidden">
              {filterButton}
              {actions}
            </div>
          )}
          {searchable && (
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {(actions || filterPanel) && (
            <div className="hidden shrink-0 gap-2 sm:flex">
              {filterButton}
              {actions}
            </div>
          )}
        </div>
      )}

      {filterPanel && (
        <AdminTableFilterPanel
          open={isFilterPanelOpen}
          onOpenChange={setIsFilterPanelOpen}
          storageKey={filterPanel.storageKey}
          fields={filterPanel.fields}
          values={filterPanel.values}
          onValuesChange={filterPanel.onValuesChange}
          onClear={filterPanel.onClear}
        />
      )}

      {/* Table */}
      <div
        className={cn(
          'rounded-md border transition-opacity duration-200 overflow-x-auto',
          isLoading && 'opacity-50 pointer-events-none'
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = sorting.find((s) => s.id === header.column.id)

                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          className="flex items-center gap-1.5 font-medium hover:text-foreground transition-colors select-none -ml-0.5 px-0.5 rounded"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted?.desc ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : sorted ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      {showFooter && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {meta.total === 0
              ? 'Nenhum resultado'
              : `Exibindo ${from}–${to} de ${meta.total} registros`}
          </p>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Per page */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground whitespace-nowrap hidden sm:inline">
                Por página
              </span>
              <select
                value={meta.perPage}
                onChange={(e) => navigate({ perPage: Number(e.target.value), page: 1 })}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                {PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Page controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden sm:flex"
                disabled={meta.currentPage <= 1}
                onClick={() => navigate({ page: 1 })}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={meta.currentPage <= 1}
                onClick={() => navigate({ page: meta.currentPage - 1 })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm px-2 text-muted-foreground whitespace-nowrap tabular-nums">
                {meta.currentPage} / {meta.lastPage}
              </span>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={meta.currentPage >= meta.lastPage}
                onClick={() => navigate({ page: meta.currentPage + 1 })}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 hidden sm:flex"
                disabled={meta.currentPage >= meta.lastPage}
                onClick={() => navigate({ page: meta.lastPage })}
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
