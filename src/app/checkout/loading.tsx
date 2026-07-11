// Skeleton cho trang thanh toán trong lúc tải giỏ hàng từ DB.
export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-[var(--color-bg-page)] text-stone-900">
      {/* Thanh header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-green-600 px-4 py-5">
        <div className="mx-auto h-8 max-w-5xl rounded bg-white/20" />
      </div>

      <div className="mx-auto grid max-w-5xl animate-pulse gap-6 px-4 py-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Form địa chỉ + thanh toán */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <div className="h-6 w-40 rounded bg-stone-200" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="h-11 w-full rounded-xl bg-stone-100" key={index} />
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <div className="h-6 w-48 rounded bg-stone-200" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="h-14 rounded-xl bg-stone-100" key={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Tóm tắt đơn */}
        <div className="h-fit rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
          <div className="h-6 w-32 rounded bg-stone-200" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-4 w-full rounded bg-stone-100" key={index} />
            ))}
          </div>
          <div className="mt-6 h-12 w-full rounded-full bg-brand-100" />
        </div>
      </div>
    </main>
  )
}
