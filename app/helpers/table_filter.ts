import type { HttpContext } from '@adonisjs/core/http'

type Request = HttpContext['request']

type Order = 'asc' | 'desc'

type TableFilterOptions = {
  /**
   * Column used for ordering when no `sort` param is provided.
   * @default 'created_at'
   */
  defaultSort?: string

  /**
   * Direction used when no `order` param is provided.
   * @default 'desc'
   */
  defaultOrder?: Order

  /**
   * Rows per page when no `perPage` param is provided.
   * @default 10
   */
  defaultPerPage?: number

  /**
   * Whitelist of columns that can be sorted. Prevents SQL injection.
   * When provided, any `sort` param not in this list falls back to `defaultSort`.
   */
  allowedSorts?: string[]

  /**
   * Upper bound for `perPage` to prevent abusive queries.
   * @default 100
   */
  maxPerPage?: number
}

type PaginatableQuery<T> = {
  orderBy(column: string, direction: Order): PaginatableQuery<T>
  paginate(page: number, perPage: number): Promise<T>
}

export default class TableFilter {
  readonly search: string
  readonly sort: string
  readonly order: Order
  readonly page: number
  readonly perPage: number

  constructor(request: Request, options: TableFilterOptions = {}) {
    const {
      defaultSort = 'created_at',
      defaultOrder = 'desc',
      defaultPerPage = 10,
      allowedSorts,
      maxPerPage = 100,
    } = options

    const qs = request.qs()

    this.search = String(qs.search ?? '').trim()
    this.page = Math.max(1, Number(qs.page) || 1)
    this.perPage = Math.min(maxPerPage, Math.max(1, Number(qs.perPage) || defaultPerPage))
    this.order = qs.order === 'asc' || qs.order === 'desc' ? qs.order : defaultOrder

    const requestedSort = String(qs.sort ?? '').trim()

    if (allowedSorts?.length) {
      this.sort = allowedSorts.includes(requestedSort) ? requestedSort : defaultSort
    } else {
      this.sort = requestedSort || defaultSort
    }
  }

  /**
   * Applies ordering and pagination to a Lucid query builder.
   *
   * @example
   * const users = await table.paginate(
   *   User.query().if(table.search, (q) => q.whereILike('full_name', `%${table.search}%`))
   * )
   */
  async paginate<T>(query: PaginatableQuery<T>): Promise<T> {
    return query.orderBy(this.sort, this.order).paginate(this.page, this.perPage)
  }

  /**
   * Returns the active filters to be sent back as Inertia props,
   * so the frontend can initialize the DataTable state correctly.
   */
  get filters() {
    return {
      search: this.search || undefined,
      sort: this.sort,
      order: this.order,
    }
  }
}
