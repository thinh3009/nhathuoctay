import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { deleteProductReview } from '@/features/products/queries'
import { jsonError } from '@/lib/api'

type DeleteReviewRouteProps = {
  params: Promise<{
    slug: string
    reviewId: string
  }>
}

// Admin kiểm duyệt: xoá một đánh giá/bình luận của khách. Chỉ role admin mới được gọi.
export async function DELETE(_: Request, { params }: DeleteReviewRouteProps) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return jsonError(401, 'Vui lòng đăng nhập')
  }
  if (authUser.role !== 'admin') {
    return jsonError(403, 'Chỉ quản trị viên mới được xoá đánh giá')
  }

  const { slug, reviewId } = await params
  const result = await deleteProductReview(slug, reviewId)

  if (!result) {
    return jsonError(404, 'Không tìm thấy đánh giá')
  }

  return NextResponse.json(result)
}
