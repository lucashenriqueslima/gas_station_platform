import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().nullable().after('gas_station_id')
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['user_id'])
      table.dropColumn('user_id')
    })
  }
}
