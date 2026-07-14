import { requireAdmin } from '@/lib/auth'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductForEdit, listCategoryOptions } from '@/features/products/queries'
import { updateProduct } from '@/features/products/actions'
import { normalizeProductImages, isUploadedImage } from '@/lib/productImages'
import ProductImageManager from '@/features/products/components/ProductImageManager'
import CategoryPrescriptionFields from '@/features/products/components/CategoryPrescriptionFields'
import type { CategorySlug } from '@/lib/constants'

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()

  const { id } = await params

  const [product, cats] = await Promise.all([getProductForEdit(id), listCategoryOptions()])

  if (!product) notFound()

  const action = updateProduct.bind(null, id)
  // Chỉ prefill ảnh admin đã upload (ảnh demo fallback không đưa vào để tránh xoá nhầm).
  const initialImages = normalizeProductImages(
    product.categorySlug as CategorySlug,
    product.slug,
    product.images,
  ).filter(isUploadedImage)

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link className="text-sm text-stone-500 hover:text-stone-700" href="/admin/products">
          ← Sản phẩm
        </Link>
        <h1 className="text-2xl font-black text-stone-900">Sửa sản phẩm</h1>
      </div>

      <form action={action} className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Thông tin cơ bản</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Tên sản phẩm *</label>
              <input
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                defaultValue={product.name}
                name="name"
                required
                type="text"
              />
            </div>

            <CategoryPrescriptionFields
              cats={cats}
              defaultCategory={product.categorySlug}
              defaultPrescription={product.prescriptionRequired}
            />

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Danh mục phụ</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.subCategory} name="subCategory" type="text" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Badge</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.badge} name="badge" type="text" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Trạng thái</label>
              <select
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                defaultValue={product.isActive ? 'true' : 'false'}
                name="isActive"
              >
                <option value="true">Đang bán</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Giá & Kho</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Giá bán *</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.price} name="price" required type="number" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Giá sale</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.salePrice ?? ''} name="salePrice" type="number" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Tồn kho</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.stockQuantity} name="stockQuantity" type="number" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Mô tả</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Công dụng</label>
              <textarea className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.benefit} name="benefit" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Mô tả ngắn</label>
              <textarea className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.shortDescription} name="shortDescription" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Mô tả chi tiết</label>
              <textarea className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.description} name="description" rows={4} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Cách dùng</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.usage} name="usage" type="text" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Hình ảnh sản phẩm</h2>
          <ProductImageManager initialImages={initialImages} productKey={id} />
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Sản xuất</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Nhà sản xuất</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.manufacturer} name="manufacturer" type="text" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Xuất xứ</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.countryOfOrigin} name="countryOfOrigin" type="text" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Đơn vị</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={product.unit} name="unit" type="text" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800" type="submit">
            Lưu thay đổi
          </button>
          <Link className="rounded-xl border border-stone-200 px-6 py-3 font-semibold text-stone-600 transition hover:bg-stone-50" href="/admin/products">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}
