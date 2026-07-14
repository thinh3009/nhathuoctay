import { requireAdmin } from '@/lib/auth'
import { listAdminCategories } from '@/features/categories/queries'
import { createCategory, toggleCategoryActive } from '@/features/categories/actions'

export default async function AdminCategoriesPage() {
  await requireAdmin()

  const cats = await listAdminCategories()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black text-stone-900">Danh mục</h1>
        <p className="mt-1 text-stone-500">{cats.length} danh mục</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* List */}
        <div className="space-y-3">
          {cats.map((cat) => (
            <div
              className={`rounded-2xl border bg-white p-4 ${cat.isActive ? 'border-stone-200' : 'border-stone-200 opacity-70'}`}
              key={cat.slug}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-stone-900">{cat.label}</p>
                  <p className="mt-0.5 font-mono text-xs text-stone-400">{cat.slug}</p>
                  <p className="mt-1 text-sm text-stone-500">{cat.heroDescription}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {cat.isActive ? 'Đang hiện' : 'Đã ẩn'}
                  </span>
                  <form action={toggleCategoryActive.bind(null, cat.slug, !cat.isActive)}>
                    <button
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        cat.isActive
                          ? 'bg-stone-100 text-stone-600 hover:bg-red-100 hover:text-red-700'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800'
                      }`}
                      type="submit"
                    >
                      {cat.isActive ? 'Ẩn danh mục' : 'Hiện lại'}
                    </button>
                  </form>
                </div>
              </div>
              {!cat.isActive ? (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  Khách không xem được danh mục này và mọi sản phẩm thuộc nó (nav, trang chủ, trang danh mục, trang chi tiết).
                </p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Add new */}
        <div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-stone-900">Thêm danh mục mới</h2>
            <form action={createCategory} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">Tên danh mục *</label>
                <input
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  name="label"
                  placeholder="Thực phẩm chức năng"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">Slug (URL) *</label>
                <input
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-mono outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  name="slug"
                  placeholder="thuc-pham-chuc-nang"
                  required
                  type="text"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">Tiêu đề hero</label>
                <input
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  name="heroTitle"
                  placeholder="Giải pháp bổ sung dinh dưỡng"
                  type="text"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-stone-700">Mô tả hero</label>
                <textarea
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  name="heroDescription"
                  placeholder="Danh mục sản phẩm được chọn lọc..."
                  rows={3}
                />
              </div>
              <button
                className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white transition hover:bg-emerald-800"
                type="submit"
              >
                Tạo danh mục
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
