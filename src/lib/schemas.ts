import { z } from 'zod'
import {
  CATEGORY_CONFIG,
  CATEGORY_SLUGS,
  PRODUCT_PRICE_RANGES,
  PRODUCT_SORT_OPTIONS,
  PRODUCTS_PER_PAGE,
} from './constants.ts'

export const reviewSchema = z.object({
  author: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  date: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
})

export const categoryNavItemSchema = z.object({
  slug: z.enum(CATEGORY_SLUGS),
  label: z.string().min(1),
  heroTitle: z.string().min(1),
  heroDescription: z.string().min(1),
})

export const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  topCategory: z.string().min(1),
  topCategorySlug: z.enum(CATEGORY_SLUGS),
  subCategory: z.string().min(1),
  benefit: z.string().min(1),
  description: z.string().min(1),
  shortDescription: z.string().min(1),
  price: z.number().int().nonnegative(),
  badge: z.string().min(1),
  ingredients: z.array(z.string().min(1)).min(1),
  usage: z.string().min(1),
  unit: z.string().min(1),
  defaultQuantity: z.number().int().min(1),
  sku: z.string().min(1),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
  officialName: z.string().min(1),
  registrationNumber: z.string().min(1),
  form: z.string().min(1),
  specification: z.string().min(1),
  manufacturer: z.string().min(1),
  countryOfOrigin: z.string().min(1),
  shelfLife: z.string().min(1),
  ingredientHighlight: z.string().min(1),
  images: z.array(z.string().min(1)).min(1),
  reviews: z.array(reviewSchema),
})

export const productSearchParamsSchema = z.object({
  category: z.enum(CATEGORY_SLUGS).optional(),
  subCategory: z.string().optional(),
  priceRange: z.enum(PRODUCT_PRICE_RANGES).default('all'),
  sort: z.enum(PRODUCT_SORT_OPTIONS).default('featured'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(PRODUCTS_PER_PAGE),
})

export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().min(1),
})

export const productListResponseSchema = z.object({
  category: categoryNavItemSchema,
  filters: z.object({
    subCategories: z.array(z.string()),
  }),
  items: z.array(productSchema),
  pagination: paginationMetaSchema,
})

export const addToCartInputSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.number().int().min(1),
})

export const updateCartItemInputSchema = z.object({
  quantity: z.number().int().min(0),
})

export const cartItemSchema = z.object({
  productSlug: z.string().min(1),
  quantity: z.number().int().min(1),
  product: productSchema,
  subtotal: z.number().int().nonnegative(),
})

export const cartResponseSchema = z.object({
  id: z.string().min(1),
  token: z.string().min(1),
  totalItems: z.number().int().nonnegative(),
  subtotal: z.number().int().nonnegative(),
  items: z.array(cartItemSchema),
})

export const categoriesResponseSchema = z.object({
  items: z.array(categoryNavItemSchema),
})

export const relatedProductsResponseSchema = z.object({
  items: z.array(productSchema),
})

export const productReviewsResponseSchema = z.object({
  productSlug: z.string().min(1),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  commentCount: z.number().int().nonnegative(),
  items: z.array(reviewSchema),
})

export type Review = z.infer<typeof reviewSchema>
export type CategoryNavItem = z.infer<typeof categoryNavItemSchema>
export type Product = z.infer<typeof productSchema>
export type ProductSearchParams = z.infer<typeof productSearchParamsSchema>
export type CartResponse = z.infer<typeof cartResponseSchema>
export type AddToCartInput = z.infer<typeof addToCartInputSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemInputSchema>

categoryNavItemSchema.array().parse(CATEGORY_CONFIG)
