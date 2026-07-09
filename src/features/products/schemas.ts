import { z } from 'zod'

// Ép '' / null về null cho các field số không bắt buộc (giá sale).
const nullableInt = z.preprocess(
  (v) => (v === '' || v == null ? null : v),
  z.coerce.number().int().nonnegative().nullable(),
)

// Ép '' / null về 0 cho field số mặc định 0 (tồn kho).
const intWithZeroDefault = z.preprocess(
  (v) => (v === '' || v == null ? 0 : v),
  z.coerce.number().int().nonnegative(),
)

// Validate các field cốt lõi của form sản phẩm (bắt buộc + kiểu số).
// Các field mô tả tự do được đọc trực tiếp trong action.
export const productCoreSchema = z.object({
  name: z.string().trim().min(1, 'Tên sản phẩm là bắt buộc'),
  categorySlug: z.string().trim().min(1, 'Danh mục là bắt buộc'),
  price: z.coerce.number().int().nonnegative('Giá bán không hợp lệ'),
  salePrice: nullableInt,
  stockQuantity: intWithZeroDefault,
})

export type ProductCoreInput = z.infer<typeof productCoreSchema>
