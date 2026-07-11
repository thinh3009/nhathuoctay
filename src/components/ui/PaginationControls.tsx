import Link from 'next/link'

type PaginationControlsProps = {
  basePath: string
  page: number
  totalPages: number
  query: Record<string, string | undefined>
}

function createHref(basePath: string, query: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      params.set(key, value)
    }
  })

  if (page > 1) {
    params.set('page', String(page))
  }

  const search = params.toString()
  return search ? `${basePath}?${search}` : basePath
}

export default function PaginationControls({
  basePath,
  page,
  totalPages,
  query,
}: PaginationControlsProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <Link
        aria-disabled={page === 1}
        className={`rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium ${
          page === 1
            ? 'pointer-events-none opacity-50'
            : 'text-stone-700 hover:border-brand-300 hover:text-brand-700'
        }`}
        href={createHref(basePath, query, Math.max(1, page - 1))}
      >
        Trước
      </Link>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
        <Link
          className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium ${
            page === value
              ? 'border-brand-700 bg-brand-700 text-white'
              : 'border-stone-300 bg-white text-stone-700 hover:border-brand-300 hover:text-brand-700'
          }`}
          href={createHref(basePath, query, value)}
          key={value}
        >
          {value}
        </Link>
      ))}

      <Link
        aria-disabled={page === totalPages}
        className={`rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium ${
          page === totalPages
            ? 'pointer-events-none opacity-50'
            : 'text-stone-700 hover:border-brand-300 hover:text-brand-700'
        }`}
        href={createHref(basePath, query, Math.min(totalPages, page + 1))}
      >
        Sau
      </Link>
    </div>
  )
}
