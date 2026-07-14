import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/features/users/queries'
import { getProductReviews, getUserReviewForProduct, upsertProductReview } from '@/features/products/queries'
import { jsonError } from '@/lib/api'

type ProductReviewsRouteProps = {
  params: Promise<{
    slug: string
  }>
}

export async function GET(_: Request, { params }: ProductReviewsRouteProps) {
  const { slug } = await params
  const productReviews = await getProductReviews(slug)

  if (!productReviews) {
    return jsonError(404, 'Product not found')
  }

  // Đã đăng nhập → kèm luôn đánh giá của chính mình (nếu có) để form prefill cho sửa lại.
  const authUser = await getAuthUser()
  const myReview = authUser ? await getUserReviewForProduct(slug, authUser.userId) : null

  return NextResponse.json({ ...productReviews, myReview })
}

const postSchema = z.object({
  rating: z.number().int().min(1, 'Vui lòng chọn số sao').max(5),
  title: z.string().trim().min(1, 'Vui lòng nhập tiêu đề').max(120),
  content: z.string().trim().min(1, 'Vui lòng nhập nội dung đánh giá').max(2000),
})

// Khách gửi đánh giá thật (bắt buộc đăng nhập). Mỗi user chỉ có 1 đánh giá/sản phẩm,
// gửi lại sẽ cập nhật đánh giá cũ. Tên hiển thị lấy từ tài khoản, không tin dữ liệu client gửi lên.
export async function POST(request: Request, { params }: ProductReviewsRouteProps) {
  const authUser = await getAuthUser()
  if (!authUser) {
    return jsonError(401, 'Vui lòng đăng nhập để gửi đánh giá')
  }

  const { slug } = await params

  const body = await request.json().catch(() => null)
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(400, parsed.error.issues[0]?.message ?? 'Yêu cầu không hợp lệ')
  }

  const dbUser = await getUserById(authUser.userId)
  const author = dbUser?.fullName?.trim() || 'Khách hàng'

  const result = await upsertProductReview({
    productSlug: slug,
    userId: authUser.userId,
    author,
    rating: parsed.data.rating,
    title: parsed.data.title,
    content: parsed.data.content,
  })

  if (!result) {
    return jsonError(404, 'Product not found')
  }

  return NextResponse.json(result)
}
