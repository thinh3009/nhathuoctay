import type { users } from '@/db/schema'

export type { EditUserInput } from './schemas'

export type UserRole = 'customer' | 'admin' | 'pharmacist'

/** Bản ghi người dùng thô từ DB (Drizzle). */
export type UserRecord = typeof users.$inferSelect
