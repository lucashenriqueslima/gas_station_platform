import * as React from 'react'

import { Button } from '~/components/ui/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '~/components/ui/combobox'
import { Input } from '~/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'

export type AdminTableFilterOption = {
  label: string
  value: string
}

type AdminTableFilterBaseField = {
  key: string
  label: string
  placeholder?: string
}

export type AdminTableFilterComboboxField = AdminTableFilterBaseField & {
  type: 'combobox'
  options: AdminTableFilterOption[]
  emptyLabel?: string
}

export type AdminTableFilterDateField = AdminTableFilterBaseField & {
  type: 'date'
}

export type AdminTableFilterField =
  | AdminTableFilterComboboxField
  | AdminTableFilterDateField

export type AdminTableFilterValues = Record<string, string | undefined>

export type AdminTableFilterPanelProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields: AdminTableFilterField[]
  values: AdminTableFilterValues
  onValuesChange: (values: AdminTableFilterValues) => void
  onClear: () => void
  storageKey?: string
  title?: string
  description?: string
}

function sanitizeValues(
  rawValues: unknown,
  fields: AdminTableFilterField[]
): AdminTableFilterValues {
  if (!rawValues || typeof rawValues !== 'object' || Array.isArray(rawValues)) {
    return {}
  }

  const allowedKeys = new Set(fields.map((field) => field.key))

  return Object.entries(rawValues).reduce<AdminTableFilterValues>((acc, [key, value]) => {
    if (!allowedKeys.has(key) || typeof value !== 'string' || !value) {
      return acc
    }

    acc[key] = value
    return acc
  }, {})
}

function hasActiveValues(values: AdminTableFilterValues) {
  return Object.values(values).some((value) => typeof value === 'string' && value.length > 0)
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function parseMultipleValue(value?: string) {
  if (!value) return []

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

type AdminTableFilterComboboxInputProps = {
  field: AdminTableFilterComboboxField
  value?: string
  onValueChange: (value?: string) => void
  container?: React.ComponentProps<typeof ComboboxContent>['container']
}

function AdminTableFilterComboboxInput({
  field,
  value,
  onValueChange,
  container,
}: AdminTableFilterComboboxInputProps) {
  const anchorRef = useComboboxAnchor()
  const selectedValues = parseMultipleValue(value)
  const selectedOptions = field.options.filter((option) => selectedValues.includes(option.value))

  return (
    <Combobox
      multiple
      items={field.options}
      value={selectedOptions}
      onValueChange={(options: AdminTableFilterOption[]) => {
        const nextValue = options.map((option) => option.value).join(',')
        onValueChange(nextValue || undefined)
      }}
      itemToStringLabel={(option: AdminTableFilterOption) => option.label}
      itemToStringValue={(option: AdminTableFilterOption) => option.value}
      filter={(option: AdminTableFilterOption, query: string) => {
        const searchTarget = normalize(`${option.label} ${option.value}`)
        return searchTarget.includes(normalize(query))
      }}
    >
      <ComboboxChips ref={anchorRef}>
        <ComboboxValue>
          {selectedOptions.map((option) => (
            <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder={selectedOptions.length ? undefined : field.placeholder} />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef} container={container}>
        <ComboboxEmpty>{field.emptyLabel ?? 'Nenhuma opção encontrada.'}</ComboboxEmpty>
        <ComboboxList>
          {(option: AdminTableFilterOption) => (
            <ComboboxItem key={option.value} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export function AdminTableFilterPanel({
  open,
  onOpenChange,
  fields,
  values,
  onValuesChange,
  onClear,
  storageKey,
}: AdminTableFilterPanelProps) {
  const [draftValues, setDraftValues] = React.useState<AdminTableFilterValues>(values)
  const hasRestoredPersistedFilters = React.useRef(false)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const resolvedStorageKey = React.useMemo(() => {
    if (storageKey) return storageKey
    if (typeof window === 'undefined') return undefined

    return `admin-table-filters:${window.location.pathname}`
  }, [storageKey])

  React.useEffect(() => {
    setDraftValues(values)
  }, [values])

  React.useEffect(() => {
    if (typeof window === 'undefined' || hasRestoredPersistedFilters.current) {
      return
    }

    hasRestoredPersistedFilters.current = true

    if (!resolvedStorageKey || hasActiveValues(values)) {
      return
    }

    const persistedValue = window.localStorage.getItem(resolvedStorageKey)
    if (!persistedValue) {
      return
    }

    try {
      const nextValues = sanitizeValues(JSON.parse(persistedValue), fields)
      if (!hasActiveValues(nextValues)) {
        return
      }

      setDraftValues(nextValues)
      onValuesChange(nextValues)
    } catch {
      window.localStorage.removeItem(resolvedStorageKey)
    }
  }, [fields, onValuesChange, resolvedStorageKey, values])

  const updateValue = React.useCallback(
    (key: string, value?: string) => {
      setDraftValues((prev) => ({
        ...prev,
        [key]: value || undefined,
      }))
    },
    []
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent ref={contentRef} side="right" className="w-full gap-6 sm:max-w-lg">
        <SheetHeader className="px-5">
          <SheetTitle>Filtros da tabela</SheetTitle>
          <SheetDescription>Filtros avançados para refinar a visualização da tabela.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 pr-1 px-5">
          {fields.map((field) => {
            if (field.type === 'combobox') {
              return (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-medium">{field.label}</label>
                  <AdminTableFilterComboboxInput
                    field={field}
                    value={draftValues[field.key]}
                    onValueChange={(value) => updateValue(field.key, value)}
                    container={contentRef}
                  />
                </div>
              )
            }

            return (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-medium" htmlFor={field.key}>
                  {field.label}
                </label>
                <Input
                  id={field.key}
                  type="date"
                  value={draftValues[field.key] ?? ''}
                  onChange={(event) => updateValue(field.key, event.currentTarget.value)}
                />
              </div>
            )
          })}
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (resolvedStorageKey && typeof window !== 'undefined') {
                window.localStorage.removeItem(resolvedStorageKey)
              }
              setDraftValues({})
              onClear()
              onOpenChange(false)
            }}
          >
            Limpar filtros
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (resolvedStorageKey && typeof window !== 'undefined') {
                const sanitizedDraftValues = sanitizeValues(draftValues, fields)

                if (hasActiveValues(sanitizedDraftValues)) {
                  window.localStorage.setItem(
                    resolvedStorageKey,
                    JSON.stringify(sanitizedDraftValues)
                  )
                } else {
                  window.localStorage.removeItem(resolvedStorageKey)
                }
              }

              onValuesChange(draftValues)
              onOpenChange(false)
            }}
          >
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
