import Link from 'next/link'
import ArticleForm from '../_components/ArticleForm'

export default function NewArticlePage() {
  return (
    <div>
      <div className="mb-6">
        <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-800" href="/admin/articles">
          ← Quay lại danh sách
        </Link>
        <h1 className="mt-2 text-3xl font-black text-stone-900">Viết bài mới</h1>
      </div>
      <ArticleForm />
    </div>
  )
}
