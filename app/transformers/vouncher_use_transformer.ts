import { BaseTransformer } from '@adonisjs/core/transformers'
import VouncherUtilization from '#models/vouncher_utilization'

export default class VouncherUseTransformer extends BaseTransformer<VouncherUtilization> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}
