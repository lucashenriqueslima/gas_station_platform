import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vounchers'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('created_by').unsigned().nullable().after('is_active')
      table
        .foreign('created_by')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['created_by'])
      table.dropColumn('created_by')
    })
  }
}
