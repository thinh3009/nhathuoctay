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
    source: '/index.html',
    destination: '/',
    permanent: true,
  },
  {
    source: '/old-seo-guide',
    destination: '/',
    permanent: false,
  },
]
