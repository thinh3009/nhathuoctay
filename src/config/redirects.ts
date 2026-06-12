export type RedirectRule = {
  source: string
  destination: string
  permanent?: boolean
}

export const redirects: RedirectRule[] = [
  {
    source: '/home',
    destination: '/',
    permanent: true,
  },
  {
    source: '/landing',
    destination: '/',
    permanent: true,
  },
  {
    source: '/shop',
    destination: '/category/thuc-pham-chuc-nang',
    permanent: true,
  },
  {
    source: '/supplements',
    destination: '/category/thuc-pham-chuc-nang',
    permanent: true,
  },
]
