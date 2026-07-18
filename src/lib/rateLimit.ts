// Chống spam đơn giản theo khoá bất kỳ (thường là IP) — in-memory, best-effort trên serverless
// (mỗi instance có bộ đếm riêng, không chính xác tuyệt đối ở multi-instance, nhưng đủ chặn spam thô).
export function createRateLimiter(limit: number, windowMs: number) {
  const hits = new Map<string, number[]>()
  return function isRateLimited(key: string): boolean {
    const now = Date.now()
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    recent.push(now)
    hits.set(key, recent)
    return recent.length > limit
  }
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
