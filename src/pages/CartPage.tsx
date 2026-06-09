import { Link } from 'react-router-dom'
import StoreFooter from '../components/StoreFooter'
import StoreHeader from '../components/StoreHeader'
import { defaultCategorySlug, formatPrice, products } from '../data/products'
import type { CartItem } from '../types/cart'

type CartPageProps = {
  cartCount: number
  cartItems: CartItem[]
  onAddToCart: (slug: string, quantity?: number) => void
  onDecreaseQuantity: (slug: string) => void
  onRemoveFromCart: (slug: string) => void
}

function CartPage({
  cartCount,
  cartItems,
  onAddToCart,
  onDecreaseQuantity,
  onRemoveFromCart,
}: CartPageProps) {
  const cartProducts = cartItems.reduce<
    Array<
      (typeof products)[number] & {
        quantity: number
        subtotal: number
      }
    >
  >((result, item) => {
    const product = products.find((entry) => entry.slug === item.slug)

    if (!product) {
      return result
    }

    result.push({
      ...product,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    })

    return result
  }, [])

  const total = cartProducts.reduce((sum, item) => sum + item.subtotal, 0)

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <StoreHeader cartCount={cartCount} />

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
                  Giỏ hàng
                </p>
                <h2 className="text-2xl font-bold text-slate-950">Sản phẩm đã chọn</h2>
              </div>
              <p className="text-sm text-slate-600">{cartCount} sản phẩm trong giỏ</p>
            </div>

            {cartProducts.length === 0 ? (
              <div className="py-10 text-center">
                <h3 className="text-xl font-semibold text-slate-950">Giỏ hàng đang trống</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Hãy quay lại danh mục để thêm sản phẩm phù hợp với nhu cầu của bạn.
                </p>
                <Link
                  className="mt-5 inline-block rounded-lg bg-cyan-700 px-4 py-2 font-medium text-white hover:bg-cyan-800"
                  to={`/category/${defaultCategorySlug}`}
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {cartProducts.map((item) => (
                  <article className="rounded-lg border border-slate-200 p-4" key={item.slug}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                          {item.topCategory} • {item.subCategory}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{item.benefit}</p>
                        <p className="mt-3 text-sm font-semibold text-cyan-700">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:items-end">
                        <div className="flex items-center rounded-lg border border-slate-300">
                          <button
                            className="h-10 w-10 text-lg font-semibold text-slate-700"
                            onClick={() => onDecreaseQuantity(item.slug)}
                            type="button"
                          >
                            -
                          </button>
                          <span className="flex h-10 min-w-12 items-center justify-center border-x border-slate-300 px-3 text-sm font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            className="h-10 w-10 text-lg font-semibold text-slate-700"
                            onClick={() => onAddToCart(item.slug, 1)}
                            type="button"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-sm font-bold text-slate-950">
                          Tạm tính: {formatPrice(item.subtotal)}
                        </p>

                        <button
                          className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                          onClick={() => onRemoveFromCart(item.slug)}
                          type="button"
                        >
                          Xóa khỏi giỏ hàng
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">Tóm tắt đơn hàng</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Số lượng sản phẩm</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-slate-950">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí giao hàng</span>
                <span>Miễn phí</span>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-cyan-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Tổng thanh toán</p>
              <p className="mt-2 text-2xl font-bold text-cyan-700">{formatPrice(total)}</p>
            </div>

            <button
              className="mt-5 w-full rounded-lg bg-cyan-700 px-4 py-2 font-medium text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={cartProducts.length === 0}
              type="button"
            >
              Tiến hành đặt hàng
            </button>

            <Link
              className="mt-3 block text-center text-sm font-semibold text-cyan-700 hover:text-cyan-800"
              to={`/category/${defaultCategorySlug}`}
            >
              Tiếp tục xem sản phẩm
            </Link>
          </aside>
        </section>

        <StoreFooter />
      </div>
    </main>
  )
}

export default CartPage
