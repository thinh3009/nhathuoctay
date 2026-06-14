import AnimateIn from '@/components/ui/AnimateIn'

type LandingSectionProps = {
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
  dark?: boolean
}

export default function LandingSection({
  eyebrow,
  title,
  description,
  children,
  dark = false,
}: LandingSectionProps) {
  if (dark) {
    return (
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 p-6 shadow-xl shadow-emerald-900/20 sm:rounded-[32px] sm:p-10">
        <AnimateIn>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">
            {eyebrow}
          </p>
          <h2 className="mt-2.5 text-2xl font-black tracking-tight text-white sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100/70">{description}</p>
          ) : null}
        </AnimateIn>
        <AnimateIn className="mt-7" delay={80}>
          {children}
        </AnimateIn>
      </section>
    )
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-stone-100 bg-white p-6 shadow-sm shadow-emerald-100/60 sm:rounded-[32px] sm:p-8">
      <AnimateIn>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
          {eyebrow}
        </p>
        <h2 className="mt-2.5 text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500">{description}</p>
        ) : null}
      </AnimateIn>
      <AnimateIn className="mt-7" delay={80}>
        {children}
      </AnimateIn>
    </section>
  )
}
