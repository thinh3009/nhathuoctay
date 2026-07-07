'use client'

import { useMemo, useState } from 'react'
import { formatPrice } from '@/lib/catalog'

type ProductOption = {
  slug: string
  name: string
  categorySlug: string
  price: number
}

type CategoryOption = { slug: string; label: string }

const INPUT_CLASS =
  'w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

// Giá combo mặc định: giảm 85% tổng giá thành viên, làm tròn nghìn (khớp storefront).
function comboPrice(sum: number) {
  return Math.round((sum * 0.85) / 1000) * 1000
}

export default function ComboBuilder({
  action,
  products,
  categories,
}: {
  action: (formData: FormData) => void
  products: ProductOption[]
  categories: CategoryOption[]
}) {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('Tiết kiệm')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  // Giữ thứ tự thêm; lưu slug đã chọn.
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])

  const bySlug = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products])
  const selected = selectedSlugs.map((slug) => bySlug.get(slug)).filter((p): p is ProductOption => Boolean(p))

  const results = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (selectedSlugs.includes(p.slug)) return false
      if (categoryFilter !== 'all' && p.categorySlug !== categoryFilter) return false
      if (q && !p.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [products, search, categoryFilter, selectedSlugs])

  const add = (slug: string) => setSelectedSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]))
  const remove = (slug: string) => setSelectedSlugs((prev) => prev.filter((s) => s !== slug))

  const sum = selected.reduce((a, p) => a + p.price, 0)
  const price = comboPrice(sum)
  const canSubmit = title.trim().length > 0 && selected.length > 0

  const categoryLabel = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-2">
      {/* Cột trái: thông tin combo + kết quả tìm kiếm */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Thông tin combo</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="title">
                Tên combo *
              </label>
              <input
                className={INPUT_CLASS}
                id="title"
                name="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Combo chăm sóc gia đình"
                required
                value={title}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor="tag">
                Nhãn (tag)
              </label>
              <input
                className={INPUT_CLASS}
                id="tag"
                name="tag"
                onChange={(e) => setTag(e.target.value)}
                placeholder="Tiết kiệm"
                value={tag}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Tìm & thêm thuốc</h2>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <input
              className={INPUT_CLASS}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên thuốc…"
              type="search"
              value={search}
            />
            <select
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-56"
              onChange={(e) => setCategoryFilter(e.target.value)}
              value={categoryFilter}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="max-h-96 divide-y divide-stone-100 overflow-y-auto rounded-xl border border-stone-100">
            {results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-stone-400">Không có sản phẩm phù hợp.</p>
            ) : (
              results.map((p) => (
                <div className="flex items-center justify-between gap-3 px-4 py-2.5" key={p.slug}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-800">{p.name}</p>
                    <p className="text-xs text-stone-400">
                      {categoryLabel(p.categorySlug)} · {formatPrice(p.price)}
                    </p>
                  </div>
                  <button
                    aria-label={`Thêm ${p.name} vào combo`}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                    onClick={() => add(p.slug)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Cột phải: các thuốc đã chọn + tổng kết + submit */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-stone-900">Thuốc trong combo</h2>
            <span className="text-sm text-stone-400">{selected.length} sản phẩm</span>
          </div>

          {selected.length === 0 ? (
            <p className="rounded-xl border border-dashed border-stone-200 px-4 py-8 text-center text-sm text-stone-400">
              Chưa có thuốc nào. Bấm nút + ở danh sách bên trái để thêm.
            </p>
          ) : (
            <div className="divide-y divide-stone-100">
              {selected.map((p) => (
                <div className="flex items-center justify-between gap-3 py-2.5" key={p.slug}>
                  {/* Gửi slug đã chọn về server action */}
                  <input name="productSlugs" type="hidden" value={p.slug} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-800">{p.name}</p>
                    <p className="text-xs text-stone-400">{formatPrice(p.price)}</p>
                  </div>
                  <button
                    aria-label={`Bỏ ${p.name} khỏi combo`}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500 transition hover:bg-red-100 hover:text-red-600"
                    onClick={() => remove(p.slug)}
                    type="button"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {selected.length > 0 ? (
            <div className="mt-4 space-y-1.5 border-t border-stone-100 pt-4 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Tổng giá lẻ</span>
                <span className="line-through">{formatPrice(sum)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Giá combo (giảm 15%)</span>
                <span>{formatPrice(price)}</span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!canSubmit}
            type="submit"
          >
            Lưu combo
          </button>
          <a
            className="rounded-xl border border-stone-200 px-6 py-3 font-semibold text-stone-600 transition hover:bg-stone-50"
            href="/admin/combos"
          >
            Hủy
          </a>
        </div>
      </div>
    </form>
  )
}
