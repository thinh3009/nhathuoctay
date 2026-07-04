import { db } from '@/db/client'
import { products } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { isUploadedImage } from '@/lib/productImages'
import type { ProductImage } from '@/lib/schemas'
import { listStorageObjects, summarizeStorageUsage } from '@/db/queries/storage'
import ImageManagerClient, { type ManagedImage } from './ImageManagerClient'

// Trang đọc thẳng Storage của Supabase mỗi lần vào để dung lượng luôn cập nhật.
export const dynamic = 'force-dynamic'

export default async function AdminImagesPage() {
  await requireAdmin()

  const [objects, productRows] = await Promise.all([
    listStorageObjects(),
    db.select({ name: products.name, slug: products.slug, images: products.images }).from(products),
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
    deletable: object.name.startsWith('uploads/'),
    usedByProduct: usageByPath.get(object.name) ?? null,
  }))

  const usage = summarizeStorageUsage(objects)

  return <ImageManagerClient images={images} usage={usage} />
}
