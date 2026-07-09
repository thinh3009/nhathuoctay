import type { categories } from '@/db/schema'

export type { CreateCategoryInput } from './schemas'

/** Bản ghi danh mục thô từ DB (Drizzle). */
export type CategoryRecord = typeof categories.$inferSelect
