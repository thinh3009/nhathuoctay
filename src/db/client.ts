import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.ts'

declare global {
  var __nutrihome_sql__: ReturnType<typeof postgres> | undefined
}

function getDatabaseUrl() {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL_NON_POOLING

  if (!url) {
    throw new Error(
      'A PostgreSQL connection string is required. Set DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL, or POSTGRES_URL_NON_POOLING.',
    )
  }

  return url
}

const sql = globalThis.__nutrihome_sql__ ?? postgres(getDatabaseUrl(), { prepare: false })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__nutrihome_sql__ = sql
}

export const db = drizzle(sql, { schema })
