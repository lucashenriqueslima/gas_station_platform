import { appUrl } from '#config/app'
import Vouncher from '#models/vouncher'
import { storeVouncher } from '#validators/vouncher'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Sqids from 'sqids'
import TableFilter from '../helpers/table_filter.js'

const sqids = new Sqids({
  minLength: 6,
})

export default class VounchersController {
  async create({ inertia }: HttpContext) {
    return inertia.render('vounchers/create', {})
  }

  async index({ request, inertia }: HttpContext) {
    const table = new TableFilter(request, {
      defaultSort: 'created_at',
      defaultOrder: 'desc',
      allowedSorts: [
        'type',
        'partner',
        'current_utilizations',
        'max_utilizations',
        'is_active',
        'expires_at',
        'created_at',
      ],
    })

    const vounchers = await table.paginate(
      Vouncher.query()
        .preload('creator')
        .if(table.search, (query) => {
          query
            .whereILike('code', `%${table.search}%`)
            .orWhereILike('type', `%${table.search}%`)
            .orWhereILike('partner', `%${table.search}%`)
        })
    )

    return inertia.render('vounchers/index', {
      data: vounchers.all().map((vouncher) => this.serializeVouncher(vouncher)),
      meta: {
        total: vounchers.getMeta().total,
        perPage: vounchers.getMeta().perPage,
        currentPage: vounchers.getMeta().currentPage,
        lastPage: vounchers.getMeta().lastPage,
      },
      filters: table.filters,
    })
  }

  async show({ params, inertia }: HttpContext) {
    const vouncher = await Vouncher.query()
      .where('id', params.id)
      .preload('creator')
      .preload('utilizations', (query) => query.orderBy('created_at', 'desc'))
      .firstOrFail()

    const publicUrl = `${appUrl}/cliente/vouncher/${vouncher.code}`

    return inertia.render('vounchers/show', {
      vouncher: {
        id: vouncher.id,
        code: vouncher.code,
        type: vouncher.type,
        typeLabel: this.formatEnumLabel(vouncher.type),
        partner: vouncher.partner,
        partnerLabel: this.formatEnumLabel(vouncher.partner),
        currentUtilizations: vouncher.currentUtilizations,
        maxUtilizations: vouncher.maxUtilizations,
        ethanolPrice: this.formatPrice(vouncher.ethanolPrice),
        gasolinePrice: this.formatPrice(vouncher.gasolinePrice),
        dieselPrice: this.formatPrice(vouncher.dieselPrice),
        createdBy: vouncher.creator?.fullName ?? vouncher.creator?.email ?? '-',
        isValid: vouncher.isValid,
        expiresAt: vouncher.expiresAt.toFormat('dd/MM/yyyy HH:mm'),
        createdAt: vouncher.createdAt?.toFormat('dd/MM/yyyy HH:mm') ?? '-',
        updatedAt: vouncher.updatedAt?.toFormat('dd/MM/yyyy HH:mm') ?? '-',
        publicUrl,
        utilizations: vouncher.utilizations.map((utilization) => ({
          id: utilization.id,
          name: utilization.name,
          cpf: utilization.cpf,
          phone: utilization.phone,
          licensePlate: utilization.licensePlate,
          createdAt: utilization.createdAt?.toFormat('dd/MM/yyyy HH:mm') ?? '-',
        })),
      },
    })
  }

  async clientShow({ params, inertia }: HttpContext) {
    const vouncher = await Vouncher.query().where('code', params.code).firstOrFail()
    const activationUrl = `${appUrl}/api/v1/gas-station-app/vouncher/${vouncher.code}/validate`
    const isExpired = vouncher.expiresAt < DateTime.local()
    const hasAvailableUtilization = vouncher.currentUtilizations < vouncher.maxUtilizations
    const canUse = vouncher.isActive && !isExpired && hasAvailableUtilization

    return inertia.render('client/vouncher/show', {
      vouncher: {
        code: vouncher.code,
        partnerLabel: this.formatEnumLabel(vouncher.partner),
        ethanolPrice: this.formatPrice(vouncher.ethanolPrice),
        gasolinePrice: this.formatPrice(vouncher.gasolinePrice),
        dieselPrice: this.formatPrice(vouncher.dieselPrice),
        currentUtilizations: vouncher.currentUtilizations,
        maxUtilizations: vouncher.maxUtilizations,
        isActive: canUse,
        expiresAt: vouncher.expiresAt.toFormat('dd/MM/yyyy HH:mm'),
        activationUrl,
        canUse,
      },
    })
  }

  async store({ request, response, session, auth }: HttpContext) {
    const payload = await request.validateUsing(storeVouncher)

    const vouncher = await Vouncher.create({
      code: this.generateTemporaryCode(),
      type: payload.type,
      partner: payload.partner,
      maxUtilizations: payload.type === 'operational' ? 1 : Number(payload.maxUtilizations),
      currentUtilizations: 0,
      ethanolPrice: this.parseDecimal(payload.ethanolPrice),
      gasolinePrice: this.parseDecimal(payload.gasolinePrice),
      dieselPrice: this.parseDecimal(payload.dieselPrice),
      expiresAt:
        payload.type === 'operational'
          ? DateTime.local().endOf('day')
          : DateTime.fromISO(payload.expiresAt),
      isActive: payload.isActive === 'true',
      createdBy: auth.user?.id ?? null,
    })

    vouncher.code = sqids.encode([vouncher.id])
    await vouncher.save()

    session.flash({ success: 'Vouncher criado com sucesso!' })

    return response.redirect().toRoute('vounchers.index')
  }

  private serializeVouncher(vouncher: Vouncher) {
    return {
      id: vouncher.id,
      type: vouncher.type,
      typeLabel: this.formatEnumLabel(vouncher.type),
      partner: vouncher.partner,
      partnerLabel: this.formatEnumLabel(vouncher.partner),
      currentUtilizations: vouncher.currentUtilizations,
      maxUtilizations: vouncher.maxUtilizations,
      createdBy: vouncher.creator?.fullName ?? vouncher.creator?.email ?? '-',
      isActive: vouncher.isActive,
      isValid: vouncher.isValid,
      expiresAt: vouncher.expiresAt.toFormat('dd/MM/yyyy HH:mm'),
      createdAt: vouncher.createdAt?.toFormat('dd/MM/yyyy HH:mm') ?? '-',
    }
  }

  private formatEnumLabel(value: string | null) {
    if (!value) return '-'

    return value
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }

  private parseDecimal(value: string) {
    return Number(value.replace(',', '.').trim())
  }

  private generateTemporaryCode() {
    return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  }

  private formatPrice(value: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }
}
