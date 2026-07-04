import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db/client'
import { products } from '@/db/schema'
import { getAuthUser } from '@/lib/auth'
import { buildUploadedProductImage, isUploadedImage, UPLOAD_PREFIX } from '@/lib/productImages'
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

  if (!storagePath || !storagePath.startsWith(`${UPLOAD_PREFIX}/`)) {
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
async function removeImageFromProducts(storagePath: string) {
  const rows = await db
    .select({ id: products.id, images: products.images })
    .from(products)

  for (const row of rows) {
    const images = (row.images ?? []) as ProductImage[]
    if (!images.some((image) => isUploadedImage(image) && image.storagePath === storagePath)) {
      continue
    }
    const next = images.filter((image) => image.storagePath !== storagePath)
    await db
      .update(products)
      .set({ images: productImageSchema.array().parse(next), updatedAt: new Date() })
      .where(eq(products.id, row.id))
  }
}
