import type { products } from '@/db/schema'

// Kiểu miền công khai của feature sản phẩm — nguồn canonical cho components dùng.
export type { Product, Review, ProductImage, ProductSearchParams, CategoryNavItem } from '@/lib/schemas'
export type { ProductCoreInput } from './schemas'

/** Bản ghi sản phẩm thô từ DB (Drizzle). */
export type ProductRecord = typeof products.$inferSelect
