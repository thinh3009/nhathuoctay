'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { STOREFRONT_CACHE_TAG } from '@/features/storefront/queries'
import { createCategorySchema } from './schemas'

export async function createCategory(formData: FormData) {
  await requireAdmin()

  const parsed = createCategorySchema.safeParse({
    label: formData.get('label'),
    slug: formData.get('slug'),
    heroTitle: formData.get('heroTitle') ?? '',
    heroDescription: formData.get('heroDescription') ?? '',
  })

  if (!parsed.success) {
    // Form không hiển thị lỗi chi tiết; chặn ghi dữ liệu sai định dạng là đủ.
    return
  }

  await db.insert(categories).values(parsed.data)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

// Bật/tắt hiển thị danh mục trên storefront. Khi ẩn: nav, trang danh mục,
// trang chủ và trang chi tiết sản phẩm thuộc danh mục đều không truy cập được.
export async function toggleCategoryActive(slug: string, nextActive: boolean) {
  await requireAdmin()

  await db
    .update(categories)
    .set({ isActive: nextActive, updatedAt: new Date() })
    .where(eq(categories.slug, slug))

  revalidatePath('/admin/categories')
  updateTag(STOREFRONT_CACHE_TAG) // data cache trang chủ cập nhật danh sách sản phẩm ngay
  revalidatePath(`/category/${slug}`)
}
