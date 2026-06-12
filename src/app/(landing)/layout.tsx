import LandingFooter from '@/components/landing/LandingFooter'
import LandingHeader from '@/components/landing/LandingHeader'

type LandingLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <LandingHeader />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
        <div className="mt-6">
          <LandingFooter />
        </div>
      </div>
    </main>
  )
}
