import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'
import StoreFooter from '../components/StoreFooter'
import StoreHeader from '../components/StoreHeader'
import {
  categoryNavItems,
  commitments,
  formatPrice,
  getCategoryBySlug,
  products,
} from '../data/products'

const PRODUCTS_PER_PAGE = 20

const priceRanges = [
  { value: 'all', label: 'Tất cả mức giá' },
  { value: 'under-200', label: 'Dưới 200.000đ' },
  { value: '200-400', label: 'Từ 200.000đ đến 400.000đ' },
  { value: 'over-400', label: 'Trên 400.000đ' },
]

type HomePageProps = {
  cartCount: number
  onAddToCart: (slug: string, quantity?: number) => void
}

function HomePage({ cartCount, onAddToCart }: HomePageProps) {
  const { categorySlug } = useParams()
  const currentCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined
  const [selectedSubCategory, setSelectedSubCategory] = useState('Tất cả')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [currentPage, setCurrentPage] = useState(1)

  const categoryProducts = useMemo(() => {
    if (!currentCategory) {
      return []
    }

    return products.filter((product) => product.topCategorySlug === currentCategory.slug)
  }, [currentCategory])

  const subCategories = useMemo(
    () => ['Tất cả', ...new Set(categoryProducts.map((product) => product.subCategory))],
    [categoryProducts],
  )

  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        if (selectedSubCategory !== 'Tất cả' && product.subCategory !== selectedSubCategory) {
          return false
        }

        if (selectedPriceRange === 'under-200') {
          return product.price < 200000
        }

        if (selectedPriceRange === '200-400') {
          return product.price >= 200000 && product.price <= 400000
        }

        if (selectedPriceRange === 'over-400') {
          return product.price > 400000
        }

        return true
      })
      .sort((left, right) => {
        if (sortBy === 'price-asc') {
          return left.price - right.price
        }

        if (sortBy === 'price-desc') {
          return right.price - left.price
        }

        if (sortBy === 'name-asc') {
          return left.name.localeCompare(right.name)
        }

        if (sortBy === 'rating-desc') {
          return right.rating - left.rating
        }

        return 0
      })
  }, [categoryProducts, selectedPriceRange, selectedSubCategory, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)
  const suggestedProducts = categoryProducts
    .filter((product) => !visibleProducts.some((item) => item.slug === product.slug))
    .slice(0, 4)

  useEffect(() => {
    setSelectedSubCategory('Tất cả')
    setSelectedPriceRange('all')
    setSortBy('featured')
    setCurrentPage(1)
  }, [categorySlug])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSubCategory, selectedPriceRange, sortBy])

  if (!currentCategory) {
    return <Navigate replace to={`/category/${categoryNavItems[0].slug}`} />
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StoreHeader activeCategorySlug={currentCategory.slug} cartCount={cartCount} />

        <section className="mt-6 overflow-hidden rounded-lg bg-slate-950 text-white shadow-sm">
          <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                {currentCategory.label}
              </p>
              <h2 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
                {currentCategory.heroTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                {currentCategory.heroDescription}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-cyan-300">Danh mục hiện có</p>
              <div className="mt-4 grid gap-2">
                {categoryNavItems.map((item) => (
                  <Link
                    className={`rounded-lg px-4 py-3 text-sm font-medium ${
                      item.slug === currentCategory.slug
                        ? 'bg-cyan-700 text-white'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                    key={item.slug}
                    to={`/category/${item.slug}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-950">Bộ lọc</h3>
              <button
                className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
                onClick={() => {
                  setSelectedSubCategory('Tất cả')
                  setSelectedPriceRange('all')
                  setSortBy('featured')
                }}
                type="button"
              >
                Đặt lại
              </button>
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-800">Nhóm sản phẩm</p>
              <div className="mt-3 space-y-2">
                {subCategories.map((subCategory) => (
                  <label className="flex items-center gap-2 text-sm text-slate-700" key={subCategory}>
                    <input
                      checked={selectedSubCategory === subCategory}
                      className="h-4 w-4 border-slate-300 text-cyan-700"
                      name="sub-category"
                      onChange={() => setSelectedSubCategory(subCategory)}
                      type="radio"
                    />
                    {subCategory}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800">Mức giá</p>
              <div className="mt-3 space-y-2">
                {priceRanges.map((range) => (
                  <label className="flex items-center gap-2 text-sm text-slate-700" key={range.value}>
                    <input
                      checked={selectedPriceRange === range.value}
                      className="h-4 w-4 border-slate-300 text-cyan-700"
                      name="price"
                      onChange={() => setSelectedPriceRange(range.value)}
                      type="radio"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-cyan-100 bg-cyan-50 p-4">
              <h4 className="text-sm font-bold text-slate-950">Cam kết cửa hàng</h4>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-700">
                {commitments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                  {currentCategory.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-950">
                  Hiển thị tối đa 20 sản phẩm mỗi trang
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Đang hiển thị {visibleProducts.length} / {filteredProducts.length} sản phẩm
                </p>
              </div>

              <select
                className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm"
                onChange={(event) => setSortBy(event.target.value)}
                value={sortBy}
              >
                <option value="featured">Sắp xếp: Nổi bật</option>
                <option value="price-asc">Giá từ thấp đến cao</option>
                <option value="price-desc">Giá từ cao đến thấp</option>
                <option value="name-asc">Tên A-Z</option>
                <option value="rating-desc">Đánh giá cao</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-600 sm:col-span-2 xl:col-span-3">
                  Không có sản phẩm phù hợp với bộ lọc hiện tại.
                </div>
              ) : (
                visibleProducts.map((product) => (
                  <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" key={product.slug}>
                    <ProductVisual imageLabel={product.images[0]} product={product} />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                        {product.badge}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{product.rating.toFixed(1)} / 5</span>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      {product.subCategory}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-950">{product.name}</h4>
                    <p className="mt-2 min-h-10 text-sm leading-5 text-slate-600">{product.benefit}</p>
                    <p className="mt-4 text-xl font-bold text-cyan-700">{formatPrice(product.price)}</p>
                    <div className="mt-4 grid gap-2">
                      <Link
                        className="block rounded-lg bg-cyan-700 px-4 py-2 text-center font-medium text-white hover:bg-cyan-800"
                        to={`/product/${product.slug}`}
                      >
                        Xem chi tiết
                      </Link>
                      <button
                        className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:border-cyan-700 hover:text-cyan-700"
                        onClick={() => onAddToCart(product.slug, 1)}
                        type="button"
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-medium ${
                    currentPage === page
                      ? 'border-cyan-700 bg-cyan-700 text-white'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}

              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                Sau
              </button>
            </div>
          </section>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6">
            <h3 className="text-base font-bold text-slate-950">Gợi ý trong danh mục</h3>
            <div className="mt-4 space-y-3">
              {suggestedProducts.map((product) => (
                <Link
                  className="block rounded-lg border border-slate-200 p-3 hover:border-cyan-500 hover:bg-cyan-50"
                  key={product.slug}
                  to={`/product/${product.slug}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{product.benefit}</p>
                    </div>
                    <p className="shrink-0 text-sm font-bold text-cyan-700">
                      {formatPrice(product.price)}
                    </p>
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

export default HomePage
