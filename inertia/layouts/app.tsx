import { router, usePage } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { type ReactNode, useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { Data } from '@generated/data'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Ticket,
  Users,
  X,
  type LucideProps,
} from 'lucide-react'

type NavItem = {
  label: string
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  href: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Consultas', icon: Search, href: '/consultas' },
  { label: 'Vounchers', icon: Ticket, href: '/vounchers' },
  { label: 'Usuários', icon: Users, href: '/usuarios' },
]

type Props = {
  children: ReactNode
  title: string
  description?: string
  showTitleSection?: boolean
}

export default function AppLayout({
  children,
  title,
  description,
  showTitleSection = true,
}: Props) {
  const page = usePage<Data.SharedProps>()
  const { user, flash } = page.props
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.title = `${title} | Solidy Posto`
    toast.dismiss()
    setSidebarOpen(false)
  }, [page.url, title])

  useEffect(() => {
    if (flash?.error) {
      toast.error(flash.error)
    }

    if (flash?.success) {
      toast.success(flash.success)
    }
  }, [flash])

  function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="flex-1 p-3">
        <div className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = href === '/' ? page.url === href : page.url.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  function UserFooter() {
    return (
      <div className="space-y-1 p-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user?.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">
              {user?.fullName || 'Usuário'}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => router.post('/logout')}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div>
            <span className="text-lg font-semibold tracking-tight">Solidy Posto</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Separator />
        <NavLinks onNavigate={() => setSidebarOpen(false)} />
        <Separator />
        <UserFooter />
      </aside>

      <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
        <div className="px-4 py-5">
          <span className="text-lg font-semibold tracking-tight">Solidy Posto</span>
        </div>
        <Separator />
        <NavLinks />
        <Separator />
        <UserFooter />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="truncate text-sm font-medium text-muted-foreground">{title}</h1>
        </header>

        <Card className="m-4 flex-1 overflow-auto border-0 p-4 shadow-none md:m-6 md:p-8">
          {showTitleSection && (
            <CardHeader className="gap-1 px-0 pt-0">
              <CardTitle className="text-3xl font-semibold tracking-tight md:text-4xl">
                {title}
              </CardTitle>
              <CardDescription className="text-sm md:text-base">{description}</CardDescription>
            </CardHeader>
          )}
          {children}
        </Card>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  )
}
