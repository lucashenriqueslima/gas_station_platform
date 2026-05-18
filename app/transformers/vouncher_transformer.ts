import { BaseTransformer } from '@adonisjs/core/transformers'
import Vouncher from '#models/vouncher'

export default class VouncherTransformer extends BaseTransformer<Vouncher> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}