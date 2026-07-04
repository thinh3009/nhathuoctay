import { eq } from 'drizzle-orm'
import { db } from '../client'
import { categories, productReviews, products as productsTable } from '../schema'
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
  })
}

async function getProductsByCategorySlug(categorySlug: string) {
  const rows = await db.query.products.findMany({
    where: eq(productsTable.categorySlug, categorySlug),
    with: {
      category: true,
      reviews: true,
    },
  })

  return rows.filter((row) => row.isActive)
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
      reviews: true,
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
