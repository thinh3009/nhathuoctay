import 'server-only'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { heroImages } from '@/db/schema'
import type { HeroImageRecord } from './types'

// Toàn bộ ảnh hero (kể cả đang ẩn), theo thứ tự hiển thị — dùng cho trang admin.
export async function listHeroImages(): Promise<HeroImageRecord[]> {
  return db
    .select()
    .from(heroImages)
    .orderBy(asc(heroImages.sortOrder), asc(heroImages.createdAt))
}
