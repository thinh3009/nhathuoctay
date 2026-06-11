import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listProducts } from '@/db/queries/catalog'
import CategoryFilters from '@/components/CategoryFilters'
import PaginationControls from '@/components/PaginationControls'
import ProductCard from '@/components/ProductCard'
import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { commitments, formatPrice } from '@/lib/catalog'
import { getServerCartCount } from '@/lib/cart'

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = await params
  const rawSearchParams = await searchParams
  const cartCount = await getServerCartCount()
  const result = await listProducts({
    category: categorySlug,
    subCategory: firstParam(rawSearchParams.subCategory),
    priceRange: firstParam(rawSearchParams.priceRange),
    sort: firstParam(rawSearchParams.sort),
    page: firstParam(rawSearchParams.page),
  })

  if (!result) {
    notFound()
  }

  const query = {
    subCategory:
      result.selected.subCategory && result.selected.subCategory !== 'Tất cả'
        ? result.selected.subCategory
        : undefined,
    priceRange: result.selected.priceRange !== 'all' ? result.selected.priceRange : undefined,
    sort: result.selected.sort !== 'featured' ? result.selected.sort : undefined,
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StoreHeader activeCategorySlug={result.category.slug} cartCount={cartCount} />

        <section className="mt-6 overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                {result.category.label}
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                {result.category.heroTitle}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                {result.category.heroDescription}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-cyan-300">Danh mục hiện có</p>
              <div className="mt-4 grid gap-2">
                {CATEGORY_CONFIG.map((item) => (
                  <Link
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                      item.slug === result.category.slug
                        ? 'bg-cyan-700 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                    href={`/category/${item.slug}`}
                    key={item.slug}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="hidden h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:block">
            <h2 className="text-base font-bold text-slate-950">Bộ lọc</h2>
            <CategoryFilters
              selectedPriceRange={result.selected.priceRange}
              selectedSort={result.selected.sort}
              selectedSubCategory={result.selected.subCategory}
              subCategories={result.filters.subCategories}
              variant="desktop"
            />

            <div className="mt-6 rounded-lg border border-cyan-100 bg-cyan-50 p-4">
              <h3 className="text-sm font-bold text-slate-950">Cam kết cửa hàng</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
                {commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                {result.category.label}
              </p>
              <h2 className="text-2xl font-bold text-slate-950">Hiển thị tối đa 20 sản phẩm mỗi trang</h2>
              <p className="mt-1 text-sm text-slate-600">
                Đang hiển thị {result.items.length} / {result.pagination.total} sản phẩm
              </p>
            </div>

            <div className="mb-4 lg:hidden">
              <CategoryFilters
                selectedPriceRange={result.selected.priceRange}
                selectedSort={result.selected.sort}
                selectedSubCategory={result.selected.subCategory}
                subCategories={result.filters.subCategories}
                variant="mobile"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-600 sm:col-span-2 xl:col-span-3">
                  Không có sản phẩm phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                result.items.map((product) => <ProductCard key={product.slug} product={product} />)
              )}
            </div>

            <PaginationControls
              basePath={`/category/${result.category.slug}`}
              page={result.pagination.page}
              query={query}
              totalPages={result.pagination.totalPages}
            />
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-slate-950">Gợi ý trong danh mục</h2>
            <div className="mt-4 space-y-3">
              {result.suggestedProducts.map((product) => (
                <Link
                  className="block rounded-lg border border-slate-200 p-3 hover:border-cyan-500 hover:bg-cyan-50"
                  href={`/product/${product.slug}`}
                  key={product.slug}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{product.benefit}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-cyan-700">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <StoreFooter />
      </div>
    </main>
  )
}
