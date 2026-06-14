import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { listProducts } from '@/db/queries/catalog'
import CategoryFilters from '@/components/CategoryFilters'
import PaginationControls from '@/components/PaginationControls'
import ProductCard from '@/components/ProductCard'
import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { CATEGORY_CONFIG } from '@/lib/constants'
import { commitments } from '@/lib/catalog'
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
    <main className="min-h-screen bg-[#f6fbf4] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StoreHeader activeCategorySlug={result.category.slug} cartCount={cartCount} />

        <section className="mt-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/70">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
                <Link className="font-medium text-emerald-700 hover:text-emerald-800" href="/">
                  Trang chủ
                </Link>
                <span>/</span>
                <span>{result.category.label}</span>
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Danh mục sản phẩm
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
                {result.category.label}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                {result.category.heroDescription}
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-stone-700">
              <p className="font-semibold text-stone-900">{result.pagination.total} sản phẩm</p>
              <p className="mt-1">Hiển thị tối đa 20 sản phẩm mỗi trang để danh sách dễ xem hơn.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORY_CONFIG.map((item) => (
              <Link
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  item.slug === result.category.slug
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
                href={`/category/${item.slug}`}
                key={item.slug}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="hidden h-fit rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-100/60 lg:sticky lg:top-6 lg:block">
            <h2 className="text-base font-bold text-stone-900">Bộ lọc</h2>
            <Suspense>
              <CategoryFilters
                selectedPriceRange={result.selected.priceRange}
                selectedSort={result.selected.sort}
                selectedSubCategory={result.selected.subCategory}
                subCategories={result.filters.subCategories}
                variant="desktop"
              />
            </Suspense>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <h3 className="text-sm font-bold text-stone-900">Cam kết cửa hàng</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-stone-700">
                {commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section>
            <div className="mb-4 rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-sm shadow-emerald-100/60">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                {result.category.label}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-stone-900">Danh sách sản phẩm</h2>
              <p className="mt-1 text-sm text-stone-600">
                Đang hiển thị {result.items.length} / {result.pagination.total} sản phẩm
              </p>
            </div>

            <div className="mb-4 lg:hidden">
              <Suspense>
                <CategoryFilters
                  selectedPriceRange={result.selected.priceRange}
                  selectedSort={result.selected.sort}
                  selectedSubCategory={result.selected.subCategory}
                  subCategories={result.filters.subCategories}
                  variant="mobile"
                />
              </Suspense>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center text-stone-600 sm:col-span-2 xl:col-span-3">
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

          <aside className="h-fit rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm shadow-emerald-100/60 lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-stone-900">Gợi ý trong danh mục</h2>
            <p className="mt-1 text-sm text-stone-500">Một vài lựa chọn nhanh để đi tiếp vào trang chi tiết.</p>
            <div className="mt-4 space-y-3">
              {result.suggestedProducts.map((product) => (
                <Link
                  className="block rounded-xl border border-stone-200 p-3 transition hover:border-emerald-500 hover:bg-emerald-50"
                  href={`/product/${product.slug}`}
                  key={product.slug}
                >
                  <p className="text-sm font-semibold text-stone-900">{product.name}</p>
                  <p className="mt-1 text-xs leading-5 text-stone-600">{product.benefit}</p>
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
