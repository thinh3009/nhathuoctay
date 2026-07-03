import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

declare global {
  var __nutrihome_sql__: ReturnType<typeof postgres> | undefined
  var __nutrihome_db__: PostgresJsDatabase<typeof schema> | undefined
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

function createDb(): PostgresJsDatabase<typeof schema> {
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

  return drizzle(sql, { schema })
}

function getDb(): PostgresJsDatabase<typeof schema> {
  return (globalThis.__nutrihome_db__ ??= createDb())
}

// Lazy proxy: kết nối chỉ được khởi tạo ở lần truy vấn đầu tiên (runtime),
// không phải khi import module. Nhờ vậy bước "collect page data" của
// `next build` trên Vercel không cần DATABASE_URL và không throw lúc build.
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const instance = getDb()
    const value = Reflect.get(instance, prop, receiver)
    return typeof value === 'function' ? value.bind(instance) : value
  },
})
