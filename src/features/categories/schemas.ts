import { z } from 'zod'

// Validate dữ liệu form tạo danh mục (dùng chung client & server trong actions.ts).
export const createCategorySchema = z.object({
  label: z.string().trim().min(1, 'Tên danh mục là bắt buộc'),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug là bắt buộc')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'),
  heroTitle: z.string().trim().default(''),
  heroDescription: z.string().trim().default(''),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
