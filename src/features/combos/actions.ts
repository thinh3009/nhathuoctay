'use server'

import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { comboItems, combos } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { STOREFRONT_CACHE_TAG } from '@/features/storefront/queries'
import { createComboSchema } from './schemas'

export async function createCombo(formData: FormData) {
  await requireAdmin()

  const parsed = createComboSchema.safeParse({
    title: formData.get('title'),
    tag: formData.get('tag') ?? undefined,
    // Bỏ trùng slug để tránh vi phạm unique (combo_id, product_slug).
    productSlugs: [...new Set(formData.getAll('productSlugs').map(String).filter(Boolean))],
  })

  // Thiếu tên hoặc chưa chọn thuốc → quay lại form (client cũng đã chặn submit rỗng).
  if (!parsed.success) redirect('/admin/combos/new')

  const { title, tag, productSlugs } = parsed.data
  const [combo] = await db.insert(combos).values({ title, tag }).returning({ id: combos.id })
  await db.insert(comboItems).values(productSlugs.map((slug) => ({ comboId: combo.id, productSlug: slug })))

  revalidatePath('/admin/combos')
  updateTag(STOREFRONT_CACHE_TAG) // section combo trang chủ hiển thị ngay
  redirect('/admin/combos')
}

export async function deleteCombo(formData: FormData) {
  await requireAdmin()
  const id = formData.get('id') as string
  if (!id) return
  // combo_items ON DELETE CASCADE → xóa combo là gỡ luôn thành viên.
  await db.delete(combos).where(eq(combos.id, id))
  revalidatePath('/admin/combos')
  updateTag(STOREFRONT_CACHE_TAG) // section combo trang chủ cập nhật ngay
}
