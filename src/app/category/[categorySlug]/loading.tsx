// Skeleton cho trang danh mục trong lúc truy vấn sản phẩm từ DB.
export default function CategoryLoading() {
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

      <div className="mx-auto max-w-7xl animate-pulse px-4 py-6 sm:px-6 lg:px-8">
        {/* Khối tiêu đề + bộ lọc */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="h-4 w-40 rounded bg-stone-100" />
          <div className="mt-4 h-9 w-2/3 rounded bg-stone-200" />
          <div className="mt-3 h-4 w-full max-w-3xl rounded bg-stone-100" />
          <div className="mt-6 flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="h-9 w-28 rounded-full bg-stone-100" key={index} />
            ))}
          </div>
        </section>

        {/* Lưới sản phẩm */}
        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm" key={index}>
              <div className="h-36 rounded-lg bg-stone-100" />
              <div className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-stone-100" />
              <div className="mt-4 h-9 w-full rounded-lg bg-emerald-100" />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
