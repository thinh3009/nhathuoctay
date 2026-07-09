import 'server-only'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, comboItems, combos, products } from '@/db/schema'
import type { ComboWithMembers } from './types'

// Danh sách combo (admin) kèm tên các sản phẩm thành viên còn tồn tại.
export async function listCombosWithMembers(): Promise<ComboWithMembers[]> {
  const comboRows = await db.select().from(combos).orderBy(asc(combos.createdAt))
  if (comboRows.length === 0) return []

  const memberRows = await db
    .select({ comboId: comboItems.comboId, name: products.name })
    .from(comboItems)
    .innerJoin(products, eq(comboItems.productSlug, products.slug))
    .orderBy(asc(comboItems.createdAt))

  return comboRows.map((combo) => ({
    ...combo,
    members: memberRows.filter((m) => m.comboId === combo.id).map((m) => m.name),
  }))
}

// Dữ liệu cho trình tạo combo: sản phẩm đang bán + danh mục đang hiện.
export async function getComboBuilderData() {
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
