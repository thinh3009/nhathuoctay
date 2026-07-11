import { db } from '@/lib/db'
import { products } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { isUploadedImage, isUploadedPath } from '@/lib/productImages'
import type { ProductImage } from '@/lib/schemas'
import { listStorageObjects, summarizeStorageUsage } from '@/features/images/storage'
import { listHeroImages } from '@/features/images/queries'
import { getSiteImageMap } from '@/features/siteImages/queries'
import ImageManagerClient, { type ManagedImage } from '@/features/images/components/ImageManagerClient'

// Trang đọc thẳng Storage của Supabase mỗi lần vào để dung lượng luôn cập nhật.
export const dynamic = 'force-dynamic'

export default async function AdminImagesPage() {
  await requireAdmin()

  const [objects, productRows, heroRows, siteImages] = await Promise.all([
    listStorageObjects(),
    db.select({ name: products.name, slug: products.slug, images: products.images }).from(products),
    listHeroImages(),
    getSiteImageMap(),
  ])

  // Map storagePath → tên sản phẩm đang dùng ảnh đó (chỉ với ảnh admin upload).
  const usageByPath = new Map<string, string>()
  for (const row of productRows) {
    for (const image of (row.images ?? []) as ProductImage[]) {
      if (isUploadedImage(image)) {
        usageByPath.set(image.storagePath, row.name)
      }
    }
  }

  const images: ManagedImage[] = objects.map((object) => ({
    name: object.name,
    size: object.size,
    mimeType: object.mimeType,
    updatedAt: object.updatedAt,
    publicUrl: object.publicUrl,
    deletable: isUploadedPath(object.name),
    usedByProduct: usageByPath.get(object.name) ?? null,
  }))

  const usage = summarizeStorageUsage(objects)

  // Hạn mức Storage của gói Supabase (GB) — đặt NEXT_PUBLIC_STORAGE_LIMIT_GB khi lên gói trả phí.
  const limitGb = Number.parseFloat(process.env.NEXT_PUBLIC_STORAGE_LIMIT_GB ?? '1')
  const storageLimitBytes = (Number.isFinite(limitGb) && limitGb > 0 ? limitGb : 1) * 1024 * 1024 * 1024

  const heroImages = heroRows.map((row) => ({ id: row.id, url: row.url }))

  return (
    <ImageManagerClient
      heroImages={heroImages}
      images={images}
      siteImages={siteImages}
      storageLimitBytes={storageLimitBytes}
      usage={usage}
    />
  )
}
