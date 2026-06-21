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

const sql =
  globalThis.__nutrihome_sql__ ??
  postgres(getDatabaseUrl(), {
    // Supabase transaction pooler (cổng 6543) không hỗ trợ prepared statements.
    prepare: false,
    // Giới hạn connection mỗi instance serverless (Vercel) để không cạn pool.
    max: 5,
    // Trả connection rảnh về pool nhanh trên môi trường serverless.
    idle_timeout: 20,
    connect_timeout: 10,
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__nutrihome_sql__ = sql
}

export const db = drizzle(sql, { schema })
