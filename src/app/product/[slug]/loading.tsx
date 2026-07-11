// Khung chờ (skeleton) hiển thị ngay khi user bấm vào sản phẩm, trong lúc
// trang chi tiết thật đang tải dữ liệu từ DB. Next.js tự dùng file này làm
// Suspense fallback cho route /product/[slug].
export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-stone-900">
      {/* Header (khớp SiteHeader) */}
      <div className="h-8 bg-[var(--color-footer-bg)]" />
      <div className="border-b border-stone-100 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] animate-pulse items-center gap-4 px-6">
          <div className="h-10 w-40 rounded bg-stone-100" />
          <div className="h-10 flex-1 rounded-xl bg-stone-100" />
          <div className="h-9 w-24 rounded bg-stone-100" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8">
        {/* Link quay lại */}
        <div className="h-4 w-40 rounded bg-brand-100" />

        {/* Khung chi tiết sản phẩm */}
        <section className="mt-6 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Cột ảnh */}
            <div>
              <div className="overflow-hidden rounded-[1.75rem] border border-brand-100 bg-white">
                <div className="h-16 border-b border-stone-200 bg-brand-50" />
                <div className="flex min-h-[420px] items-center justify-center bg-gradient-to-br from-stone-50 via-white to-brand-50 px-6 py-6">
                  <div className="h-[360px] w-full max-w-[420px] rounded-[2rem] bg-stone-200" />
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div className="h-16 rounded-2xl bg-stone-100" key={index} />
                ))}
              </div>
            </div>

            {/* Cột thông tin */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-24 rounded-full bg-brand-100" />
                <div className="h-6 w-20 rounded-full bg-brand-100" />
              </div>
              <div className="h-8 w-3/4 rounded bg-stone-200" />
              <div className="h-4 w-1/2 rounded bg-stone-100" />
              <div className="h-10 w-40 rounded bg-brand-100" />
              <div className="space-y-2 pt-2">
                <div className="h-10 w-full rounded-full bg-stone-100" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-12 rounded-full bg-brand-100" />
                  <div className="h-12 rounded-full bg-stone-100" />
                </div>
              </div>
              <div className="space-y-2 border-t border-stone-200 pt-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="h-4 w-full rounded bg-stone-100" key={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Khung sản phẩm liên quan */}
        <section className="mt-8 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="h-6 w-48 rounded bg-stone-200" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="h-56 rounded-2xl bg-stone-100" key={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
