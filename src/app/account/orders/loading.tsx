// Skeleton cho trang "Đơn hàng của tôi" trong lúc tải lịch sử đơn từ DB.
export default function AccountOrdersLoading() {
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

      <div className="mx-auto max-w-3xl animate-pulse px-4 py-8">
        <div className="h-7 w-56 rounded bg-stone-200" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm" key={index}>
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 rounded bg-stone-200" />
                <div className="h-6 w-24 rounded-full bg-stone-100" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-stone-100" />
                <div className="h-4 w-2/3 rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
