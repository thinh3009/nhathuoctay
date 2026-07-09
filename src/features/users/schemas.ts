import { z } from 'zod'

export const USER_ROLES = ['customer', 'pharmacist', 'admin'] as const

// Cập nhật hồ sơ người dùng từ khu quản trị. Mật khẩu để trống = không đổi.
export const editUserSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z
    .string()
    .trim()
    .transform((value) => value || null)
    .nullable(),
  password: z
    .string()
    .refine((value) => value === '' || value.length >= 6, 'Mật khẩu tối thiểu 6 ký tự'),
})

export type EditUserInput = z.infer<typeof editUserSchema>
