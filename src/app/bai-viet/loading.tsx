// Skeleton cho trang danh sách bài viết trong lúc tải từ DB.
export default function ArticlesLoading() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-stone-900">
      {/* Header (khớp SiteHeader) */}
      <div className="h-8 bg-[var(--teal-100)]" />
      <div className="border-b border-stone-100 bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] animate-pulse items-center gap-4 px-6">
          <div className="h-10 w-40 rounded bg-stone-100" />
          <div className="h-10 flex-1 rounded-xl bg-stone-100" />
          <div className="h-9 w-24 rounded bg-stone-100" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8">
        {/* Tiêu đề */}
        <div className="h-8 w-64 rounded bg-stone-200" />
        <div className="mt-2 h-4 w-80 rounded bg-stone-100" />

        {/* Danh sách bài viết */}
        <div className="mt-6 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm" key={index}>
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
    </div>
  )
}
