// Skeleton cho trang giỏ hàng trong lúc tải dữ liệu giỏ từ DB.
export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#f6faf7] text-stone-900">
      {/* Header (khớp SiteHeader) */}
      <div className="h-8 bg-[#14532d]" />
      <div className="border-b border-stone-100 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] animate-pulse items-center gap-4 px-6">
          <div className="h-10 w-40 rounded bg-stone-100" />
          <div className="h-10 flex-1 rounded-xl bg-stone-100" />
          <div className="h-9 w-24 rounded bg-stone-100" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl animate-pulse px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Danh sách sản phẩm trong giỏ */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="h-6 w-48 rounded bg-stone-200" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div className="flex items-center gap-4 border-b border-stone-100 pb-4" key={index}>
                  <div className="h-16 w-16 rounded-xl bg-stone-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-stone-200" />
                    <div className="h-4 w-1/4 rounded bg-stone-100" />
                  </div>
                  <div className="h-9 w-24 rounded-lg bg-stone-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Tóm tắt đơn */}
          <div className="h-fit rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="h-6 w-32 rounded bg-stone-200" />
            <div className="mt-5 space-y-3">
              <div className="h-4 w-full rounded bg-stone-100" />
              <div className="h-4 w-full rounded bg-stone-100" />
              <div className="h-4 w-2/3 rounded bg-stone-100" />
            </div>
            <div className="mt-6 h-12 w-full rounded-full bg-emerald-100" />
          </div>
        </div>
      </div>
    </div>
  )
}
