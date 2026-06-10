import { NextResponse } from 'next/server'
import { type ZodError } from 'zod'

export function jsonError(status: number, message: string, issues?: ZodError['issues']) {
  return NextResponse.json(
    {
      error: message,
      issues,
    },
    { status },
  )
}
