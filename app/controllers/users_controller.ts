import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { storeUser } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import TableFilter from '../helpers/table_filter.js'

export default class UsersController {
  async index({ request, inertia, serialize }: HttpContext) {
    const table = new TableFilter(request, {
      defaultSort: 'full_name',
      defaultOrder: 'asc',
      allowedSorts: ['full_name', 'email', 'formatted_created_at'],
    })

    const users = await table.paginate(
      User.query().if(table.search, (query) => {
        query.whereILike('full_name', `%${table.search}%`).orWhereILike('email', `%${table.search}%`)
      })
    )

    const { data, metadata: meta } = await serialize(
      UserTransformer.paginate(users.all(), users.getMeta()).useVariant('toIndexView')
    )

    return inertia.render('users/index', {
      data,
      meta: {
        ...meta,
        total: Number(meta.total),
        perPage: Number(meta.perPage),
        currentPage: Number(meta.currentPage),
        lastPage: Number(meta.lastPage),
      },
      filters: table.filters,
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('users/create', {})
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(storeUser)

    await User.create({ ...payload })

    session.flash({ success: 'Usuário criado com sucesso!' })

    return response.redirect().toRoute('users.index')
  }
}
