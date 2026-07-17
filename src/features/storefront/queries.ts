import 'server-only'
import { unstable_cache } from 'next/cache'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  categories as categoriesTable,
  comboItems as comboItemsTable,
  combos as combosTable,
  heroImages as heroImagesTable,
  products as productsTable,
} from '@/db/schema'
import { listPublishedArticles } from '@/features/articles/queries'
import { normalizeProductImages } from '@/lib/productImages'
import type { CategorySlug } from '@/lib/constants'
import type { Cat, NewsArticle, Product, StorefrontCombo } from '@/features/storefront/data'

// Tag cache dữ liệu trang chủ. Action admin ghi sản phẩm/danh mục/bài viết phải gọi
// revalidateTag(STOREFRONT_CACHE_TAG) để khách thấy thay đổi ngay, không đợi hết 60s.
export const STOREFRONT_CACHE_TAG = 'storefront'

// Map slug danh mục trong DB → enum `cat` mà storefront trang chủ dùng.
const CATEGORY_TO_CAT: Record<string, Cat> = {
  thuoc: 'thuoc',
  'thuc-pham-chuc-nang': 'tpcn',
  'thiet-bi-y-te': 'thietbi',
  'cham-soc-da': 'skincare',
}

// Lấy toàn bộ sản phẩm đang bán từ DB, map sang shape của trang chủ (QuayThuoc16).
// Loại cả sản phẩm thuộc danh mục đã ẩn (admin ngừng bán loại hàng đó).
async function fetchStorefrontProducts(): Promise<Product[]> {
  const rows = await db
    .select({ product: productsTable })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categorySlug, categoriesTable.slug))
    .where(and(eq(productsTable.isActive, true), eq(categoriesTable.isActive, true)))
    .then((result) => result.map((item) => item.product))

  return rows.map((row) => ({
    id: row.slug,
    name: row.name,
    cat: CATEGORY_TO_CAT[row.categorySlug] ?? 'thuoc',
    // Ảnh chính: ảnh admin upload (Supabase Storage) hoặc ảnh demo theo danh mục.
    image: normalizeProductImages(row.categorySlug as CategorySlug, row.slug, row.images)[0]?.src,
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
    shopeeUrl: row.shopeeUrl ?? undefined,
    tiktokUrl: row.tiktokUrl ?? undefined,
  }))
}

// Lấy bài viết đã đăng từ DB, map sang shape tin tức của trang chủ (QuayThuoc16).
// `id` = slug để trang chủ điều hướng sang /bai-viet/[slug].
async function fetchStorefrontNews(): Promise<NewsArticle[]> {
  const rows = await listPublishedArticles()

  return rows.map((row) => ({
    id: row.slug,
    tag: row.category,
    title: row.title,
    date: row.publishedAt ? new Date(row.publishedAt).toLocaleDateString('vi-VN') : '',
    excerpt: row.excerpt,
  }))
}

// Lấy combo đang bật từ DB kèm sản phẩm thành viên (chỉ thành viên còn đang bán).
// Combo không còn thành viên hợp lệ sẽ bị loại. Giá hiệu lực = salePrice ?? price.
async function fetchStorefrontCombos(): Promise<StorefrontCombo[]> {
  const comboRows = await db
    .select()
    .from(combosTable)
    .where(eq(combosTable.isActive, true))
    .orderBy(asc(combosTable.createdAt))

  if (comboRows.length === 0) return []

  const memberRows = await db
    .select({
      comboId: comboItemsTable.comboId,
      slug: productsTable.slug,
      name: productsTable.name,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
    })
    .from(comboItemsTable)
    .innerJoin(productsTable, eq(comboItemsTable.productSlug, productsTable.slug))
    .where(eq(productsTable.isActive, true))
    .orderBy(asc(comboItemsTable.createdAt))

  return comboRows
    .map((combo) => ({
      id: combo.id,
      title: combo.title,
      tag: combo.tag,
      salePrice: combo.salePrice,
      items: memberRows
        .filter((member) => member.comboId === combo.id)
        .map((member) => ({
          slug: member.slug,
          name: member.name,
          price: member.salePrice ?? member.price,
        })),
    }))
    .filter((combo) => combo.items.length > 0)
}

// Ảnh hero (banner trang chủ) đang bật, sắp theo thứ tự admin đặt. Trả về mảng URL.
async function fetchStorefrontHeroImages(): Promise<string[]> {
  const rows = await db
    .select({ url: heroImagesTable.url })
    .from(heroImagesTable)
    .where(eq(heroImagesTable.isActive, true))
    .orderBy(asc(heroImagesTable.sortOrder), asc(heroImagesTable.createdAt))

  return rows.map((row) => row.url)
}

// Trang chủ render động mỗi request (đọc searchParams để giữ đúng màn SPA khi F5),
// nhưng dữ liệu lấy qua Data Cache: tối đa 1 lượt query DB mỗi 60s, và admin action
// gọi revalidateTag để làm mới ngay. DB gián đoạn ngắn vẫn còn cache để phục vụ.
export const getStorefrontProducts = unstable_cache(fetchStorefrontProducts, ['storefront-products'], {
  revalidate: 60,
  tags: [STOREFRONT_CACHE_TAG],
})

export const getStorefrontNews = unstable_cache(fetchStorefrontNews, ['storefront-news'], {
  revalidate: 60,
  tags: [STOREFRONT_CACHE_TAG],
})

export const getStorefrontCombos = unstable_cache(fetchStorefrontCombos, ['storefront-combos'], {
  revalidate: 60,
  tags: [STOREFRONT_CACHE_TAG],
})

export const getStorefrontHeroImages = unstable_cache(fetchStorefrontHeroImages, ['storefront-hero'], {
  revalidate: 60,
  tags: [STOREFRONT_CACHE_TAG],
})
