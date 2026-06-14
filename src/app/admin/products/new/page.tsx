import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db/client'
import { products, categories } from '@/db/schema'
import { revalidatePath } from 'next/cache'

async function getCategories() {
  return db.select({ slug: categories.slug, label: categories.label }).from(categories)
}

async function createProduct(formData: FormData) {
  'use server'

  const name = formData.get('name') as string
  const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const categorySlug = formData.get('categorySlug') as string
  const price = parseInt(formData.get('price') as string, 10)
  const salePriceRaw = formData.get('salePrice') as string
  const salePrice = salePriceRaw ? parseInt(salePriceRaw, 10) : null

  await db.insert(products).values({
    slug: `${slug}-${Date.now()}`,
    categorySlug,
    name,
    subCategory: formData.get('subCategory') as string || name,
    benefit: formData.get('benefit') as string || '',
    description: formData.get('description') as string || '',
    shortDescription: formData.get('shortDescription') as string || '',
    price,
    salePrice,
    badge: formData.get('badge') as string || 'Mới',
    ingredients: [],
    usage: formData.get('usage') as string || '',
    unit: formData.get('unit') as string || 'hộp',
    defaultQuantity: 1,
    sku: formData.get('sku') as string || `SKU-${Date.now()}`,
    rating: 5.0,
    reviewCount: 0,
    commentCount: 0,
    officialName: name,
    registrationNumber: '',
    form: '',
    specification: '',
    manufacturer: formData.get('manufacturer') as string || '',
    countryOfOrigin: formData.get('countryOfOrigin') as string || 'Việt Nam',
    shelfLife: '',
    ingredientHighlight: '',
    images: [],
    isActive: true,
    stockQuantity: parseInt(formData.get('stockQuantity') as string || '0', 10),
  })

  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export default async function AdminNewProductPage() {
  const cats = await getCategories()

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

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Danh mục *</label>
              <select
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                name="categorySlug"
                required
              >
                {cats.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
            </div>

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
