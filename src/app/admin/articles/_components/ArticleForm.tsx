'use client'

import { useActionState, useState } from 'react'
import MarkdownContent from '@/components/MarkdownContent'
import { saveArticleAction, type ArticleFormState } from '../actions'

type ArticleFormProps = {
  article?: {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string
    coverImage: string | null
    category: string
    status: 'draft' | 'published'
  }
}

const inputClass =
  'w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
const labelClass = 'mb-1.5 block text-sm font-semibold text-stone-700'

export default function ArticleForm({ article }: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState<ArticleFormState, FormData>(
    saveArticleAction,
    {},
  )
  const [content, setContent] = useState(article?.content ?? '')
  const [showPreview, setShowPreview] = useState(false)

  return (
    <form action={formAction} className="space-y-5">
      {article ? <input name="id" type="hidden" value={article.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* Cột nội dung chính */}
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <label className={labelClass} htmlFor="title">
              Tiêu đề
            </label>
            <input
              className={inputClass}
              defaultValue={article?.title}
              id="title"
              name="title"
              placeholder="Ví dụ: 5 lưu ý khi bổ sung vitamin C"
              required
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="excerpt">
              Tóm tắt
            </label>
            <textarea
              className={`${inputClass} min-h-20`}
              defaultValue={article?.excerpt}
              id="excerpt"
              name="excerpt"
              placeholder="Đoạn mô tả ngắn hiển thị ở danh sách bài viết"
              required
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className={labelClass + ' mb-0'} htmlFor="content">
                Nội dung (Markdown)
              </label>
              <button
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                onClick={() => setShowPreview((value) => !value)}
                type="button"
              >
                {showPreview ? 'Soạn thảo' : 'Xem trước'}
              </button>
            </div>

            {showPreview ? (
              <div className="min-h-64 max-w-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
                {content.trim() ? (
                  <MarkdownContent>{content}</MarkdownContent>
                ) : (
                  <p className="text-stone-400">Chưa có nội dung để xem trước.</p>
                )}
              </div>
            ) : (
              <textarea
                className={`${inputClass} min-h-64 font-mono`}
                id="content"
                name="content"
                onChange={(event) => setContent(event.target.value)}
                placeholder={'# Tiêu đề\n\nViết nội dung bằng Markdown...\n\n- Gạch đầu dòng\n- **In đậm**, *in nghiêng*'}
                value={content}
              />
            )}
          </div>
        </div>

        {/* Cột thuộc tính */}
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
          <div>
            <label className={labelClass} htmlFor="slug">
              Đường dẫn (slug)
            </label>
            <input
              className={inputClass}
              defaultValue={article?.slug}
              id="slug"
              name="slug"
              placeholder="Để trống sẽ tự tạo từ tiêu đề"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="category">
              Chuyên mục
            </label>
            <input
              className={inputClass}
              defaultValue={article?.category ?? 'Tin sức khỏe'}
              id="category"
              name="category"
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="coverImage">
              Ảnh bìa (URL, tùy chọn)
            </label>
            <input
              className={inputClass}
              defaultValue={article?.coverImage ?? ''}
              id="coverImage"
              name="coverImage"
              placeholder="https://..."
            />
          </div>

          {article ? (
            <p className="text-xs text-stone-500">
              Trạng thái hiện tại:{' '}
              <span className="font-semibold text-stone-700">
                {article.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
              </span>
            </p>
          ) : null}

          {state.error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="alert">
              {state.error}
            </p>
          ) : null}

          <div className="space-y-2 pt-1">
            <button
              className="w-full rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60"
              disabled={isPending}
              name="status"
              type="submit"
              value="published"
            >
              {isPending ? 'Đang lưu...' : 'Đăng bài'}
            </button>
            <button
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-60"
              disabled={isPending}
              name="status"
              type="submit"
              value="draft"
            >
              Lưu nháp
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
