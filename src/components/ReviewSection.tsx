import type { Product } from '@/lib/schemas'

function renderStars(count: number) {
  return Array.from({ length: count }, (_, index) => <span key={index}>★</span>)
}

type ReviewSectionProps = {
  product: Product
}

export default function ReviewSection({ product }: ReviewSectionProps) {
  return (
    <section className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100/60">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl bg-stone-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Đánh giá khách hàng
          </p>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-5xl font-bold text-stone-900">{product.rating.toFixed(1)}</p>
            <div className="pb-1 text-sm text-stone-500">
              <p className="text-base text-emerald-600">★★★★★</p>
              <p>{product.reviewCount} đánh giá</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">
            Phần bình luận hiện là dữ liệu mô phỏng để hoàn thiện trải nghiệm giao diện nhà thuốc online.
          </p>

          <form className="mt-6 space-y-3">
            <input
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-700"
              placeholder="Họ và tên"
              type="text"
            />
            <input
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-700"
              placeholder="Tiêu đề đánh giá"
              type="text"
            />
            <textarea
              className="min-h-28 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 outline-none focus:border-emerald-700"
              placeholder="Chia sẻ trải nghiệm của bạn"
            />
            <button
              className="w-full rounded-lg bg-emerald-700 px-4 py-2 font-medium text-white hover:bg-emerald-800"
              type="button"
            >
              Gửi đánh giá
            </button>
          </form>
        </aside>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Bình luận nổi bật</p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900">{product.commentCount} bình luận</h2>
          <div className="mt-5 space-y-4">
            {product.reviews.map((review) => (
              <article className="rounded-2xl border border-stone-200 p-4" key={`${review.author}-${review.date}`}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-stone-900">{review.title}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {review.author} • {review.date}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">{renderStars(review.rating)}</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-700">{review.content}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
