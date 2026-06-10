import { defineConfig } from 'drizzle-kit'

process.loadEnvFile?.('.env')

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL ?? '',
  },
})
