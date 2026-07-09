import Link from 'next/link'
import { listCategoryOptions } from '@/features/products/queries'
import { createProduct } from '@/features/products/actions'
import ProductImageManager from '@/features/products/components/ProductImageManager'
import CategoryPrescriptionFields from '@/features/products/components/CategoryPrescriptionFields'

export default async function AdminNewProductPage() {
  const cats = await listCategoryOptions()

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link className="text-sm text-stone-500 hover:text-stone-700" href="/admin/products">
          ← Sản phẩm
        </Link>
        <h1 className="text-2xl font-black text-stone-900">Thêm sản phẩm mới</h1>
      </div>

      <form action={createProduct} className="mx-auto max-w-2xl space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Thông tin cơ bản</h2>
          <div className="grid gap-4">
            <Field label="Tên sản phẩm *" name="name" placeholder="Vitamin C 1000mg" required />
            <Field label="SKU" name="sku" placeholder="VIT-C-1000" />

            <CategoryPrescriptionFields cats={cats} />

            <Field label="Danh mục phụ" name="subCategory" placeholder="Vitamin & Khoáng chất" />
            <Field label="Badge" name="badge" placeholder="Bán chạy" />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Giá & Kho</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Giá bán (VNĐ) *" name="price" placeholder="150000" required type="number" />
            <Field label="Giá sale (VNĐ)" name="salePrice" placeholder="120000" type="number" />
            <Field label="Tồn kho" name="stockQuantity" placeholder="100" type="number" />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Mô tả</h2>
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Mô tả ngắn</label>
              <textarea
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                name="shortDescription"
                placeholder="Bổ sung vitamin C cho cơ thể..."
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Công dụng</label>
              <textarea
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                name="benefit"
                placeholder="Tăng cường sức đề kháng..."
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Mô tả chi tiết</label>
              <textarea
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                name="description"
                placeholder="Mô tả đầy đủ về sản phẩm..."
                rows={4}
              />
            </div>
            <Field label="Cách dùng" name="usage" placeholder="Uống 1 viên/ngày sau bữa ăn" />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Hình ảnh sản phẩm</h2>
          <ProductImageManager productKey="new" />
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-bold text-stone-900">Thông tin sản xuất</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nhà sản xuất" name="manufacturer" placeholder="Công ty TNHH..." />
            <Field label="Xuất xứ" name="countryOfOrigin" placeholder="Việt Nam" />
            <Field label="Đơn vị" name="unit" placeholder="hộp / chai / vỉ" />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="rounded-xl bg-emerald-700 px-6 py-3 font-bold text-white transition hover:bg-emerald-800"
            type="submit"
          >
            Tạo sản phẩm
          </button>
          <Link
            className="rounded-xl border border-stone-200 px-6 py-3 font-semibold text-stone-600 transition hover:bg-stone-50"
            href="/admin/products"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = 'text',
}: {
  label: string
  name: string
  placeholder?: string
  required?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-stone-700" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </div>
  )
}
