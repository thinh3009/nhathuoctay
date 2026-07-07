import Link from 'next/link'
import { revalidatePath, updateTag } from 'next/cache'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/db/client'
import { comboItems, combos, products } from '@/db/schema'
import { STOREFRONT_CACHE_TAG } from '@/db/queries/storefront'
import { requireAdmin } from '@/lib/auth'

async function deleteCombo(formData: FormData) {
  'use server'
  await requireAdmin()
  const id = formData.get('id') as string
  if (!id) return
  // combo_items ON DELETE CASCADE → xóa combo là gỡ luôn thành viên.
  await db.delete(combos).where(eq(combos.id, id))
  revalidatePath('/admin/combos')
  updateTag(STOREFRONT_CACHE_TAG) // section combo trang chủ cập nhật ngay
}

async function getCombos() {
  const comboRows = await db.select().from(combos).orderBy(asc(combos.createdAt))
  if (comboRows.length === 0) return []

  const memberRows = await db
    .select({ comboId: comboItems.comboId, name: products.name })
    .from(comboItems)
    .innerJoin(products, eq(comboItems.productSlug, products.slug))
    .orderBy(asc(comboItems.createdAt))

  return comboRows.map((combo) => ({
    ...combo,
    members: memberRows.filter((m) => m.comboId === combo.id).map((m) => m.name),
  }))
}

export default async function AdminCombosPage() {
  const rows = await getCombos()

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Combo</h1>
          <p className="mt-1 text-stone-500">{rows.length} combo · hiển thị ở section “Combo tiết kiệm” trang chủ</p>
        </div>
        <Link
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
          href="/admin/combos/new"
        >
          + Tạo combo
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
          <p className="text-stone-500">Chưa có combo nào. Trang chủ đang hiển thị combo mẫu.</p>
          <Link
            className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            href="/admin/combos/new"
          >
            Tạo combo đầu tiên
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((combo) => (
            <div className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5" key={combo.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {combo.tag}
                  </span>
                  <h2 className="mt-2 font-bold text-stone-900">{combo.title}</h2>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${combo.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                  {combo.isActive ? 'Hiện' : 'Ẩn'}
                </span>
              </div>

              <ul className="mt-3 flex-1 space-y-1.5">
                {combo.members.map((name, i) => (
                  <li className="flex gap-2 text-sm text-stone-600" key={i}>
                    <span className="text-emerald-600">✓</span>
                    {name}
                  </li>
                ))}
                {combo.members.length === 0 ? (
                  <li className="text-sm text-amber-600">Chưa có sản phẩm còn bán trong combo.</li>
                ) : null}
              </ul>

              <form action={deleteCombo} className="mt-4 border-t border-stone-100 pt-3">
                <input name="id" type="hidden" value={combo.id} />
                <button
                  className="text-sm font-semibold text-red-500 transition hover:text-red-700"
                  type="submit"
                >
                  Xóa combo
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
