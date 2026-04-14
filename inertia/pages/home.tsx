import { ReactNode } from 'react'
import { Users, ShieldCheck, Database } from 'lucide-react'
import AppLayout from '~/layouts/app'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

const items = [
  {
    title: 'Usuários',
    description: 'Gerencie acessos da plataforma com criação e listagem centralizadas.',
    icon: Users,
  },
  {
    title: 'Autenticação',
    description: 'Fluxo de login e sessão protegido para operação administrativa.',
    icon: ShieldCheck,
  },
  {
    title: 'Base MySQL',
    description: 'Projeto pronto para evoluir com persistência em MySQL e ambiente Docker.',
    icon: Database,
  },
]

export default function Home() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map(({ title, description, icon: Icon }) => (
        <Card key={title}>
          <CardHeader>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Ambiente base alinhado com o padrão do projeto de referência.
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

Home.layout = (page: ReactNode) => (
  <AppLayout title="Dashboard" description="Visão geral inicial da plataforma.">
    {page}
  </AppLayout>
)
