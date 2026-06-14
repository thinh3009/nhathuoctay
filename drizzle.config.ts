import { defineConfig } from 'drizzle-kit'
import { existsSync } from 'fs'

// Load .env.local nếu có, fallback về .env
if (existsSync('.env.local')) {
  process.loadEnvFile?.('.env.local')
} else if (existsSync('.env')) {
  process.loadEnvFile?.('.env')
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? '',
  },
})
