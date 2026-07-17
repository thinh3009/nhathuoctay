import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, listProducts } from '@/features/products/queries'
import CategoryFilters from '@/features/products/components/CategoryFilters'
import PaginationControls from '@/components/ui/PaginationControls'
import ProductCard from '@/features/products/components/ProductCard'
import SiteFooter from '@/components/layout/SiteFooter'
import SiteHeader from '@/components/layout/SiteHeader'
import { commitments } from '@/lib/catalog'
import { getServerCartCount } from '@/lib/cart'

// Render theo từng request (không prerender lúc build) để build không cần DB.
export const dynamic = 'force-dynamic'

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string
  }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

// Title/description/canonical riêng cho từng danh mục. Điểm mấu chốt: canonical GOM mọi biến
// thể lọc/sắp xếp (?subCategory/priceRange/sort) về URL sạch để không sinh trang trùng lặp;
// chỉ GIỮ ?page vì mỗi trang phân trang là nội dung khác nhau, cần index riêng.
export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    return { title: 'Không tìm thấy danh mục' }
  }

  const rawPage = firstParam((await searchParams).page)
  const pageNum = Math.max(1, Number.parseInt(rawPage ?? '1', 10) || 1)
  const canonical =
    pageNum > 1 ? `/category/${category.slug}?page=${pageNum}` : `/category/${category.slug}`

  return {
    title: pageNum > 1 ? `${category.label} — Trang ${pageNum}` : category.label,
    description: category.heroDescription,
    alternates: { canonical },
  }
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
    <div className="flex min-h-screen flex-col bg-[var(--color-bg-page)] text-stone-900">
      <SiteHeader activeCategorySlug={result.category.slug} cartCount={cartCount} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-100/70">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
                <Link className="font-medium text-brand-700 hover:text-brand-800" href="/">
                  Trang chủ
                </Link>
                <span>/</span>
                <span>{result.category.label}</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-stone-900 sm:text-4xl">
                {result.category.label}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600">
                {result.category.heroDescription}
              </p>
            </div>

            <div className="rounded-2xl bg-brand-50 px-5 py-4 text-sm text-stone-700">
              <p className="font-semibold text-stone-900">{result.pagination.total} sản phẩm</p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="hidden h-fit rounded-2xl border border-brand-100 bg-white p-4 shadow-sm shadow-brand-100/60 lg:sticky lg:top-6 lg:block">
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

            <div className="mt-6 rounded-2xl border border-brand-100 bg-brand-50 p-4">
              <h3 className="text-sm font-bold text-stone-900">Cam kết cửa hàng</h3>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-stone-700">
                {commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section>
            <div className="mb-4 rounded-2xl border border-brand-100 bg-white px-5 py-4 shadow-sm shadow-brand-100/60">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
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

          <aside className="h-fit rounded-2xl border border-brand-100 bg-white p-4 shadow-sm shadow-brand-100/60 lg:sticky lg:top-6">
            <h2 className="text-base font-bold text-stone-900">Gợi ý trong danh mục</h2>
            <p className="mt-1 text-sm text-stone-500">Một vài lựa chọn nhanh để đi tiếp vào trang chi tiết.</p>
            <div className="mt-4 space-y-3">
              {result.suggestedProducts.map((product) => (
                <Link
                  className="block rounded-xl border border-stone-200 p-3 transition hover:border-brand-500 hover:bg-brand-50"
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
      </main>

      <SiteFooter />
    </div>
  )
}
