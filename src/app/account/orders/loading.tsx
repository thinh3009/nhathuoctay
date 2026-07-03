// Skeleton cho trang "Đơn hàng của tôi" trong lúc tải lịch sử đơn từ DB.
export default function AccountOrdersLoading() {
  return (
    <main className="min-h-screen bg-[#f6fbf4] text-stone-900">
      {/* Thanh header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-600 px-4 py-5">
        <div className="mx-auto h-8 max-w-3xl rounded bg-white/20" />
      </div>

      <div className="mx-auto max-w-3xl animate-pulse px-4 py-8">
        <div className="h-7 w-56 rounded bg-stone-200" />

        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm" key={index}>
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 rounded bg-stone-200" />
                <div className="h-6 w-24 rounded-full bg-stone-100" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full rounded bg-stone-100" />
                <div className="h-4 w-2/3 rounded bg-stone-100" />
              </div>
              <div className="mt-4 h-5 w-40 rounded bg-emerald-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
