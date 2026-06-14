import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { getUserById } from '@/db/queries/users'

export async function GET() {
  const payload = await getAuthUser()
  if (!payload) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await getUserById(payload.userId)
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, phone: user.phone },
  })
}
