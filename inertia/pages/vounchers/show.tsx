import { type ReactNode, useEffect, useState } from 'react'
import { Link } from '@adonisjs/inertia/react'
import {
  ArrowLeft,
  CalendarClock,
  ExternalLink,
  QrCode,
  ScanLine,
  Ticket,
  UserRound,
} from 'lucide-react'
import QRCode from 'qrcode'
import AppLayout from '~/layouts/app'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import CopyButton from '~/components/copy_button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { InertiaProps } from '~/types'

type UtilizationRow = {
  id: number
  name: string
  cpf: string
  phone: string
  licensePlate: string
  createdAt: string
}

type VouncherDetails = {
  id: number
  code: string
  type: string | null
  typeLabel: string
  partner: string | null
  partnerLabel: string
  currentUtilizations: number
  maxUtilizations: number
  ethanolPrice: string
  gasolinePrice: string
  dieselPrice: string
  createdBy: string
  isValid: boolean
  expiresAt: string
  createdAt: string
  updatedAt: string
  publicUrl: string
  utilizations: UtilizationRow[]
}

type Props = InertiaProps<{
  vouncher: VouncherDetails
}>

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-1 rounded-lg border bg-background/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{value}</div>
    </div>
  )
}

export default function VounchersShow({ vouncher }: Props) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')

  useEffect(() => {
    let isMounted = true

    QRCode.toDataURL(vouncher.code, {
      width: 320,
      margin: 2,
    }).then((dataUrl: string) => {
      if (isMounted) setQrCodeDataUrl(dataUrl)
    })

    return () => {
      isMounted = false
    }
  }, [vouncher.code])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Vouncher #{vouncher.id}</Badge>
            <Badge variant={vouncher.isValid ? 'success' : 'secondary'}>
              {vouncher.isValid ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">{vouncher.code}</h2>
          <p className="text-sm text-muted-foreground">
            Visualização completa do vouncher, QR Code público e histórico de utilizações.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link route="vounchers.index">
            <ArrowLeft className="h-4 w-4" />
            Voltar para vounchers
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem
          label="Código"
          value={
            <span className="inline-flex items-center gap-2">
              <Ticket className="h-4 w-4 text-muted-foreground" />
              {vouncher.code}
            </span>
          }
        />
        <DetailItem label="Tipo" value={vouncher.typeLabel} />
        <DetailItem label="Parceiro" value={vouncher.partnerLabel} />
        <DetailItem
          label="Utilizações"
          value={`${vouncher.currentUtilizations}/${vouncher.maxUtilizations}`}
        />
        <DetailItem label="Preço etanol" value={vouncher.ethanolPrice} />
        <DetailItem label="Preço gasolina" value={vouncher.gasolinePrice} />
        <DetailItem label="Preço diesel" value={vouncher.dieselPrice} />
        <DetailItem
          label="Criado por"
          value={
            <span className="inline-flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              {vouncher.createdBy}
            </span>
          }
        />
        <DetailItem
          label="Expira em"
          value={
            <span className="inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              {vouncher.expiresAt}
            </span>
          }
        />
        <DetailItem label="Criado em" value={vouncher.createdAt} />
        <DetailItem label="Atualizado em" value={vouncher.updatedAt} />
        <DetailItem
          label="Link público"
          value={
            <a
              href={vouncher.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir link
            </a>
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code do vouncher
            </CardTitle>
            <CardDescription>
              Use o QR Code ou o link abaixo para acessar a página pública do vouncher.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex min-h-72 items-center justify-center rounded-lg border bg-white p-4">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`QR Code do vouncher ${vouncher.code}`}
                  className="h-72 w-72 object-contain"
                />
              ) : (
                <div className="text-sm text-muted-foreground">Gerando QR Code...</div>
              )}
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-xs break-all text-muted-foreground">
              {vouncher.publicUrl}
            </div>

            <div className="flex flex-col gap-3">
              <CopyButton text={vouncher.publicUrl} className="w-full" />
              <Button asChild className="w-full">
                <a href={vouncher.publicUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Abrir link
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="h-5 w-5" />
              Utilizações do vouncher
            </CardTitle>
            <CardDescription>Histórico completo de quem utilizou este vouncher.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Utilizado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vouncher.utilizations.length > 0 ? (
                  vouncher.utilizations.map((utilization) => (
                    <TableRow key={utilization.id}>
                      <TableCell>{utilization.name}</TableCell>
                      <TableCell>{utilization.cpf}</TableCell>
                      <TableCell>{utilization.phone}</TableCell>
                      <TableCell>{utilization.licensePlate}</TableCell>
                      <TableCell>{utilization.createdAt}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhuma utilização registrada para este vouncher.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

VounchersShow.layout = (page: ReactNode) => (
  <AppLayout
    title="Detalhes do vouncher"
    description="Visualize os dados completos do vouncher e seu histórico de utilizações."
  >
    {page}
  </AppLayout>
)
