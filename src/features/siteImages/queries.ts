import 'server-only'
import { db } from '@/lib/db'
import { siteImages } from '@/db/schema'
import { SITE_IMAGE_SLOTS, type SiteImageMap, type SiteImageRecord, type SiteImageSlot } from './types'

// Tag cache dùng chung để action admin làm mới ảnh giao diện trên storefront ngay.
export const SITE_IMAGES_CACHE_TAG = 'site-images'

// Map slot → URL công khai. Dùng ở landing (server) và API cho header route pages.
// Trả về {} nếu bảng site_images chưa tồn tại (migration manual-0003 chưa chạy) —
// storefront chỉ hiển thị giao diện mặc định, không sập trang.
export async function getSiteImageMap(): Promise<SiteImageMap> {
  try {
    const rows = await db.select().from(siteImages)
    const map: SiteImageMap = {}
    for (const row of rows) {
      if ((SITE_IMAGE_SLOTS as readonly string[]).includes(row.slot)) {
        map[row.slot as SiteImageSlot] = row.url
      }
    }
    return map
  } catch {
    return {}
  }
}

// Bản ghi đầy đủ (kèm storagePath) — dùng cho trang admin để xóa file cũ.
export async function listSiteImages(): Promise<SiteImageRecord[]> {
  try {
    return await db.select().from(siteImages)
  } catch {
    return []
  }
}
