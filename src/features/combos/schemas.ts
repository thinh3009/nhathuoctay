import { z } from 'zod'

// Validate form tạo combo. Slug thành viên đã lọc rỗng & bỏ trùng trước khi parse.
export const createComboSchema = z.object({
  title: z.string().trim().min(1, 'Tên combo là bắt buộc'),
  tag: z
    .string()
    .trim()
    .transform((value) => value || 'Tiết kiệm')
    .default('Tiết kiệm'),
  productSlugs: z.array(z.string().min(1)).min(1, 'Chọn ít nhất 1 sản phẩm'),
})

export type CreateComboInput = z.infer<typeof createComboSchema>
