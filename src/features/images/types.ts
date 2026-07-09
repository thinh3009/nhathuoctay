import type { heroImages } from '@/db/schema'

/** Bản ghi ảnh hero (banner trang chủ) thô từ DB (Drizzle). */
export type HeroImageRecord = typeof heroImages.$inferSelect
