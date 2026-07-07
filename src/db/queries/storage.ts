import { sql } from 'drizzle-orm'
import { db } from '../client'
import { PRODUCT_IMAGE_BUCKET } from '@/lib/productImages'
import { getPublicUrl } from '@/lib/supabaseStorage'

export type StorageObject = {
  name: string
  size: number
  mimeType: string | null
  updatedAt: string | null
  publicUrl: string
}

export type StorageUsageBucket = {
  folder: string
  label: string
  fileCount: number
  totalBytes: number
}

// Nhãn thân thiện cho từng thư mục gốc trong bucket.
const FOLDER_LABELS: Record<string, string> = {
  uploads: 'Ảnh admin tải lên',
  hero: 'Ảnh hero (trang chủ)',
  'thuc-pham-chuc-nang': 'Thực phẩm chức năng',
  'cham-soc-da': 'Chăm sóc da',
  'thiet-bi-y-te': 'Thiết bị y tế',
  thuoc: 'Thuốc',
}

function folderLabel(folder: string) {
  return FOLDER_LABELS[folder] ?? folder
}

// Đọc thẳng bảng storage.objects (role postgres bypass RLS) để lấy toàn bộ file trong
// bucket ảnh sản phẩm kèm dung lượng. Không phụ thuộc Storage REST API (vốn không liệt
// kê đệ quy tiện lợi).
export async function listStorageObjects(): Promise<StorageObject[]> {
  const rows = (await db.execute(sql`
    select
      name,
      coalesce((metadata->>'size')::bigint, 0)::bigint as size,
      metadata->>'mimetype' as mimetype,
      updated_at
    from storage.objects
    where bucket_id = ${PRODUCT_IMAGE_BUCKET}
      and name is not null
      and name not like '%/.emptyFolderPlaceholder'
    order by updated_at desc nulls last, name
  `)) as unknown as Array<{
    name: string
    size: string | number
    mimetype: string | null
    updated_at: string | Date | null
  }>

  return rows.map((row) => ({
    name: row.name,
    size: Number(row.size) || 0,
    mimeType: row.mimetype,
    updatedAt:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : (row.updated_at ?? null),
    publicUrl: getPublicUrl(row.name),
  }))
}

// Gộp dung lượng theo thư mục gốc (segment đầu của path) để vẽ bar chart.
export function summarizeStorageUsage(objects: StorageObject[]): {
  buckets: StorageUsageBucket[]
  totalBytes: number
  totalFiles: number
} {
  const byFolder = new Map<string, StorageUsageBucket>()

  for (const object of objects) {
    const folder = object.name.split('/')[0] || '(gốc)'
    const current =
      byFolder.get(folder) ??
      { folder, label: folderLabel(folder), fileCount: 0, totalBytes: 0 }
    current.fileCount += 1
    current.totalBytes += object.size
    byFolder.set(folder, current)
  }

  const buckets = [...byFolder.values()].sort((a, b) => b.totalBytes - a.totalBytes)

  return {
    buckets,
    totalBytes: objects.reduce((sum, object) => sum + object.size, 0),
    totalFiles: objects.length,
  }
}
