/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string({ format: 'url', tld: false }),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Database
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum(['s3'] as const),
  AWS_ACCESS_KEY_ID: Env.schema.string(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string(),
  AWS_REGION: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),

  // External integrations
  ILEVA_BASE_URL: Env.schema.string({ format: 'url', tld: false }),
  ILEVA_USERNAME: Env.schema.secret(),
  ILEVA_PASSWORD: Env.schema.secret(),
  ILEVA_SOLIDY_APP_KEY: Env.schema.secret(),
  ILEVA_MOTOCLUB_APP_KEY: Env.schema.secret(),
  PLATE_RECOGNIZER_BASE_URL: Env.schema.string({ format: 'url', tld: false }),
  PLATE_RECOGNIZER_TOKEN: Env.schema.secret(),

  // Face recognition
  FACE_RECOGNITION_MODELS_PATH: Env.schema.string.optional(),
  FACE_RECOGNITION_MIN_CONFIDENCE: Env.schema.number.optional(),
  FACE_RECOGNITION_MATCH_THRESHOLD: Env.schema.number.optional(),
  FACE_RECOGNITION_MAX_IMAGES_PER_USER: Env.schema.number.optional(),

  EZCHAT_BASE_URL: Env.schema.string({ format: 'url', tld: false }),
  EZCHAT_API_TOKEN: Env.schema.secret(),

  EVOLUTION_BASE_URL: Env.schema.string({ format: 'url', tld: false }),
  EVOLUTION_API_KEY: Env.schema.secret(),

  SOLIDY_INGEST_LEADS_URL: Env.schema.string({ format: 'url', tld: false }),
  SOLIDY_INGEST_LEADS_API_KEY: Env.schema.secret(),

  /*
  |----------------------------------------------------------
  | Variables for configuring @adonisjs/queue
  |----------------------------------------------------------
  */
  QUEUE_DRIVER: Env.schema.enum(['redis', 'database', 'sync'] as const)
})
