import { router } from '@inertiajs/react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import CountUp from 'react-countup'
import { CalendarDays, Filter, Fuel, RotateCcw, Search, Users } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { InertiaProps } from '~/types'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type Grouping = 'day' | 'week' | 'month'
type ChartType = 'bar' | 'line'

type DashboardRecord = {
  id: number
  createdAt: string | null
  gasStationId: string | null
  gasStationName: string
  userId: string | null
  userName: string
}

type DashboardFilters = {
  startDate: string
  endDate: string
  gasStationId?: string
  userId?: string
}

type Option = {
  value: string
  label: string
}

type UserOption = Option & {
  gasStationId?: string
}

type Props = InertiaProps<{
  filters: DashboardFilters
  filterOptions: {
    gasStations: Option[]
    users: UserOption[]
  }
  totals: {
    consultations: number
    associateLeads: number
  }
  records: {
    consultations: DashboardRecord[]
    associateLeads: DashboardRecord[]
  }
}>

type ChartSeries = {
  key: string
  label: string
  color: string
}

type ChartBucket = {
  key: string
  label: string
  values: Record<string, number>
}

const chartColors = [
  'var(--foreground)',
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatShortDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`
}

function startOfWeek(date: Date) {
  const copy = new Date(date)
  const day = copy.getDay() || 7
  copy.setDate(copy.getDate() - day + 1)
  return copy
}

function getBucketKey(dateValue: string, grouping: Grouping) {
  const date = parseLocalDate(dateValue)

  if (grouping === 'month') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
  }

  if (grouping === 'week') {
    return formatDateKey(startOfWeek(date))
  }

  return formatDateKey(date)
}

function buildBuckets(startDate: string, endDate: string, grouping: Grouping) {
  const buckets: ChartBucket[] = []
  const start = parseLocalDate(startDate)
  const end = parseLocalDate(endDate)
  const cursor = grouping === 'week' ? startOfWeek(start) : new Date(start)

  if (grouping === 'month') {
    cursor.setDate(1)
  }

  while (cursor <= end) {
    const key =
      grouping === 'month'
        ? `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
        : formatDateKey(cursor)
    const label =
      grouping === 'month'
        ? `${String(cursor.getMonth() + 1).padStart(2, '0')}/${cursor.getFullYear()}`
        : formatShortDate(cursor)

    buckets.push({ key, label, values: {} })

    if (grouping === 'month') {
      cursor.setMonth(cursor.getMonth() + 1)
    } else if (grouping === 'week') {
      cursor.setDate(cursor.getDate() + 7)
    } else {
      cursor.setDate(cursor.getDate() + 1)
    }
  }

  return buckets
}

function collectSeries(records: DashboardRecord[], filters: DashboardFilters) {
  const series: ChartSeries[] = [{ key: 'total', label: 'Total', color: chartColors[0] }]
  const unique = new Map<string, string>()
  const groupByUser = Boolean(filters.gasStationId) && !filters.userId
  const shouldShowBreakdown = !filters.userId

  if (!shouldShowBreakdown) return series

  for (const record of records) {
    const id = groupByUser ? record.userId : record.gasStationId
    const name = groupByUser ? record.userName : record.gasStationName
    unique.set(id ?? 'empty', name)
  }

  Array.from(unique.entries())
    .sort(([, labelA], [, labelB]) => labelA.localeCompare(labelB))
    .forEach(([key, label], index) => {
      series.push({
        key,
        label,
        color: chartColors[(index % (chartColors.length - 1)) + 1],
      })
    })

  return series
}

function aggregateRecords(
  records: DashboardRecord[],
  filters: DashboardFilters,
  grouping: Grouping
) {
  const buckets = buildBuckets(filters.startDate, filters.endDate, grouping)
  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]))
  const series = collectSeries(records, filters)
  const groupByUser = Boolean(filters.gasStationId) && !filters.userId

  for (const bucket of buckets) {
    for (const item of series) {
      bucket.values[item.key] = 0
    }
  }

  for (const record of records) {
    if (!record.createdAt) continue

    const bucket = bucketMap.get(getBucketKey(record.createdAt, grouping))
    if (!bucket) continue

    bucket.values.total += 1

    if (!filters.userId) {
      const groupKey = groupByUser ? record.userId : record.gasStationId
      bucket.values[groupKey ?? 'empty'] = (bucket.values[groupKey ?? 'empty'] ?? 0) + 1
    }
  }

  return { buckets, series }
}

function MetricCard({
  title,
  description,
  value,
  icon: Icon,
}: {
  title: string
  description: string
  value: number
  icon: typeof Search
}) {
  return (
    <Card className="gap-4 rounded-lg">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardDescription>{description}</CardDescription>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-semibold tabular-nums tracking-normal">
          <CountUp
            end={value}
            duration={0.9}
            preserveValue
            formattingFn={(countValue) => Math.round(countValue).toLocaleString('pt-BR')}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function GroupingControl({
  value,
  onChange,
}: {
  value: Grouping
  onChange: (value: Grouping) => void
}) {
  const options: { value: Grouping; label: string }[] = [
    { value: 'day', label: 'Dia' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mês' },
  ]

  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as Grouping)}>
      <SelectTrigger className="w-full md:w-32">
        <SelectValue placeholder="Agrupar" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ChartTypeControl({
  value,
  onChange,
}: {
  value: ChartType
  onChange: (value: ChartType) => void
}) {
  const options: { value: ChartType; label: string }[] = [
    { value: 'bar', label: 'Barras' },
    { value: 'line', label: 'Linhas' },
  ]

  return (
    <Select value={value} onValueChange={(nextValue) => onChange(nextValue as ChartType)}>
      <SelectTrigger className="w-full md:w-32">
        <SelectValue placeholder="Visual" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ChartControls({
  grouping,
  chartType,
  onGroupingChange,
  onChartTypeChange,
}: {
  grouping: Grouping
  chartType: ChartType
  onGroupingChange: (value: Grouping) => void
  onChartTypeChange: (value: ChartType) => void
}) {
  return (
    <div className="grid w-full gap-2 sm:grid-cols-2 md:w-auto">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Agrupar</Label>
        <GroupingControl value={grouping} onChange={onGroupingChange} />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Visual</Label>
        <ChartTypeControl value={chartType} onChange={onChartTypeChange} />
      </div>
    </div>
  )
}

function ActivityChart({
  title,
  description,
  records,
  filters,
  grouping,
  chartType,
  onGroupingChange,
  onChartTypeChange,
}: {
  title: string
  description: string
  records: DashboardRecord[]
  filters: DashboardFilters
  grouping: Grouping
  chartType: ChartType
  onGroupingChange: (value: Grouping) => void
  onChartTypeChange: (value: ChartType) => void
}) {
  const { buckets, series } = useMemo(
    () => aggregateRecords(records, filters, grouping),
    [records, filters, grouping]
  )
  const maxValue = Math.max(1, ...buckets.flatMap((bucket) => Object.values(bucket.values)))
  const chartHeight = 260
  const axisLeft = 44
  const axisBottom = 34
  const topPadding = 18
  const innerHeight = chartHeight - axisBottom - topPadding
  const bucketWidth = Math.max(74, series.length * 18 + 26)
  const width = Math.max(640, axisLeft + buckets.length * bucketWidth + 24)
  const barGroupWidth = Math.min(bucketWidth - 24, series.length * 14)
  const barWidth = Math.max(5, Math.min(12, barGroupWidth / Math.max(series.length, 1) - 2))
  const getPoint = (bucket: ChartBucket, bucketIndex: number, item: ChartSeries) => {
    const value = bucket.values[item.key] ?? 0
    const x = axisLeft + bucketIndex * bucketWidth + bucketWidth / 2 + 10
    const y = topPadding + innerHeight - (value / maxValue) * innerHeight

    return { x, y, value }
  }

  return (
    <Card className="gap-4 rounded-lg">
      <CardHeader className="flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <ChartControls
          grouping={grouping}
          chartType={chartType}
          onGroupingChange={onGroupingChange}
          onChartTypeChange={onChartTypeChange}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-md border bg-background">
          <svg
            role="img"
            aria-label={title}
            width={width}
            height={chartHeight}
            className="block min-h-[260px]"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
              const y = topPadding + innerHeight - innerHeight * tick
              const value = Math.round(maxValue * tick)

              return (
                <g key={tick}>
                  <line
                    x1={axisLeft}
                    x2={width - 16}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeDasharray={tick === 0 ? undefined : '4 4'}
                  />
                  <text
                    x={axisLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-muted-foreground text-[11px]"
                  >
                    {value}
                  </text>
                </g>
              )
            })}

            {chartType === 'bar' &&
              buckets.map((bucket, bucketIndex) => {
                const x = axisLeft + bucketIndex * bucketWidth + 14

                return (
                  <g key={bucket.key}>
                    {series.map((item, seriesIndex) => {
                      const value = bucket.values[item.key] ?? 0
                      const height = (value / maxValue) * innerHeight
                      const barX =
                        x + (bucketWidth - barGroupWidth) / 2 + seriesIndex * (barWidth + 2)
                      const barY = topPadding + innerHeight - height

                      return (
                        <rect
                          key={item.key}
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={height}
                          rx={3}
                          fill={item.color}
                        >
                          <title>{`${item.label}: ${value.toLocaleString('pt-BR')}`}</title>
                        </rect>
                      )
                    })}
                  </g>
                )
              })}

            {chartType === 'line' &&
              series.map((item) => {
                const points = buckets.map((bucket, bucketIndex) =>
                  getPoint(bucket, bucketIndex, item)
                )
                const path = points
                  .map(
                    (point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
                  )
                  .join(' ')

                return (
                  <g key={item.key}>
                    <path
                      d={path}
                      fill="none"
                      stroke={item.color}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                    />
                    {points.map((point, index) => (
                      <circle
                        key={`${item.key}-${buckets[index].key}`}
                        cx={point.x}
                        cy={point.y}
                        r={3.5}
                        fill="var(--background)"
                        stroke={item.color}
                        strokeWidth={2}
                      >
                        <title>{`${item.label}: ${point.value.toLocaleString('pt-BR')}`}</title>
                      </circle>
                    ))}
                  </g>
                )
              })}

            {buckets.map((bucket, bucketIndex) => {
              const x = axisLeft + bucketIndex * bucketWidth + 14

              return (
                <text
                  key={bucket.key}
                  x={x + bucketWidth / 2 - 4}
                  y={chartHeight - 12}
                  textAnchor="middle"
                  className="fill-muted-foreground text-[11px]"
                >
                  {bucket.label}
                </text>
              )
            })}
          </svg>
        </div>

        <div className="flex flex-wrap gap-3">
          {series.map((item) => (
            <div key={item.key} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Home({ filters, filterOptions, totals, records }: Props) {
  const [filterValues, setFilterValues] = useState<DashboardFilters>(filters)
  const [consultationGrouping, setConsultationGrouping] = useState<Grouping>('day')
  const [associateLeadGrouping, setAssociateLeadGrouping] = useState<Grouping>('day')
  const [consultationChartType, setConsultationChartType] = useState<ChartType>('bar')
  const [associateLeadChartType, setAssociateLeadChartType] = useState<ChartType>('bar')

  useEffect(() => {
    setFilterValues(filters)
  }, [filters])

  const availableUsers = useMemo(() => {
    if (!filterValues.gasStationId) return filterOptions.users

    return filterOptions.users.filter((user) => user.gasStationId === filterValues.gasStationId)
  }, [filterOptions.users, filterValues.gasStationId])

  function updateFilter<Key extends keyof DashboardFilters>(
    key: Key,
    value: DashboardFilters[Key]
  ) {
    setFilterValues((current) => {
      const next = { ...current, [key]: value || undefined }

      if (
        key === 'gasStationId' &&
        next.userId &&
        !filterOptions.users.some(
          (user) => user.value === next.userId && (!value || user.gasStationId === value)
        )
      ) {
        next.userId = undefined
      }

      return next
    })
  }

  function applyFilters() {
    const query: Record<string, string> = {}

    if (filterValues.startDate) query.startDate = filterValues.startDate
    if (filterValues.endDate) query.endDate = filterValues.endDate
    if (filterValues.gasStationId) query.gasStationId = filterValues.gasStationId
    if (filterValues.userId) query.userId = filterValues.userId

    router.get('/', query, { preserveState: true, replace: true })
  }

  function clearFilters() {
    router.get('/', {}, { preserveState: true, replace: true })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
        <div className="space-y-2">
          <Label htmlFor="start-date">Data inicial</Label>
          <Input
            id="start-date"
            type="date"
            value={filterValues.startDate}
            onChange={(event) => updateFilter('startDate', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">Data final</Label>
          <Input
            id="end-date"
            type="date"
            value={filterValues.endDate}
            onChange={(event) => updateFilter('endDate', event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Posto</Label>
          <Select
            value={filterValues.gasStationId ?? 'all'}
            onValueChange={(value) =>
              updateFilter('gasStationId', value === 'all' ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os postos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os postos</SelectItem>
              {filterOptions.gasStations.map((gasStation) => (
                <SelectItem key={gasStation.value} value={gasStation.value}>
                  {gasStation.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Usuário</Label>
          <Select
            value={filterValues.userId ?? 'all'}
            onValueChange={(value) => updateFilter('userId', value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos os usuários" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os usuários</SelectItem>
              {availableUsers.map((user) => (
                <SelectItem key={user.value} value={user.value}>
                  {user.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full lg:w-auto" onClick={applyFilters}>
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
        <div className="flex items-end">
          <Button variant="outline" className="w-full lg:w-auto" onClick={clearFilters}>
            <RotateCcw className="h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MetricCard
          title="Consultas"
          description="Total no período filtrado"
          value={totals.consultations}
          icon={Search}
        />
        <MetricCard
          title="Leads associados"
          description="Total no período filtrado"
          value={totals.associateLeads}
          icon={Users}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ActivityChart
          title="Consultas por período"
          description="Sem posto selecionado, o gráfico compara todos os postos e o total."
          records={records.consultations}
          filters={filters}
          grouping={consultationGrouping}
          chartType={consultationChartType}
          onGroupingChange={setConsultationGrouping}
          onChartTypeChange={setConsultationChartType}
        />
        <ActivityChart
          title="Leads associados por período"
          description="Ao selecionar um posto, a comparação passa a ser por usuário."
          records={records.associateLeads}
          filters={filters}
          grouping={associateLeadGrouping}
          chartType={associateLeadChartType}
          onGroupingChange={setAssociateLeadGrouping}
          onChartTypeChange={setAssociateLeadChartType}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span>
            Período atual: {filters.startDate.split('-').reverse().join('/')} até{' '}
            {filters.endDate.split('-').reverse().join('/')}
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-background p-4 text-sm text-muted-foreground">
          <Fuel className="h-5 w-5 text-primary" />
          <span>
            Sem filtro de posto, cada gráfico mostra todos os postos mais o somatório total.
          </span>
        </div>
      </div>
    </div>
  )
}

Home.layout = (page: ReactNode) => (
  <AppLayout title="Dashboard" description="Visão geral de consultas e leads associados.">
    {page}
  </AppLayout>
)
