import type { comboItems, combos } from '@/db/schema'

export type { CreateComboInput } from './schemas'

/** Bản ghi combo & thành viên combo thô từ DB (Drizzle). */
export type ComboRecord = typeof combos.$inferSelect
export type ComboItemRecord = typeof comboItems.$inferSelect

/** Combo kèm tên các sản phẩm thành viên (dùng ở trang quản trị). */
export type ComboWithMembers = ComboRecord & { members: string[] }
