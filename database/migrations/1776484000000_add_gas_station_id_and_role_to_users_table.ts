import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('gas_station_id').unsigned().nullable().after('password')
      table
        .enum('role', ['attendant', 'manager', 'admin'])
        .notNullable()
        .defaultTo('admin')
        .after('gas_station_id')

      table.foreign('gas_station_id').references('id').inTable('gas_stations').onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['gas_station_id'])
      table.dropColumn('gas_station_id')
      table.dropColumn('role')
    })
  }
}
