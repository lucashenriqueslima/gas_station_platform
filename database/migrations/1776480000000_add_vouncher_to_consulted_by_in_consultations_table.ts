import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'consultations'

  async up() {
    this.defer(async (db) => {
      await db.rawQuery(`
        ALTER TABLE \`${this.tableName}\`
        MODIFY COLUMN \`consulted_by\` ENUM('license_plate', 'cpf', 'vouncher') NOT NULL
      `)
    })
  }

  async down() {
    this.defer(async (db) => {
      await db.rawQuery(`
        ALTER TABLE \`${this.tableName}\`
        MODIFY COLUMN \`consulted_by\` ENUM('license_plate', 'cpf') NOT NULL
      `)
    })
  }
}
