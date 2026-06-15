import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'leads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('partner', ['solidy', 'motoclub']).nullable()
      table.integer('ileva_associate_id')
      table.string('name')
      table.string('phone').unique().index()
      table.timestamp('created_at')
      table.timestamp('updated_at')

    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['phone'])
    })
    this.schema.dropTable(this.tableName)
  }
}