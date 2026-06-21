export default function ArticleLoading() {
  return (
    <main className="min-h-screen bg-[#f6fbf4] px-4 py-8 text-stone-900">
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="h-16 rounded-2xl bg-emerald-100/60" />
        <div className="mt-6 h-4 w-32 rounded bg-emerald-100" />
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="h-4 w-24 rounded bg-stone-100" />
          <div className="mt-3 h-9 w-3/4 rounded bg-stone-200" />
          <div className="mt-2 h-4 w-40 rounded bg-stone-100" />
          <div className="mt-5 h-56 w-full rounded-2xl bg-stone-100" />
          <div className="mt-5 space-y-3 border-t border-stone-100 pt-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="h-4 w-full rounded bg-stone-100" key={index} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
