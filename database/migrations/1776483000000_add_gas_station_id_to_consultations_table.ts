import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('gas_station_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('gas_stations')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('gas_station_id')
    })
  }
}
