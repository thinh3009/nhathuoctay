import Link from 'next/link'
import { listArticles } from '@/db/queries/articles'

export default async function AdminArticlesPage() {
  const rows = await listArticles()

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Bài viết</h1>
          <p className="mt-1 text-stone-500">{rows.length} bài viết</p>
        </div>
        <Link
          className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
          href="/admin/articles/new"
        >
          + Viết bài
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-16 text-center" role="status">
          <p className="text-lg font-semibold text-stone-700">Chưa có bài viết nào</p>
          <p className="mt-1 text-sm text-stone-500">Bắt đầu bằng cách viết bài đầu tiên.</p>
          <Link
            className="mt-4 inline-block rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            href="/admin/articles/new"
          >
            + Viết bài
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left">
                  <th className="px-4 py-3 font-semibold text-stone-600">Tiêu đề</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Chuyên mục</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Cập nhật</th>
                  <th className="px-4 py-3 font-semibold text-stone-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rows.map((article) => (
                  <tr className="hover:bg-stone-50" key={article.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-stone-900">{article.title}</p>
                      <p className="font-mono text-xs text-stone-400">/{article.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{article.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          article.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {article.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500">
                      {new Date(article.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-emerald-100 hover:text-emerald-700"
                        href={`/admin/articles/${article.id}/edit`}
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
