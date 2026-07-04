import Link from 'next/link'
import { db } from '@/db/client'
import { products, categories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { formatPrice } from '@/lib/catalog'

export default async function AdminProductsPage() {
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      price: products.price,
      salePrice: products.salePrice,
      badge: products.badge,
      sku: products.sku,
      isActive: products.isActive,
      categorySlug: products.categorySlug,
      categoryLabel: categories.label,
      rating: products.rating,
      reviewCount: products.reviewCount,
    })
    .from(products)
    .leftJoin(categories, eq(products.categorySlug, categories.slug))
    .orderBy(products.name)
    .limit(200)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Sản phẩm</h1>
          <p className="mt-1 text-stone-500">{rows.length} sản phẩm</p>
        </div>
        <Link
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
          href="/admin/products/new"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50 text-left">
                <th className="px-4 py-3 font-semibold text-stone-600">Tên sản phẩm</th>
                <th className="px-4 py-3 font-semibold text-stone-600">SKU</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Danh mục</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Giá</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Đánh giá</th>
                <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                <th className="px-4 py-3 font-semibold text-stone-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((product) => (
                <tr className="hover:bg-stone-50" key={product.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-stone-900">{product.name}</p>
                    <p className="text-xs text-stone-400">{product.badge}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-500">{product.sku}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      {product.categoryLabel ?? product.categorySlug}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-stone-900">{formatPrice(product.price)}</span>
                    {product.salePrice && (
                      <span className="ml-2 text-xs text-emerald-600">Sale: {formatPrice(product.salePrice)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    ⭐ {product.rating.toFixed(1)} ({product.reviewCount})
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-500'}`}>
                      {product.isActive ? 'Đang bán' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-emerald-100 hover:text-emerald-700"
                      href={`/admin/products/${product.id}/edit`}
                    >
                      Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
