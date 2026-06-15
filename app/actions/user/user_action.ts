import { randomUUID } from 'node:crypto'
import type { HttpContext } from '@adonisjs/core/http'
import faceRecognitionConfig from '#config/face_recognition'
import type FaceRecognitionService from '#services/face_recognition_service'
import type { FaceDescriptor } from '#services/face_recognition_service'
import GasStation from '#models/gas_station'
import User from '#models/user'
import UserFaceImage from '#models/user_face_image'
import drive from '@adonisjs/drive/services/main'
import { convertHeicPathToJpegBuffer, isHeicExtension } from '#helpers/image_converter'

type UploadedFaceImage = ReturnType<HttpContext['request']['files']>[number]

type StoreUserPayload = {
  fullName: string | null
  email: string
  role: User['role']
  gasStationId?: number | null
  password: string
}

type UpdateUserPayload = {
  fullName: string | null
  email: string
  role: User['role']
  gasStationId?: number | null
  password?: string
}

export default class UserAction {
  roleOptions() {
    return [
      { value: 'attendant', label: 'Frentista' },
      { value: 'manager', label: 'Gerente' },
      { value: 'admin', label: 'Administrador' },
    ]
  }

  roleLabel(role: User['role']) {
    return this.roleOptions().find((option) => option.value === role)?.label ?? role
  }

  async gasStationOptions() {
    return GasStation.query().orderBy('name', 'asc').select('id', 'name')
  }

  async serializeUserDetails(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      roleLabel: this.roleLabel(user.role),
      gasStationId: user.gasStationId,
      gasStationName: user.gasStation?.name ?? null,
      formattedCreatedAt: user.formattedCreatedAt,
      faceImages: await Promise.all(
        user.faceImages.map(async (faceImage) => ({
          id: faceImage.id,
          imagePath: faceImage.imagePath,
          imageUrl: await drive.use().getUrl(faceImage.imagePath),
          createdAt: faceImage.createdAt?.toFormat('dd/MM/yyyy HH:mm') ?? null,
        }))
      ),
    }
  }

  getFaceImages(
    request: HttpContext['request'],
    required: boolean,
    session: HttpContext['session']
  ) {
    const validationOptions = {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'heic', 'HEIC', 'heif', 'HEIF'],
    }
    const files = [
      ...request.files('faceImages', validationOptions),
      ...request.files('faceImages[]', validationOptions),
    ]

    if (!required && files.length === 0) {
      return files
    }

    if (files.length !== faceRecognitionConfig.maxImagesPerUser) {
      session.flash({
        error: `Envie exatamente ${faceRecognitionConfig.maxImagesPerUser} fotos do rosto.`,
      })
      return null
    }

    for (const file of files) {
      if (!file.isValid) {
        session.flash({ error: file.errors[0]?.message ?? 'Uma das imagens de rosto é inválida.' })
        return null
      }

      if (!file.tmpPath) {
        session.flash({ error: 'Não foi possível processar uma das imagens de rosto.' })
        return null
      }
    }

    return files
  }

  async createUserWithFaceImages(
    payload: StoreUserPayload,
    faceImages: UploadedFaceImage[],
    faceRecognition: FaceRecognitionService,
    session: HttpContext['session']
  ) {
    const faceDescriptors = await this.extractFaceDescriptors(faceRecognition, faceImages, session)
    if (!faceDescriptors) {
      return null
    }

    const user = await User.create({ ...payload })
    await this.storeFaceImages(user, faceImages, faceDescriptors)

    return user
  }

  async updateUserWithFaceImages(
    user: User,
    payload: UpdateUserPayload,
    faceImages: UploadedFaceImage[],
    faceRecognition: FaceRecognitionService,
    session: HttpContext['session']
  ) {
    const emailOwner = await User.query()
      .where('email', payload.email)
      .whereNot('id', user.id)
      .first()

    if (emailOwner) {
      session.flash({ error: 'Este e-mail já está em uso.' })
      return false
    }

    const faceDescriptors =
      faceImages.length > 0
        ? await this.extractFaceDescriptors(faceRecognition, faceImages, session)
        : []
    if (!faceDescriptors) {
      return false
    }

    user.merge({
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      gasStationId: payload.gasStationId ?? null,
    })

    if (payload.password) {
      user.password = payload.password
    }

    await user.save()

    if (faceImages.length > 0) {
      await this.replaceFaceImages(user, faceImages, faceDescriptors)
    }

    return true
  }

  private async extractFaceDescriptors(
    faceRecognition: FaceRecognitionService,
    faceImages: UploadedFaceImage[],
    session: HttpContext['session']
  ) {
    try {
      return await Promise.all(
        faceImages.map(async (faceImage) => {
          if (this.isHeicImage(faceImage)) {
            return faceRecognition.getDescriptorFromBuffer(
              await convertHeicPathToJpegBuffer(faceImage.tmpPath!)
            )
          }

          return faceRecognition.getDescriptorFromPath(faceImage.tmpPath!)
        })
      )
    } catch (error) {
      session.flash({
        error: error instanceof Error ? error.message : 'Não foi possível ler as imagens de rosto.',
      })
      return null
    }
  }

  private async replaceFaceImages(
    user: User,
    faceImages: UploadedFaceImage[],
    faceDescriptors: FaceDescriptor[]
  ) {
    await user.load('faceImages')

    await Promise.all(
      user.faceImages.map(async (faceImage) => {
        await drive.use().delete(faceImage.imagePath)
        await faceImage.delete()
      })
    )

    await this.storeFaceImages(user, faceImages, faceDescriptors)
  }

  private async storeFaceImages(
    user: User,
    faceImages: UploadedFaceImage[],
    faceDescriptors: FaceDescriptor[]
  ) {
    await Promise.all(
      faceImages.map(async (faceImage, index) => {
        const isHeic = this.isHeicImage(faceImage)
        const fileExtension = isHeic ? 'jpg' : (faceImage.extname ?? 'jpg')
        const imagePath = `users/${user.id}/faces/${randomUUID()}.${fileExtension}`
        const contentType = isHeic
          ? 'image/jpeg'
          : faceImage.type && faceImage.subtype
            ? `${faceImage.type}/${faceImage.subtype}`
            : undefined

        if (isHeic) {
          await drive.use().put(imagePath, await convertHeicPathToJpegBuffer(faceImage.tmpPath!), {
            contentType,
          })
        } else {
          await drive.use().moveFromFs(faceImage.tmpPath!, imagePath, {
            contentType,
          })
        }

        await UserFaceImage.create({
          userId: user.id,
          imagePath,
          faceDescriptor: JSON.stringify(faceDescriptors[index]),
        })
      })
    )
  }

  private isHeicImage(faceImage: UploadedFaceImage) {
    return isHeicExtension(faceImage.extname)
  }
}
