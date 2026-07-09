import { NextResponse } from 'next/server'
import { updateTag } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { heroImages } from '@/db/schema'
import { STOREFRONT_CACHE_TAG } from '@/features/storefront/queries'
import { getAuthUser } from '@/lib/auth'
import {
  deleteProductImage,
  isValidImageType,
  MAX_UPLOAD_BYTES,
  uploadHeroImage,
} from '@/lib/supabaseStorage'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const user = await getAuthUser()
  return user && user.role === 'admin' ? user : null
}

// POST: upload một ảnh hero, thêm vào cuối danh sách.
export async function POST(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

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
    const { storagePath, publicUrl } = await uploadHeroImage(file, file.type)
    const existing = await db.select({ id: heroImages.id }).from(heroImages)
    const [row] = await db
      .insert(heroImages)
      .values({ storagePath, url: publicUrl, sortOrder: existing.length })
      .returning()
    updateTag(STOREFRONT_CACHE_TAG)
    return NextResponse.json({ image: row })
  } catch (error) {
    console.error('[hero-images] upload error', error)
    return NextResponse.json({ error: 'Upload thất bại. Thử lại sau.' }, { status: 500 })
  }
}

// DELETE ?id= : xóa ảnh hero (file Storage + bản ghi).
export async function DELETE(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const id = new URL(request.url).searchParams.get('id')?.trim()
  if (!id) {
    return NextResponse.json({ error: 'Thiếu id ảnh.' }, { status: 400 })
  }

  try {
    const [row] = await db.select().from(heroImages).where(eq(heroImages.id, id)).limit(1)
    if (!row) {
      return NextResponse.json({ error: 'Không tìm thấy ảnh.' }, { status: 404 })
    }
    await deleteProductImage(row.storagePath)
    await db.delete(heroImages).where(eq(heroImages.id, id))
    updateTag(STOREFRONT_CACHE_TAG)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[hero-images] delete error', error)
    return NextResponse.json({ error: 'Xóa ảnh thất bại. Thử lại sau.' }, { status: 500 })
  }
}

// PATCH { id, direction: 'up'|'down' } : đổi thứ tự hiển thị (re-sequence toàn bộ).
export async function PATCH(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 })
  }

  const body = (await request.json().catch(() => null)) as { id?: string; direction?: string } | null
  const id = body?.id?.trim()
  const direction = body?.direction
  if (!id || (direction !== 'up' && direction !== 'down')) {
    return NextResponse.json({ error: 'Tham số không hợp lệ.' }, { status: 400 })
  }

  try {
    const rows = await db
      .select({ id: heroImages.id })
      .from(heroImages)
      .orderBy(asc(heroImages.sortOrder), asc(heroImages.createdAt))

    const index = rows.findIndex((row) => row.id === id)
    if (index === -1) {
      return NextResponse.json({ error: 'Không tìm thấy ảnh.' }, { status: 404 })
    }
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= rows.length) {
      return NextResponse.json({ ok: true }) // đã ở đầu/cuối — không đổi
    }

    // Hoán vị vị trí rồi ghi lại sort_order tuần tự cho toàn bộ (bền vững kể cả khi trùng).
    const ordered = rows.map((row) => row.id)
    ;[ordered[index], ordered[target]] = [ordered[target], ordered[index]]
    await Promise.all(
      ordered.map((rowId, order) =>
        db.update(heroImages).set({ sortOrder: order }).where(eq(heroImages.id, rowId)),
      ),
    )
    updateTag(STOREFRONT_CACHE_TAG)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[hero-images] reorder error', error)
    return NextResponse.json({ error: 'Đổi thứ tự thất bại. Thử lại sau.' }, { status: 500 })
  }
}
