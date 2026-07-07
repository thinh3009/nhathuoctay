import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath, updateTag } from 'next/cache'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/db/client'
import { comboItems, combos, categories, products } from '@/db/schema'
import { STOREFRONT_CACHE_TAG } from '@/db/queries/storefront'
import { requireAdmin } from '@/lib/auth'
import ComboBuilder from '../_components/ComboBuilder'

async function createCombo(formData: FormData) {
  'use server'
  await requireAdmin()

  const title = (formData.get('title') as string)?.trim()
  const tag = ((formData.get('tag') as string) || 'Tiết kiệm').trim() || 'Tiết kiệm'
  // Bỏ trùng slug để tránh vi phạm unique (combo_id, product_slug).
  const slugs = [...new Set(formData.getAll('productSlugs').map(String).filter(Boolean))]

  // Thiếu tên hoặc chưa chọn thuốc → quay lại form (client cũng đã chặn submit rỗng).
  if (!title || slugs.length === 0) redirect('/admin/combos/new')

  const [combo] = await db.insert(combos).values({ title, tag }).returning({ id: combos.id })
  await db.insert(comboItems).values(slugs.map((slug) => ({ comboId: combo.id, productSlug: slug })))

  revalidatePath('/admin/combos')
  updateTag(STOREFRONT_CACHE_TAG) // section combo trang chủ hiển thị ngay
  redirect('/admin/combos')
}

async function getData() {
  const [productRows, categoryRows] = await Promise.all([
    db
      .select({
        slug: products.slug,
        name: products.name,
        categorySlug: products.categorySlug,
        price: products.price,
        salePrice: products.salePrice,
      })
      .from(products)
      .innerJoin(categories, eq(products.categorySlug, categories.slug))
      .where(and(eq(products.isActive, true), eq(categories.isActive, true)))
      .orderBy(asc(products.name)),
    db
      .select({ slug: categories.slug, label: categories.label })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.label)),
  ])

  return {
    products: productRows.map((p) => ({
      slug: p.slug,
      name: p.name,
      categorySlug: p.categorySlug,
      price: p.salePrice ?? p.price,
    })),
    categories: categoryRows,
  }
}

export default async function AdminNewComboPage() {
  const { products: productList, categories: categoryList } = await getData()

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link className="text-sm text-stone-500 hover:text-stone-700" href="/admin/combos">
          ← Combo
        </Link>
        <h1 className="text-2xl font-black text-stone-900">Tạo combo thuốc</h1>
      </div>

      <ComboBuilder action={createCombo} categories={categoryList} products={productList} />
    </div>
  )
}
