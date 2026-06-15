import UserAction from '#actions/user/user_action'
import faceRecognitionConfig from '#config/face_recognition'
import FaceRecognitionService from '#services/face_recognition_service'
import User, { UserRole } from '#models/user'
import UserPolicy from '#policies/user_policy'
import UserTransformer from '#transformers/user_transformer'
import { storeUser, updateUser } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import TableFilter from '../helpers/table_filter.js'

@inject()
export default class UsersController {
  constructor(
    private readonly userAction: UserAction,
    private readonly faceRecognition: FaceRecognitionService
  ) {}

  async index({ request, inertia, serialize, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('viewList')

    const table = new TableFilter(request, {
      defaultSort: 'full_name',
      defaultOrder: 'asc',
      allowedSorts: ['full_name', 'email', 'formatted_created_at'],
    })

    const users = await table.paginate(
      User.query()
        .preload('gasStation')
        .preload('faceImages')
        .if(table.search, (query) => {
          query
            .whereILike('full_name', `%${table.search}%`)
            .orWhereILike('email', `%${table.search}%`)
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

  async create({ inertia, bouncer, serialize }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')
    const policy = bouncer.with(UserPolicy)

    const props = await serialize.withoutWrapping(
      UserTransformer.transform({
        roles: this.userAction.roleOptions(),
        gasStations: await this.userAction.gasStationOptions(),
        maxFaceImages: faceRecognitionConfig.maxImagesPerUser,
        permissions: {
          chooseRole: await policy.allows('chooseRole'),
        },
      }).useVariant('toCreateView')
    )

    return inertia.render('users/create', props)
  }

  async store({ request, response, session, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('create')
    
    const payload = await request.validateUsing(storeUser)

    if(await bouncer.with(UserPolicy).denies('chooseRole')){
      payload.role = UserRole.ATTENDANT.value
    }

    const faceImages = this.userAction.getFaceImages(request, true, session)
    if (!faceImages) {
      return response.redirect().back()
    }

    const user = await this.userAction.createUserWithFaceImages(
      payload,
      faceImages,
      this.faceRecognition,
      session
    )
    if (!user) {
      return response.redirect().back()
    }

    session.flash({ success: 'Usuário criado com sucesso!' })

    return response.redirect().toRoute('users.index')
  }

  async show({ params, inertia, bouncer }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('gasStation')
      .preload('faceImages')
      .firstOrFail()

    await bouncer.with(UserPolicy).authorize('view', user)

    return inertia.render('users/show', {
      user: await this.userAction.serializeUserDetails(user),
    } as never)
  }

  async edit({ params, inertia, bouncer, serialize }: HttpContext) {
    const user = await User.query()
      .where('id', params.id)
      .preload('gasStation')
      .preload('faceImages')
      .firstOrFail()

    await bouncer.with(UserPolicy).authorize('update', user)
    const policy = bouncer.with(UserPolicy)

    const props = await serialize.withoutWrapping(
      UserTransformer.transform({
        user,
        roles: this.userAction.roleOptions(),
        gasStations: await this.userAction.gasStationOptions(),
        maxFaceImages: faceRecognitionConfig.maxImagesPerUser,
        permissions: {
          chooseRole: await policy.allows('chooseRole'),
        },
      }).useVariant('toEditView')
    )

    return inertia.render('users/edit', props)
  }

  async update({ params, request, response, session, bouncer }: HttpContext) {
    const user = await User.query().where('id', params.id).preload('faceImages').firstOrFail()

    await bouncer.with(UserPolicy).authorize('update', user)

    const payload = await request.validateUsing(updateUser)
    const faceImages = this.userAction.getFaceImages(request, false, session)
    if (!faceImages) {
      return response.redirect().back()
    }

    const updated = await this.userAction.updateUserWithFaceImages(
      user,
      payload,
      faceImages,
      this.faceRecognition,
      session
    )

    if (!updated) {
      return response.redirect().back()
    }

    session.flash({ success: 'Usuário atualizado com sucesso!' })

    return response.redirect().toRoute('users.show', { id: user.id })
  }
}
