import type { siteImages } from '@/db/schema'

// Các vị trí ảnh giao diện admin có thể tùy biến.
export const SITE_IMAGE_SLOTS = ['hero', 'cta', 'logo'] as const
export type SiteImageSlot = (typeof SITE_IMAGE_SLOTS)[number]

/** Bản ghi ảnh giao diện thô từ DB. */
export type SiteImageRecord = typeof siteImages.$inferSelect

/** Map slot → URL công khai (chỉ những slot đã đặt ảnh). */
export type SiteImageMap = Partial<Record<SiteImageSlot, string>>
