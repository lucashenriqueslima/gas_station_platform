import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('ileva_vehicle_id').nullable()
      table.string('license_plate').notNullable()
      table.enum('partner', ['solidy', 'motoclub']).nullable()
      table.enum('consulted_by', ['license_plate', 'cpf']).notNullable()
      table.string('vehicle_situation').notNullable()
      table.boolean('was_refueled').defaultTo(false)
      table.string('fuel_pump_visor_image').nullable().defaultTo(null)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
