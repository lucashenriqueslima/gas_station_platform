import { type ReactNode, useEffect, useState } from 'react'
import { AlertTriangle, CalendarClock, Fuel, Gauge, QrCode, Sparkles, Ticket } from 'lucide-react'
import QRCode from 'qrcode'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { InertiaProps } from '~/types'

type ClientVouncher = {
  code: string
  partnerLabel: string
  ethanolPrice: string
  gasolinePrice: string
  dieselPrice: string
  currentUtilizations: number
  maxUtilizations: number
  isActive: boolean
  expiresAt: string
  activationUrl: string
  canUse: boolean
}

type Props = InertiaProps<{
  vouncher: ClientVouncher
}>

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function FuelPriceCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${accent}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
        <Fuel className="h-5 w-5 text-slate-500" />
      </div>
    </div>
  )
}

export default function ClientVouncherShow({ vouncher }: Props) {
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
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f4efe4_0%,#f8f6f1_28%,#eef3ea_62%,#f7f8fa_100%)] px-4 py-8 md:px-6 md:py-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8rem] top-[-5rem] h-64 w-64 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-6">
        {!vouncher.canUse && (
          <div className="rounded-[1.75rem] border border-red-300/70 bg-red-50 px-5 py-4 text-red-900 shadow-[0_15px_40px_rgba(239,68,68,0.12)]">
            <p className="text-sm font-semibold tracking-wide">
              Este voucher não pode mais ser utilizado.
            </p>
            <p className="mt-1 text-sm text-red-800">
              Entre em contato com o suporte para mais informações.
            </p>
          </div>
        )}

        <section className="overflow-hidden rounded-[2rem] border border-white/40 bg-slate-950 text-white shadow-[0_30px_120px_rgba(15,23,42,0.18)]">
          <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[1.1fr_360px]">
            <div className="space-y-6">
              <div className="inline-flex rounded-[1.75rem] border border-white/10 bg-white px-4 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.22)]">
                <img
                  src="/solidy-vertical-verde.png"
                  alt="Solidy Beneficios"
                  className="h-20 w-auto md:h-24"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                  Voucher
                </Badge>
                <Badge
                  variant={vouncher.isActive ? 'success' : 'secondary'}
                  className="border-0 shadow-none"
                >
                  {vouncher.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white/90">
                  {vouncher.partnerLabel}
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
                  <Sparkles className="h-4 w-4" />
                  Experiência de ativação pronta para uso
                </p>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
                  {vouncher.code}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-white/72 md:text-base">
                  Escaneie o QR Code para ativação no aplicativo ou confira os detalhes deste
                  voucher, incluindo preços, disponibilidade e validade.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Parceiro</p>
                  <p className="mt-2 text-lg font-semibold">{vouncher.partnerLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Utilizações
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {vouncher.currentUtilizations}/{vouncher.maxUtilizations}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Status</p>
                  <p className="mt-2 text-lg font-semibold">
                    {vouncher.isActive ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Expira em</p>
                  <p className="mt-2 text-lg font-semibold">{vouncher.expiresAt}</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_58%)]" />
              <div className="relative rounded-[2rem] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white/75">
                  <QrCode className="h-4 w-4" />
                  QR Code de ativação
                </div>
                <div className="rounded-[1.5rem] bg-white p-4 shadow-2xl">
                  <div className="flex min-h-72 items-center justify-center rounded-[1.2rem] border border-slate-100 bg-white">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt={`QR Code de ativação do voucher ${vouncher.code}`}
                        className="h-72 w-72 object-contain"
                      />
                    ) : (
                      <div className="text-sm text-slate-500">Gerando QR Code...</div>
                    )}
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-10 w-10 mr-2" />
                    Atenção: mostrar o QRCODE para o frentista validar seu vouncher
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6">
          <Card className="overflow-hidden rounded-[2rem] border-white/50 bg-white/80 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <CardHeader className="border-b border-slate-200/70 bg-white/50">
              <CardTitle className="flex items-center gap-2 text-slate-950">
                <Fuel className="h-5 w-5 text-amber-600" />
                Preços dos combustíveis
              </CardTitle>
              <CardDescription className="text-slate-600">
                Valores vinculados a este voucher para a ativação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <FuelPriceCard
                  label="Etanol"
                  value={vouncher.ethanolPrice}
                  accent="border-emerald-200 bg-[linear-gradient(180deg,#ecfdf5_0%,#f7fffb_100%)]"
                />
                <FuelPriceCard
                  label="Gasolina"
                  value={vouncher.gasolinePrice}
                  accent="border-amber-200 bg-[linear-gradient(180deg,#fffbeb_0%,#fffdf6_100%)]"
                />
                <FuelPriceCard
                  label="Diesel"
                  value={vouncher.dieselPrice}
                  accent="border-sky-200 bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)]"
                />
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                Use o QR Code para validar o voucher diretamente no fluxo do aplicativo. Antes de
                prosseguir, confira se o parceiro, a validade e os preços estão de acordo com a sua
                operação.
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <DetailItem
              label="Utilizações"
              value={
                <span className="inline-flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-slate-500" />
                  {vouncher.currentUtilizations}/{vouncher.maxUtilizations}
                </span>
              }
            />
            <DetailItem
              label="Status atual"
              value={
                <span className="inline-flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-slate-500" />
                  {vouncher.isActive ? 'Ativo' : 'Inativo'}
                </span>
              }
            />
            <DetailItem
              label="Expiração"
              value={
                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-slate-500" />
                  {vouncher.expiresAt}
                </span>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ClientVouncherShow.layout = (page: ReactNode) => page
