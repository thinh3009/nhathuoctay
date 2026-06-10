import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema.ts'

declare global {
  var __nutrihome_sql__: ReturnType<typeof postgres> | undefined
}

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL

  if (!url) {
    throw new Error('DATABASE_URL is required to connect to PostgreSQL.')
  }

  return url
}

const sql = globalThis.__nutrihome_sql__ ?? postgres(getDatabaseUrl(), { prepare: false })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__nutrihome_sql__ = sql
}

export const db = drizzle(sql, { schema })
