import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

export default {
  types: {
    decimal: {
      tsType: 'number',
      imports: [],
      decorator: '@column({ consume: (value) => (value === null ? null : Number(value)) })',
    },
    boolean: {
      tsType: 'boolean',
      imports: [],
      decorator: '@column({ consume: (value) => (value === null ? null : Boolean(value)) })',
    },
  },
  tables: {
    vounchers: {
      columns: {
        type: {
          tsType: `'operational' | 'commercial'`,
        },
      },
    },
  },
} satisfies SchemaRules
