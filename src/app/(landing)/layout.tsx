import StoreFooter from '@/components/StoreFooter'
import StoreHeader from '@/components/StoreHeader'
import { getServerCartCount } from '@/lib/cart'
import { getAuthUser } from '@/lib/auth'

type LandingLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function LandingLayout({ children }: LandingLayoutProps) {
  const [cartCount, user] = await Promise.all([
    getServerCartCount(),
    getAuthUser(),
  ])

  return (
    <main className="min-h-screen bg-[#f6fbf4] text-stone-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <StoreHeader cartCount={cartCount} user={user} variant="landing" />
        <div className="mt-6">{children}</div>
        <StoreFooter />
      </div>
    </main>
  )
}
