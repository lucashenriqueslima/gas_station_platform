import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('ileva_vehicle_id').notNullable()
      table.string('license_plate').notNullable()
      table.enum('partner', ['solidy', 'motoclub']).notNullable()
      table.enum('consulted_by', ['license_plate', 'cpf']).notNullable()
      table.string('vehicle_situation').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
