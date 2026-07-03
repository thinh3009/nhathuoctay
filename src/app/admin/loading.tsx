// Skeleton dùng chung cho toàn bộ khu /admin. Next.js tự dùng file này làm
// Suspense fallback cho mọi route con (products, orders, categories, users…)
// trừ khi route đó có loading.tsx riêng. Sidebar do admin/layout.tsx render sẵn,
// nên ở đây chỉ dựng khung cho vùng nội dung.
export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Tiêu đề trang + nút hành động */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="h-8 w-48 rounded bg-stone-200" />
          <div className="mt-2 h-4 w-28 rounded bg-stone-100" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-emerald-100" />
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-100 bg-stone-50 px-4 py-3">
          <div className="h-4 w-40 rounded bg-stone-200" />
        </div>
        <div className="divide-y divide-stone-100">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="flex items-center gap-4 px-4 py-4" key={index}>
              <div className="h-10 w-10 rounded-lg bg-stone-100" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded bg-stone-200" />
                <div className="h-3 w-1/5 rounded bg-stone-100" />
              </div>
              <div className="h-6 w-20 rounded-full bg-stone-100" />
              <div className="h-8 w-16 rounded-lg bg-stone-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
