import { type ReactNode } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, CalendarClock, Edit, ImageIcon, Mail, Shield, UserRound } from 'lucide-react'
import AppLayout from '~/layouts/app'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

type UserRole = 'admin' | 'manager' | 'attendant'

type FaceImage = {
  id: number
  imageUrl?: string
  url?: string
  createdAt?: string | null
}

type UserDetails = {
  id: number
  fullName: string | null
  email: string
  role?: UserRole
  roleLabel?: string
  gasStationName?: string | null
  createdAt?: string
  formattedCreatedAt?: string
  updatedAt?: string | null
  faceImages?: FaceImage[]
}

type Props = {
  user: UserDetails
}

const roleLabels: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  attendant: 'Atendente',
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border bg-background/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

export default function UsersShow({ user }: Props) {
  const faceImages = user.faceImages ?? []
  const displayName = user.fullName || user.email
  const roleLabel = user.roleLabel ?? (user.role ? roleLabels[user.role] : 'Nao informado')
  const createdAt = user.formattedCreatedAt ?? user.createdAt ?? 'Nao informado'

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Usuário #{user.id}</Badge>
            <Badge variant="secondary">{roleLabel}</Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{displayName}</h2>
          <p className="text-sm text-muted-foreground">
            Visualização dos dados do usuário e imagens faciais cadastradas.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link route="users.index">
              <ArrowLeft className="h-4 w-4" />
              Voltar para usuários
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/usuarios/${user.id}/edit`}>
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem
          label="Nome"
          value={
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {user.fullName || 'Nao informado'}
            </span>
          }
        />
        <DetailItem
          label="E-mail"
          value={
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {user.email}
            </span>
          }
        />
        <DetailItem
          label="Perfil"
          value={
            <span className="inline-flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              {roleLabel}
            </span>
          }
        />
        <DetailItem label="Posto" value={user.gasStationName ?? 'Nao vinculado'} />
        <DetailItem
          label="Criado em"
          value={
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              {createdAt}
            </span>
          }
        />
        <DetailItem label="Atualizado em" value={user.updatedAt ?? 'Nao atualizado'} />
      </div>

      <section className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <ImageIcon className="h-5 w-5" />
            Imagens faciais
          </h3>
          <p className="text-sm text-muted-foreground">
            O cadastro aceita até 3 imagens faciais por usuário.
          </p>
        </div>

        {faceImages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faceImages.map((faceImage) => (
              <a
                key={faceImage.id}
                href={faceImage.imageUrl ?? faceImage.url}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-md border bg-muted/30"
              >
                <img
                  src={faceImage.imageUrl ?? faceImage.url}
                  alt={`Imagem facial ${faceImage.id} do usuário ${displayName}`}
                  className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-105"
                />
                {faceImage.createdAt && (
                  <div className="border-t bg-background px-3 py-2 text-xs text-muted-foreground">
                    Enviada em {faceImage.createdAt}
                  </div>
                )}
              </a>
            ))}
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            Nenhuma imagem facial cadastrada.
          </div>
        )}
      </section>
    </div>
  )
}

UsersShow.layout = (page: ReactNode) => (
  <AppLayout title="Detalhes do usuário" description="Visualize os dados completos do usuário.">
    {page}
  </AppLayout>
)
