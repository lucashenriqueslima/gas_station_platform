import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vounchers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code').notNullable()
      table.enum('type', ['operational', 'commercial'])
      table.enum('partner', ['solidy', 'motoclub'])
      table.integer('max_utilizations').notNullable()
      table.integer('current_utilizations').notNullable().defaultTo(0)
      table.decimal('ethanol_price', 10, 2).notNullable()
      table.decimal('gasoline_price', 10, 2).notNullable()
      table.decimal('diesel_price', 10, 2).notNullable()
      table.dateTime('expires_at').notNullable()
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
