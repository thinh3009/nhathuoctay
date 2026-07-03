import { eq } from 'drizzle-orm'
import { db } from '../client'
import { products as productsTable } from '../schema'
import type { Cat, Product } from '@/components/quaythuoc/data'

// Map slug danh mục trong DB → enum `cat` mà storefront trang chủ dùng.
const CATEGORY_TO_CAT: Record<string, Cat> = {
  thuoc: 'thuoc',
  'thuc-pham-chuc-nang': 'tpcn',
  'thiet-bi-y-te': 'thietbi',
  'cham-soc-da': 'skincare',
}

// Lấy toàn bộ sản phẩm đang bán từ DB, map sang shape của trang chủ (QuayThuoc16).
export async function getStorefrontProducts(): Promise<Product[]> {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isActive, true))

  return rows.map((row) => ({
    id: row.slug,
    name: row.name,
    cat: CATEGORY_TO_CAT[row.categorySlug] ?? 'thuoc',
    brand: row.manufacturer || row.subCategory || '',
    uses: row.subCategory ? [row.subCategory] : [],
    // DB: `price` là giá gốc, `salePrice` là giá giảm (nếu có).
    // Storefront: `price` là giá hiển thị, `oldPrice` là giá gạch.
    price: row.salePrice ?? row.price,
    oldPrice: row.salePrice ? row.price : undefined,
    rating: row.rating,
    reviews: row.reviewCount,
    unit: row.unit,
    badge: row.badge || undefined,
  }))
}
