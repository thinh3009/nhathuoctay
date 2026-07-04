import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db/client'
import { products, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { buildExternalProductImages, getExternalImageUrls } from '@/lib/productImages'

async function updateProduct(id: string, formData: FormData) {
  'use server'
  await requireAdmin()

  const categorySlug = formData.get('categorySlug') as string

  // Cập nhật ảnh: dán URL mới, để trống hết → quay lại ảnh mặc định theo danh mục.
  const images = buildExternalProductImages([
    formData.get('imageUrl1') as string,
    formData.get('imageUrl2') as string,
    formData.get('imageUrl3') as string,
  ])

  await db.update(products).set({
    name: formData.get('name') as string,
    categorySlug,
    subCategory: formData.get('subCategory') as string,
    benefit: formData.get('benefit') as string,
    shortDescription: formData.get('shortDescription') as string,
    description: formData.get('description') as string,
    price: parseInt(formData.get('price') as string, 10),
    salePrice: (formData.get('salePrice') as string) ? parseInt(formData.get('salePrice') as string, 10) : null,
    badge: formData.get('badge') as string,
    usage: formData.get('usage') as string,
    unit: formData.get('unit') as string,
    manufacturer: formData.get('manufacturer') as string,
    countryOfOrigin: formData.get('countryOfOrigin') as string,
    stockQuantity: parseInt(formData.get('stockQuantity') as string || '0', 10),
    isActive: formData.get('isActive') === 'true',
    images,
    updatedAt: new Date(),
  }).where(eq(products.id, id))

  revalidatePath('/admin/products')
  revalidatePath('/') // trang chủ (ISR) cập nhật ngay
  revalidatePath(`/category/${categorySlug}`)
  redirect('/admin/products')
}

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [product, cats] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)).limit(1).then((r) => r[0]),
    db.select({ slug: categories.slug, label: categories.label }).from(categories),
  ])

  if (!product) notFound()

  const action = updateProduct.bind(null, id)
  const [imageUrl1, imageUrl2, imageUrl3] = getExternalImageUrls(product.images)

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

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Danh mục *</label>
              <select
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                defaultValue={product.categorySlug}
                name="categorySlug"
                required
              >
                {cats.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.label}</option>
                ))}
              </select>
            </div>

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
          <h2 className="mb-1 font-bold text-stone-900">Hình ảnh sản phẩm</h2>
          <p className="mb-4 text-sm text-stone-500">
            Dán tối đa 3 đường link ảnh (https). Ảnh đầu tiên là ảnh chính. Để trống hết sẽ dùng ảnh mặc định theo danh mục.
          </p>
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Ảnh 1 (ảnh chính)</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={imageUrl1} name="imageUrl1" placeholder="https://.../anh-chinh.jpg" type="url" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Ảnh 2</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={imageUrl2} name="imageUrl2" placeholder="https://.../anh-2.jpg" type="url" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-stone-700">Ảnh 3</label>
              <input className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" defaultValue={imageUrl3} name="imageUrl3" placeholder="https://.../anh-3.jpg" type="url" />
            </div>
          </div>
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
