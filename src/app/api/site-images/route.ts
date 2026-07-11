import { NextResponse } from 'next/server'
import { getSiteImageMap } from '@/features/siteImages/queries'

export const runtime = 'nodejs'

// Công khai: header/footer trên các trang route đọc map ảnh giao diện (chỉ URL, không nhạy cảm).
export async function GET() {
  try {
    const map = await getSiteImageMap()
    return NextResponse.json(map)
  } catch {
    return NextResponse.json({})
  }
}
