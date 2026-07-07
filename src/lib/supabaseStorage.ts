import { randomUUID } from 'node:crypto'
import {
  EXTENSION_BY_MIME,
  MAX_UPLOAD_BYTES,
  PRODUCT_IMAGE_BUCKET,
  UPLOAD_PREFIX,
} from './productImages'

export { MAX_UPLOAD_BYTES }

// Public URL chỉ cần base URL của Supabase — KHÔNG đòi service key,
// để trang chỉ-đọc (/admin/images) không sập khi thiếu SUPABASE_SERVICE_ROLE_KEY.
function getSupabaseUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL (hoặc SUPABASE_URL) chưa được cấu hình.')
  }

  return supabaseUrl
}

// Config đầy đủ cho thao tác ghi/xóa (upload, delete) — cần service role key.
function getStorageConfig() {
  const supabaseUrl = getSupabaseUrl()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY chưa được cấu hình.')
  }

  return { supabaseUrl, serviceRoleKey }
}

export function getPublicUrl(storagePath: string) {
  return `${getSupabaseUrl()}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${storagePath}`
}

export function isValidImageType(mimeType: string) {
  return mimeType in EXTENSION_BY_MIME
}

// Dựng đường dẫn lưu trong bucket: uploads/{productKey}/{uuid}.{ext}
function buildUploadPath(productKey: string, mimeType: string) {
  const ext = EXTENSION_BY_MIME[mimeType] ?? 'jpg'
  const safeKey = productKey.replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'new'
  return `${UPLOAD_PREFIX}/${safeKey}/${randomUUID()}.${ext}`
}

// Đảm bảo bucket ảnh tồn tại (public). Cache kết quả để không gọi lại mỗi lần upload.
let bucketReady = false

async function ensureBucket() {
  if (bucketReady) return
  const { supabaseUrl, serviceRoleKey } = getStorageConfig()
  const authHeaders = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
  }

  const listResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, { headers: authHeaders })
  if (listResponse.ok) {
    const buckets = (await listResponse.json()) as Array<{ id: string }>
    if (buckets.some((bucket) => bucket.id === PRODUCT_IMAGE_BUCKET)) {
      bucketReady = true
      return
    }
  }

  const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...authHeaders, 'content-type': 'application/json' },
    body: JSON.stringify({ id: PRODUCT_IMAGE_BUCKET, name: PRODUCT_IMAGE_BUCKET, public: true }),
  })

  // 409 = bucket đã tồn tại (race) → coi như OK.
  if (!createResponse.ok && createResponse.status !== 409) {
    throw new Error(`Không tạo được bucket: ${createResponse.status} ${await createResponse.text()}`)
  }
  bucketReady = true
}

export type UploadedImage = {
  storagePath: string
  publicUrl: string
}

// Tải một file ảnh lên Supabase Storage, trả về đường dẫn + public URL.
export async function uploadProductImage(
  file: Blob,
  mimeType: string,
  productKey: string,
): Promise<UploadedImage> {
  const { supabaseUrl, serviceRoleKey } = getStorageConfig()
  await ensureBucket()
  const storagePath = buildUploadPath(productKey, mimeType)

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${PRODUCT_IMAGE_BUCKET}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'content-type': mimeType,
        'cache-control': '3600',
      },
      body: file,
    },
  )

  if (!response.ok) {
    throw new Error(`Upload thất bại (${response.status}): ${await response.text()}`)
  }

  return { storagePath, publicUrl: getPublicUrl(storagePath) }
}

// Tải ảnh hero (banner trang chủ) lên bucket, prefix `hero/`. Tách khỏi prefix `uploads/`
// của ảnh sản phẩm để /admin/images không cho xóa nhầm (chỉ xóa qua tab Ảnh hero).
export async function uploadHeroImage(file: Blob, mimeType: string): Promise<UploadedImage> {
  const { supabaseUrl, serviceRoleKey } = getStorageConfig()
  await ensureBucket()
  const ext = EXTENSION_BY_MIME[mimeType] ?? 'jpg'
  const storagePath = `hero/${randomUUID()}.${ext}`

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${PRODUCT_IMAGE_BUCKET}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'content-type': mimeType,
        'cache-control': '3600',
      },
      body: file,
    },
  )

  if (!response.ok) {
    throw new Error(`Upload thất bại (${response.status}): ${await response.text()}`)
  }

  return { storagePath, publicUrl: getPublicUrl(storagePath) }
}

// Xoá một object khỏi Storage. Trả về true nếu thành công (hoặc file vốn không tồn tại).
export async function deleteProductImage(storagePath: string): Promise<boolean> {
  const { supabaseUrl, serviceRoleKey } = getStorageConfig()

  const response = await fetch(
    `${supabaseUrl}/storage/v1/object/${PRODUCT_IMAGE_BUCKET}/${storagePath}`,
    {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  )

  // 200: đã xoá. 404/400: file không còn — coi như đã xoá để idempotent.
  return response.ok || response.status === 404 || response.status === 400
}
