import Link from 'next/link'
import CartItemControls from '@/components/CartItemControls'
import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { getExistingCart } from '@/db/queries/cart'
import { formatPrice } from '@/lib/catalog'
import { DEFAULT_CATEGORY_SLUG } from '@/lib/constants'
import { getCartTokenFromCookies, getServerCartCount } from '@/lib/cart'

export default async function CartPage() {
  const cartToken = await getCartTokenFromCookies()
  const cart = await getExistingCart(cartToken)
  const cartCount = await getServerCartCount()

  return (
    <main className="min-h-screen bg-[#f6fbf4] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-7xl">
        <StoreHeader cartCount={cartCount} />

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-100/60">
            <div className="flex flex-col gap-2 border-b border-stone-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Giỏ hàng</p>
                <h1 className="text-2xl font-bold text-stone-900">Sản phẩm đã chọn</h1>
              </div>
              <p className="text-sm text-stone-600">{cartCount} sản phẩm trong giỏ</p>
            </div>

            {!cart || cart.items.length === 0 ? (
              <div className="py-10 text-center">
                <h2 className="text-xl font-semibold text-stone-900">Giỏ hàng đang trống</h2>
                <p className="mt-2 text-sm text-stone-600">
                  Hãy quay lại danh mục để thêm sản phẩm phù hợp với nhu cầu của bạn.
                </p>
                <Link
                  className="mt-5 inline-block rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
                  href={`/category/${DEFAULT_CATEGORY_SLUG}`}
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {cart.items.map((item) => (
                  <article className="rounded-2xl border border-stone-200 p-4" key={item.productSlug}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                          {item.product.topCategory} • {item.product.subCategory}
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-stone-900">{item.product.name}</h2>
                        <p className="mt-1 text-sm text-stone-600">{item.product.benefit}</p>
                        <p className="mt-3 text-sm font-semibold text-emerald-700">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:items-end">
                        <CartItemControls productSlug={item.productSlug} quantity={item.quantity} />
                        <p className="text-sm font-bold text-stone-900">
                          Tạm tính: {formatPrice(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm shadow-emerald-100/60">
            <h2 className="text-lg font-semibold text-stone-900">Tóm tắt đơn hàng</h2>
            <div className="mt-4 space-y-3 text-sm text-stone-700">
              <div className="flex items-center justify-between">
                <span>Số lượng sản phẩm</span>
                <span>{cart?.totalItems ?? 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-stone-900">{formatPrice(cart?.subtotal ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phí giao hàng</span>
                <span>Miễn phí</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-stone-900">Tổng thanh toán</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">{formatPrice(cart?.subtotal ?? 0)}</p>
            </div>

            <button
              className="mt-5 w-full rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!cart || cart.items.length === 0}
              type="button"
            >
              Tiến hành đặt hàng
            </button>

            <Link
              className="mt-3 block text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              href={`/category/${DEFAULT_CATEGORY_SLUG}`}
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
