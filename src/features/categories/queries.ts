import 'server-only'
import { db } from '@/lib/db'
import { categories } from '@/db/schema'
import type { CategoryRecord } from './types'

// Danh sách danh mục cho khu quản trị (kể cả danh mục đã ẩn), sắp theo tên.
export async function listAdminCategories(): Promise<CategoryRecord[]> {
  return db.select().from(categories).orderBy(categories.label)
}
