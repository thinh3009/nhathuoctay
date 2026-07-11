import { NextResponse } from 'next/server'
import { updateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { siteImages } from '@/db/schema'
import { STOREFRONT_CACHE_TAG } from '@/features/storefront/queries'
import { SITE_IMAGES_CACHE_TAG } from '@/features/siteImages/queries'
import { SITE_IMAGE_SLOTS, type SiteImageSlot } from '@/features/siteImages/types'
import { getAuthUser } from '@/lib/auth'
import { deleteProductImage, isValidImageType, MAX_UPLOAD_BYTES, uploadSiteImage } from '@/lib/supabaseStorage'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const user = await getAuthUser()
  return user && user.role === 'admin' ? user : null
}

function isSlot(value: unknown): value is SiteImageSlot {
  return typeof value === 'string' && (SITE_IMAGE_SLOTS as readonly string[]).includes(value)
}

// POST: upload/đổi ảnh cho một slot ('hero' | 'cta' | 'logo').
export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const formData = await request.formData()
  const slot = formData.get('slot')
  const file = formData.get('file')

  if (!isSlot(slot)) {
    return NextResponse.json({ error: 'Vị trí ảnh không hợp lệ.' }, { status: 400 })
  }
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: 'Thiếu file ảnh.' }, { status: 400 })
  }
  if (!isValidImageType(file.type)) {
    return NextResponse.json({ error: 'Định dạng ảnh không hợp lệ (chỉ JPG, PNG, WebP, GIF, AVIF).' }, { status: 400 })
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: `Ảnh vượt quá ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)}MB.` }, { status: 400 })
  }

  try {
    const [existing] = await db.select().from(siteImages).where(eq(siteImages.slot, slot)).limit(1)
    const { storagePath, publicUrl } = await uploadSiteImage(file, file.type, slot)

    await db
      .insert(siteImages)
      .values({ slot, storagePath, url: publicUrl })
      .onConflictDoUpdate({ target: siteImages.slot, set: { storagePath, url: publicUrl, updatedAt: new Date() } })

    // Xóa file cũ (best-effort) sau khi cập nhật bản ghi thành công.
    if (existing?.storagePath && existing.storagePath !== storagePath) {
      await deleteProductImage(existing.storagePath).catch(() => {})
    }

    updateTag(STOREFRONT_CACHE_TAG)
    updateTag(SITE_IMAGES_CACHE_TAG)
    return NextResponse.json({ slot, url: publicUrl })
  } catch (error) {
    console.error('[site-images] upload error', error)
    return NextResponse.json({ error: 'Upload thất bại. Thử lại sau.' }, { status: 500 })
  }
}

// DELETE ?slot= : gỡ ảnh tùy biến, quay về mặc định.
export async function DELETE(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const slot = new URL(request.url).searchParams.get('slot')
  if (!isSlot(slot)) {
    return NextResponse.json({ error: 'Vị trí ảnh không hợp lệ.' }, { status: 400 })
  }

  try {
    const [row] = await db.select().from(siteImages).where(eq(siteImages.slot, slot)).limit(1)
    if (row) {
      await deleteProductImage(row.storagePath).catch(() => {})
      await db.delete(siteImages).where(eq(siteImages.slot, slot))
    }
    updateTag(STOREFRONT_CACHE_TAG)
    updateTag(SITE_IMAGES_CACHE_TAG)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[site-images] delete error', error)
    return NextResponse.json({ error: 'Gỡ ảnh thất bại. Thử lại sau.' }, { status: 500 })
  }
}
