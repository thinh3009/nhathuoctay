import { redirect } from 'next/navigation'
import { DEFAULT_CATEGORY_SLUG } from '@/lib/constants'

export default function RootPage() {
  redirect(`/category/${DEFAULT_CATEGORY_SLUG}`)
}
