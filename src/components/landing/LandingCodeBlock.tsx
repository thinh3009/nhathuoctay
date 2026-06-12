type LandingCodeBlockProps = {
  code: string
}

export default function LandingCodeBlock({ code }: LandingCodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded-3xl bg-stone-950 p-5 text-sm leading-7 text-emerald-100 shadow-inner">
      <code>{code}</code>
    </pre>
  )
}
