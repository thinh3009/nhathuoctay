import { NextResponse } from 'next/server'
import { eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { products } from '@/db/schema'
import { getAuthUser } from '@/lib/auth'
import { buildUploadedProductImage, isUploadedPath } from '@/lib/productImages'
import {
  deleteProductImage,
  isValidImageType,
  MAX_UPLOAD_BYTES,
  uploadProductImage,
} from '@/lib/supabaseStorage'
import { productImageSchema, type ProductImage } from '@/lib/schemas'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const user = await getAuthUser()
  return user && user.role === 'admin' ? user : null
}

// POST: upload một ảnh sản phẩm lên Supabase Storage, trả về ProductImage.
export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  const productKey = (formData.get('productKey') as string) || 'new'
  const index = Number.parseInt((formData.get('index') as string) || '0', 10)

  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: 'Thiếu file ảnh.' }, { status: 400 })
  }
  if (!isValidImageType(file.type)) {
    return NextResponse.json(
      { error: 'Định dạng ảnh không hợp lệ (chỉ JPG, PNG, WebP, GIF, AVIF).' },
      { status: 400 },
    )
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: `Ảnh vượt quá ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB.` },
      { status: 400 },
    )
  }

  try {
    const { storagePath, publicUrl } = await uploadProductImage(file, file.type, productKey)
    const image = buildUploadedProductImage(storagePath, publicUrl, Number.isNaN(index) ? 0 : index)
    return NextResponse.json({ image })
  } catch (error) {
    console.error('[product-images] upload error', error)
    return NextResponse.json({ error: 'Upload thất bại. Thử lại sau.' }, { status: 500 })
  }
}

// DELETE: xoá ảnh khỏi Storage và gỡ khỏi product.images của mọi sản phẩm tham chiếu.
export async function DELETE(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const storagePath = searchParams.get('path')?.trim()

  if (!storagePath || !isUploadedPath(storagePath)) {
    return NextResponse.json({ error: 'Đường dẫn ảnh không hợp lệ.' }, { status: 400 })
  }

  try {
    await deleteProductImage(storagePath)
    await removeImageFromProducts(storagePath)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[product-images] delete error', error)
    return NextResponse.json({ error: 'Xoá ảnh thất bại. Thử lại sau.' }, { status: 500 })
  }
}

// Gỡ ảnh có storagePath tương ứng khỏi cột images của mọi sản phẩm đang dùng nó.
// Lọc ngay bằng SQL (images::text LIKE) để không quét toàn bộ bảng mỗi lần xóa.
async function removeImageFromProducts(storagePath: string) {
  const rows = await db
    .select({ id: products.id, images: products.images })
    .from(products)
    .where(sql`${products.images}::text like ${`%${storagePath}%`}`)

  for (const row of rows) {
    // safeParse từng phần tử: hàng legacy (string[]/dữ liệu lệch schema) được giữ nguyên
    // thay vì làm crash cả request.
    const rawList = Array.isArray(row.images) ? (row.images as unknown[]) : []
    const next = rawList.filter((raw) => {
      const parsed = productImageSchema.safeParse(raw)
      return !(parsed.success && parsed.data.storagePath === storagePath)
    })

    if (next.length === rawList.length) {
      continue
    }

    await db
      .update(products)
      .set({ images: next as ProductImage[], updatedAt: new Date() })
      .where(eq(products.id, row.id))
  }
}
