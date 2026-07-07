import { asc } from 'drizzle-orm'
import { db } from '../client'
import { heroImages } from '../schema'

export type HeroImageRow = typeof heroImages.$inferSelect

// Toàn bộ ảnh hero (kể cả đang ẩn), theo thứ tự hiển thị — dùng cho trang admin.
export async function listHeroImages(): Promise<HeroImageRow[]> {
  return db
    .select()
    .from(heroImages)
    .orderBy(asc(heroImages.sortOrder), asc(heroImages.createdAt))
}
