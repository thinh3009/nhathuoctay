type LandingSectionProps = {
  eyebrow: string
  title: string
  description?: string
  children: React.ReactNode
}

export default function LandingSection({
  eyebrow,
  title,
  description,
  children,
}: LandingSectionProps) {
  return (
    <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm shadow-emerald-100 sm:p-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          {title}
        </h2>
        {description ? <p className="mt-3 text-sm leading-7 text-stone-600">{description}</p> : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  )
}
