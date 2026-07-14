'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Product, Review } from '@/features/products/types'

type ReviewSectionProps = {
  product: Product
}

// undefined = chưa kiểm tra · null = chưa đăng nhập · object = đã đăng nhập.
type Member = { fullName: string; role: 'customer' | 'admin' | 'pharmacist' } | null | undefined

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span className={index < count ? 'text-brand-600' : 'text-stone-300'} key={index}>
      ★
    </span>
  ))
}

export default function ReviewSection({ product }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(product.reviews)
  const [rating, setRating] = useState(product.rating)
  const [reviewCount, setReviewCount] = useState(product.reviewCount)
  const [commentCount, setCommentCount] = useState(product.commentCount)
  const [member, setMember] = useState<Member>(undefined)
  const [myReview, setMyReview] = useState<Review | null>(null)

  const [formRating, setFormRating] = useState(5)
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isAdmin = member?.role === 'admin'

  // Kiểm tra đăng nhập (giống DrugChatbot) — chỉ user thật mới gửi được đánh giá.
  useEffect(() => {
    let active = true
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (active) {
          setMember(
            data.user
              ? { fullName: (data.user.fullName ?? '').trim(), role: data.user.role ?? 'customer' }
              : null,
          )
        }
      })
      .catch(() => {
        if (active) setMember(null)
      })
    return () => {
      active = false
    }
  }, [])

  // Đã đăng nhập: đồng bộ lại danh sách đánh giá + lấy đánh giá của chính mình (nếu có) để prefill form.
  useEffect(() => {
    if (!member) return
    let active = true
    fetch(`/api/products/${product.slug}/reviews`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return
        setReviews(data.items ?? [])
        setRating(data.rating ?? 0)
        setReviewCount(data.reviewCount ?? 0)
        setCommentCount(data.commentCount ?? 0)
        if (data.myReview) {
          setMyReview(data.myReview)
          setFormRating(data.myReview.rating)
          setFormTitle(data.myReview.title)
          setFormContent(data.myReview.content)
        }
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [member, product.slug])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!formTitle.trim() || !formContent.trim() || isSubmitting) return
    setIsSubmitting(true)
    setError('')
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: formRating, title: formTitle.trim(), content: formContent.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Gửi đánh giá thất bại')
        return
      }
      setReviews(data.items ?? [])
      setRating(data.rating ?? 0)
      setReviewCount(data.reviewCount ?? 0)
      setCommentCount(data.commentCount ?? 0)
      setMyReview(data.myReview ?? null)
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(reviewId: string) {
    if (deletingId) return
    setDeletingId(reviewId)
    setError('')
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews/${reviewId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Xoá đánh giá thất bại')
        return
      }
      setReviews(data.items ?? [])
      setRating(data.rating ?? 0)
      setReviewCount(data.reviewCount ?? 0)
      setCommentCount(data.commentCount ?? 0)
      // Nếu admin vừa xoá chính đánh giá của mình, cho phép viết lại từ đầu.
      if (myReview?.id === reviewId) {
        setMyReview(null)
        setFormRating(5)
        setFormTitle('')
        setFormContent('')
      }
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm shadow-brand-100/60">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl bg-stone-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
            Đánh giá khách hàng
          </p>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-5xl font-bold text-stone-900">{rating.toFixed(1)}</p>
            <div className="pb-1 text-sm text-stone-500">
              <p className="text-base">{renderStars(Math.round(rating))}</p>
              <p>{reviewCount} đánh giá</p>
            </div>
          </div>

          {member === undefined ? (
            <div className="mt-6 flex items-center gap-2 py-4 text-sm text-stone-400">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600" />
              Đang kiểm tra đăng nhập…
            </div>
          ) : member === null ? (
            <div className="mt-6 rounded-xl border border-stone-200 bg-white p-4 text-center">
              <p className="text-sm font-semibold text-stone-700">Đăng nhập để gửi đánh giá</p>
              <p className="mt-1 text-xs text-stone-500">
                Chia sẻ trải nghiệm thật của bạn về sản phẩm này.
              </p>
              <Link
                className="mt-3 inline-block w-full rounded-full bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-800"
                href={`/auth/login?from=${encodeURIComponent(typeof window !== 'undefined' ? window.location.pathname : '/')}`}
              >
                Đăng nhập
              </Link>
            </div>
          ) : (
            <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {myReview ? (
                <p className="text-xs text-stone-500">Bạn đã đánh giá sản phẩm này, gửi lại để cập nhật.</p>
              ) : null}
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Chọn số sao">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    aria-label={`${value} sao`}
                    aria-pressed={value <= formRating}
                    className={`text-2xl leading-none transition ${value <= formRating ? 'text-brand-600' : 'text-stone-300'}`}
                    key={value}
                    onClick={() => setFormRating(value)}
                    type="button"
                  >
                    ★
                  </button>
                ))}
              </div>
              <input
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 outline-none focus:border-brand-700"
                onChange={(event) => setFormTitle(event.target.value)}
                placeholder="Tiêu đề đánh giá"
                type="text"
                value={formTitle}
              />
              <textarea
                className="min-h-28 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 outline-none focus:border-brand-700"
                onChange={(event) => setFormContent(event.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn"
                value={formContent}
              />
              <button
                className="w-full rounded-full bg-brand-700 px-4 py-2.5 font-medium text-white transition hover:bg-brand-800 disabled:opacity-60"
                disabled={isSubmitting || !formTitle.trim() || !formContent.trim()}
                type="submit"
              >
                {isSubmitting ? 'Đang gửi...' : myReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
              </button>
            </form>
          )}
        </aside>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Bình luận nổi bật</p>
          <h2 className="mt-1 text-2xl font-bold text-stone-900">{commentCount} bình luận</h2>
          <div className="mt-5 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-stone-500">
                Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải nghiệm!
              </p>
            ) : (
              reviews.map((review) => (
                <article
                  className="rounded-2xl border border-stone-200 p-4"
                  key={review.id ?? `${review.author}-${review.date}`}
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-stone-900">{review.title}</h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {review.author} • {review.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold">{renderStars(review.rating)}</p>
                      {isAdmin && review.id ? (
                        <button
                          aria-label="Xoá đánh giá này"
                          className="text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"
                          disabled={deletingId === review.id}
                          onClick={() => handleDelete(review.id!)}
                          type="button"
                        >
                          {deletingId === review.id ? 'Đang xoá...' : 'Xoá'}
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-700">{review.content}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
