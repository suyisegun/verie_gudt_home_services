import { config as loadEnv } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Next.js conventionally keeps local secrets in .env.local (already gitignored) rather than
// the default .env dotenv looks for — load it explicitly so `prisma` CLI commands see the same
// DATABASE_URL the app uses at runtime.
loadEnv({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
