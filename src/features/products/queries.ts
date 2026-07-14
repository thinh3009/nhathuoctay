import 'server-only'
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, productReviews, products as productsTable } from '@/db/schema'
import {
  ALL_SUBCATEGORY_LABEL,
  DEFAULT_CATEGORY_SLUG,
  type CategorySlug,
  PRODUCTS_PER_PAGE,
} from '@/lib/constants'
import { normalizeProductImages } from '@/lib/productImages'
import {
  categoryNavItemSchema,
  productSchema,
  productSearchParamsSchema,
  productReviewsResponseSchema,
  relatedProductsResponseSchema,
  reviewSchema,
  type Product,
  type ProductSearchParams,
  type Review,
} from '@/lib/schemas'

type ProductRow = typeof productsTable.$inferSelect & {
  category: typeof categories.$inferSelect
  reviews: Array<typeof productReviews.$inferSelect>
}

function mapReview(row: typeof productReviews.$inferSelect): Review {
  return reviewSchema.parse({
    id: row.id,
    author: row.author,
    rating: row.rating,
    date: row.date,
    title: row.title,
    content: row.content,
  })
}

function mapProduct(row: ProductRow): Product {
  return productSchema.parse({
    slug: row.slug,
    name: row.name,
    topCategory: row.category.label,
    topCategorySlug: row.categorySlug,
    subCategory: row.subCategory,
    benefit: row.benefit,
    description: row.description,
    shortDescription: row.shortDescription,
    price: row.price,
    badge: row.badge,
    ingredients: row.ingredients,
    usage: row.usage,
    unit: row.unit,
    defaultQuantity: row.defaultQuantity,
    sku: row.sku,
    rating: row.rating,
    reviewCount: row.reviewCount,
    commentCount: row.commentCount,
    officialName: row.officialName,
    registrationNumber: row.registrationNumber,
    form: row.form,
    specification: row.specification,
    manufacturer: row.manufacturer,
    countryOfOrigin: row.countryOfOrigin,
    shelfLife: row.shelfLife,
    ingredientHighlight: row.ingredientHighlight,
    images: normalizeProductImages(row.categorySlug as CategorySlug, row.slug, row.images),
    reviews: row.reviews.map(mapReview),
    shopeeUrl: row.shopeeUrl,
    tiktokUrl: row.tiktokUrl,
  })
}

async function getProductsByCategorySlug(categorySlug: string) {
  const rows = await db.query.products.findMany({
    where: eq(productsTable.categorySlug, categorySlug),
    with: {
      category: true,
      reviews: { orderBy: [desc(productReviews.createdAt)] },
    },
  })

  return rows.filter((row) => row.isActive)
}

/* ── Truy vấn cho khu quản trị (kể cả sản phẩm/danh mục đã ẩn) ─────────────── */

// Danh sách sản phẩm cho trang quản trị, lọc theo tên/SKU (nếu có).
export async function searchAdminProducts(query: string) {
  return db
    .select({
      id: productsTable.id,
      slug: productsTable.slug,
      name: productsTable.name,
      price: productsTable.price,
      salePrice: productsTable.salePrice,
      badge: productsTable.badge,
      sku: productsTable.sku,
      isActive: productsTable.isActive,
      categorySlug: productsTable.categorySlug,
      categoryLabel: categories.label,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
    })
    .from(productsTable)
    .leftJoin(categories, eq(productsTable.categorySlug, categories.slug))
    .where(query ? or(ilike(productsTable.name, `%${query}%`), ilike(productsTable.sku, `%${query}%`)) : undefined)
    .orderBy(productsTable.name)
    .limit(200)
}

// Lấy 1 sản phẩm theo id để prefill form sửa (admin).
export async function getProductForEdit(id: string) {
  const rows = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1)
  return rows[0] ?? null
}

// Danh sách {slug, label} danh mục cho dropdown trong form sản phẩm (admin).
export async function listCategoryOptions() {
  return db.select({ slug: categories.slug, label: categories.label }).from(categories)
}

export async function getCategoryNavItems() {
  const rows = await db.query.categories.findMany()

  return categoryNavItemSchema
    .array()
    .parse(
      rows
        .filter((row) => row.isActive) // danh mục ẩn không xuất hiện trên nav/API công khai
        .map((row) => ({
          slug: row.slug,
          label: row.label,
          heroTitle: row.heroTitle,
          heroDescription: row.heroDescription,
        }))
        .sort((left, right) => left.label.localeCompare(right.label, 'vi')),
    )
}

export async function getCategoryBySlug(slug: string) {
  const row = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  })

  // Danh mục ẩn coi như không tồn tại với storefront → trang /category/[slug] trả 404.
  if (!row || !row.isActive) {
    return null
  }

  return categoryNavItemSchema.parse({
    slug: row.slug,
    label: row.label,
    heroTitle: row.heroTitle,
    heroDescription: row.heroDescription,
  })
}

export async function getProductBySlug(slug: string) {
  const row = await db.query.products.findFirst({
    where: eq(productsTable.slug, slug),
    with: {
      category: true,
      reviews: { orderBy: [desc(productReviews.createdAt)] },
    },
  })

  // Sản phẩm ẩn, hoặc thuộc danh mục đã ẩn → không xem được.
  if (!row || !row.isActive || !row.category.isActive) {
    return null
  }

  return mapProduct(row)
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const rows = await getProductsByCategorySlug(product.topCategorySlug)

  return relatedProductsResponseSchema.parse({
    items: rows
      .map(mapProduct)
      .filter((item) => item.slug !== product.slug)
      .sort((left, right) => {
        const leftScore = left.subCategory === product.subCategory ? 0 : 1
        const rightScore = right.subCategory === product.subCategory ? 0 : 1

        if (leftScore !== rightScore) {
          return leftScore - rightScore
        }

        return right.rating - left.rating
      })
      .slice(0, limit),
  }).items
}

// Tính lại rating trung bình + số đánh giá/bình luận của sản phẩm từ dữ liệu thật trong product_reviews.
async function recomputeProductRatingStats(productSlug: string) {
  const [agg] = await db
    .select({
      count: sql<number>`count(*)`,
      avgRating: sql<number>`coalesce(avg(${productReviews.rating}), 0)`,
    })
    .from(productReviews)
    .where(eq(productReviews.productSlug, productSlug))

  const count = Number(agg?.count ?? 0)
  const avgRating = Number(agg?.avgRating ?? 0)

  await db
    .update(productsTable)
    .set({
      rating: count > 0 ? Math.round(avgRating * 10) / 10 : 5,
      reviewCount: count,
      commentCount: count,
      updatedAt: new Date(),
    })
    .where(eq(productsTable.slug, productSlug))
}

// Một user chỉ có 1 đánh giá / sản phẩm — gửi lại thì cập nhật đánh giá cũ thay vì tạo thêm dòng mới.
export async function upsertProductReview(params: {
  productSlug: string
  userId: string
  author: string
  rating: number
  title: string
  content: string
}) {
  const { productSlug, userId, author, rating, title, content } = params
  const date = new Date().toLocaleDateString('vi-VN')

  const existing = await db.query.productReviews.findFirst({
    where: and(eq(productReviews.productSlug, productSlug), eq(productReviews.userId, userId)),
  })

  if (existing) {
    await db
      .update(productReviews)
      .set({ author, rating, title, content, date, updatedAt: new Date() })
      .where(eq(productReviews.id, existing.id))
  } else {
    await db.insert(productReviews).values({ productSlug, userId, author, rating, title, content, date })
  }

  await recomputeProductRatingStats(productSlug)

  return getProductReviews(productSlug)
}

export async function getUserReviewForProduct(productSlug: string, userId: string) {
  const row = await db.query.productReviews.findFirst({
    where: and(eq(productReviews.productSlug, productSlug), eq(productReviews.userId, userId)),
  })
  return row ? mapReview(row) : null
}

// Xoá một đánh giá (admin kiểm duyệt). Trả về null nếu review không thuộc sản phẩm này.
export async function deleteProductReview(productSlug: string, reviewId: string) {
  const [deleted] = await db
    .delete(productReviews)
    .where(and(eq(productReviews.id, reviewId), eq(productReviews.productSlug, productSlug)))
    .returning({ id: productReviews.id })

  if (!deleted) {
    return null
  }

  await recomputeProductRatingStats(productSlug)

  return getProductReviews(productSlug)
}

export async function getProductReviews(slug: string) {
  const product = await getProductBySlug(slug)

  if (!product) {
    return null
  }

  return productReviewsResponseSchema.parse({
    productSlug: product.slug,
    rating: product.rating,
    reviewCount: product.reviewCount,
    commentCount: product.commentCount,
    items: product.reviews,
  })
}

export async function listProducts(rawParams: Partial<Record<keyof ProductSearchParams, unknown>>) {
  const params = productSearchParamsSchema.parse(rawParams)
  const category = await getCategoryBySlug(params.category ?? DEFAULT_CATEGORY_SLUG)

  if (!category) {
    return null
  }

  const categoryProducts = (await getProductsByCategorySlug(category.slug)).map(mapProduct)
  const filteredProducts = categoryProducts
    .filter((product) => {
      if (
        params.subCategory &&
        params.subCategory !== ALL_SUBCATEGORY_LABEL &&
        product.subCategory !== params.subCategory
      ) {
        return false
      }

      if (params.priceRange === 'under-200') {
        return product.price < 200000
      }

      if (params.priceRange === '200-400') {
        return product.price >= 200000 && product.price <= 400000
      }

      if (params.priceRange === 'over-400') {
        return product.price > 400000
      }

      return true
    })
    .sort((left, right) => {
      switch (params.sort) {
        case 'price-asc':
          return left.price - right.price
        case 'price-desc':
          return right.price - left.price
        case 'name-asc':
          return left.name.localeCompare(right.name, 'vi')
        case 'rating-desc':
          return right.rating - left.rating
        default:
          return right.rating - left.rating
      }
    })

  const total = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(total / params.pageSize))
  const page = Math.min(params.page, totalPages)
  const startIndex = (page - 1) * params.pageSize
  const items = filteredProducts.slice(startIndex, startIndex + params.pageSize)

  return {
    category,
    filters: {
      subCategories: [...new Set(categoryProducts.map((product) => product.subCategory))],
    },
    items,
    pagination: {
      page,
      pageSize: params.pageSize ?? PRODUCTS_PER_PAGE,
      total,
      totalPages,
    },
    selected: {
      ...params,
      page,
    },
    suggestedProducts: categoryProducts
      .filter((product) => !items.some((item) => item.slug === product.slug))
      .sort((left, right) => right.rating - left.rating)
      .slice(0, 4),
  }
}
