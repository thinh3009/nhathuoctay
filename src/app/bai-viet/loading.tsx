// Skeleton cho trang danh sách bài viết trong lúc tải từ DB.
export default function ArticlesLoading() {
  return (
    <main className="min-h-screen bg-[#f6fbf4] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-5xl animate-pulse">
        {/* Header */}
        <div className="h-28 rounded-[24px] bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-600 opacity-70" />

        {/* Tiêu đề */}
        <div className="mt-8 h-8 w-64 rounded bg-stone-200" />
        <div className="mt-2 h-4 w-80 rounded bg-stone-100" />

        {/* Danh sách bài viết */}
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm" key={index}>
              <div className="h-24 w-32 shrink-0 rounded-xl bg-stone-100" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 w-3/4 rounded bg-stone-200" />
                <div className="h-4 w-full rounded bg-stone-100" />
                <div className="h-4 w-2/3 rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
