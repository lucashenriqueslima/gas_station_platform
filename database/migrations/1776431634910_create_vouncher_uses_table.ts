import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vouncher_utilizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('vouncher_id').notNullable()
      table.string('license_plate').notNullable()
      table.string('cpf').notNullable()
      table.string('name').notNullable()
      table.string('phone').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
