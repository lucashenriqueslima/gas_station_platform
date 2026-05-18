import * as React from 'react'
import { Link } from '@inertiajs/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Search, Plus } from 'lucide-react'

interface ResourceHeaderProps {
  title: string
  description?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  newButtonHref?: string
  newButtonLabel?: string
  children?: React.ReactNode
}

export function ResourceHeader({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  newButtonHref,
  newButtonLabel = 'Novo',
  children,
}: ResourceHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">{title}</h1>
        {description && <p className="text-slate-600 dark:text-slate-400">{description}</p>}
      </div>

      <div className="flex items-center gap-2 w-full max-w-md">
        {onSearchChange !== undefined && (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              className="pl-8"
              value={searchValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            />
          </div>
        )}

        {children}

        {newButtonHref && (
          <Button asChild>
            <Link href={newButtonHref}>
              <Plus className="h-4 w-4 mr-2" />
              {newButtonLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
