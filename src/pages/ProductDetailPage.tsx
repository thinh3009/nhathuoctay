import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual'
import RelatedProductsSection from '../components/RelatedProductsSection'
import ReviewSection from '../components/ReviewSection'
import StoreFooter from '../components/StoreFooter'
import StoreHeader from '../components/StoreHeader'
import {
  defaultCategorySlug,
  formatPrice,
  getProductBySlug,
  products,
} from '../data/products'

type ProductDetailPageProps = {
  cartCount: number
  onAddToCart: (slug: string, quantity?: number) => void
}

function ProductDetailPage({ cartCount, onAddToCart }: ProductDetailPageProps) {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const relatedProducts = useMemo(() => {
    if (!product) {
      return []
    }

    return products
      .filter((item) => item.slug !== product.slug && item.topCategorySlug === product.topCategorySlug)
      .sort((left, right) => {
        const leftScore = left.subCategory === product.subCategory ? 0 : 1
        const rightScore = right.subCategory === product.subCategory ? 0 : 1

        if (leftScore !== rightScore) {
          return leftScore - rightScore
        }

        return right.rating - left.rating
      })
      .slice(0, 4)
  }, [product])

  useEffect(() => {
    setSelectedImageIndex(0)
    setQuantity(1)
  }, [product?.slug])

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <StoreHeader cartCount={cartCount} />
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">Không tìm thấy sản phẩm</h1>
            <p className="mt-3 text-slate-600">
              Sản phẩm có thể đã bị gỡ bỏ hoặc đường dẫn không chính xác.
            </p>
            <Link
              className="mt-6 inline-block rounded-lg bg-cyan-700 px-4 py-2 font-medium text-white hover:bg-cyan-800"
              to={`/category/${defaultCategorySlug}`}
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <StoreHeader activeCategorySlug={product.topCategorySlug} cartCount={cartCount} />

        <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <Link
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
            to={`/category/${product.topCategorySlug}`}
          >
            &lt;- Quay lại {product.topCategory.toLowerCase()}
          </Link>

          <div className="mt-4 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <ProductVisual
                imageLabel={product.images[selectedImageIndex]}
                product={product}
                variant="hero"
              />

              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {product.images.map((imageLabel, index) => (
                  <button key={imageLabel} onClick={() => setSelectedImageIndex(index)} type="button">
                    <ProductVisual
                      active={selectedImageIndex === index}
                      imageLabel={imageLabel}
                      product={product}
                      variant="thumb"
                    />
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  'Đổi trả trong 30 ngày',
                  'Cam kết chính hãng',
                  'Miễn phí giao hàng từ 500.000đ',
                ].map((item) => (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700" key={item}>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                  Chính hãng
                </span>
                <span className="rounded-full border border-cyan-200 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {product.badge}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-950">
                {product.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>{product.sku}</span>
                <span className="text-amber-500">&#9733; {product.rating.toFixed(1)}</span>
                <span>{product.reviewCount} đánh giá</span>
                <span>{product.commentCount} bình luận</span>
              </div>

              <p className="mt-5 text-4xl font-bold text-cyan-700">
                {formatPrice(product.price)}
                <span className="ml-2 text-2xl font-medium text-slate-500">/ {product.unit}</span>
              </p>

              <div className="mt-6 space-y-5">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm font-medium text-slate-700">Chọn đơn vị tính</p>
                  <span className="rounded-full border border-cyan-700 px-4 py-2 font-semibold text-cyan-700">
                    {product.unit}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm font-medium text-slate-700">Chọn số lượng</p>
                  <div className="flex items-center rounded-full border border-slate-300">
                    <button
                      className="h-11 w-11 text-xl font-semibold text-slate-700"
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      type="button"
                    >
                      -
                    </button>
                    <span className="flex h-11 min-w-14 items-center justify-center border-x border-slate-300 px-3 text-base font-semibold text-slate-950">
                      {quantity}
                    </span>
                    <button
                      className="h-11 w-11 text-xl font-semibold text-slate-700"
                      onClick={() => setQuantity((value) => value + 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="rounded-full bg-cyan-700 px-5 py-4 text-lg font-semibold text-white hover:bg-cyan-800"
                    onClick={() => onAddToCart(product.slug, quantity)}
                    type="button"
                  >
                    Chọn mua
                  </button>
                  <button
                    className="rounded-full bg-slate-100 px-5 py-4 text-lg font-semibold text-cyan-700 hover:bg-slate-200"
                    type="button"
                  >
                    Tìm nhà thuốc
                  </button>
                </div>
              </div>

              <p className="mt-6 text-base leading-7 text-slate-700">{product.shortDescription}</p>

              <div className="mt-8 grid gap-x-6 gap-y-4 border-t border-slate-200 pt-6 sm:grid-cols-[160px_minmax(0,1fr)]">
                <p className="font-medium text-slate-700">Tên chính hãng</p>
                <p className="text-slate-950">{product.officialName}</p>

                <p className="font-medium text-slate-700">Số đăng ký</p>
                <div>
                  <p className="text-slate-950">{product.registrationNumber}</p>
                  <p className="mt-1 text-sm text-cyan-700">Xem giấy công bố sản phẩm</p>
                </div>

                <p className="font-medium text-slate-700">Thành phần</p>
                <p className="text-slate-950">{product.ingredientHighlight}</p>

                <p className="font-medium text-slate-700">Dạng bào chế</p>
                <p className="text-slate-950">{product.form}</p>

                <p className="font-medium text-slate-700">Quy cách</p>
                <p className="text-slate-950">{product.specification}</p>

                <p className="font-medium text-slate-700">Danh mục</p>
                <p className="text-cyan-700">{product.subCategory}</p>

                <p className="font-medium text-slate-700">Nhà sản xuất</p>
                <p className="text-slate-950">{product.manufacturer}</p>

                <p className="font-medium text-slate-700">Nước sản xuất</p>
                <p className="text-slate-950">{product.countryOfOrigin}</p>

                <p className="font-medium text-slate-700">Hạn sử dụng</p>
                <p className="text-slate-950">{product.shelfLife}</p>
              </div>
            </div>
          </div>
        </section>

        <RelatedProductsSection products={relatedProducts} />
        <ReviewSection product={product} />
        <StoreFooter />
      </div>
    </main>
  )
}

export default ProductDetailPage
