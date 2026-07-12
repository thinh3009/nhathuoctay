import type { Metadata } from 'next'
import DrugChatbot from '@/features/chat/components/DrugChatbot'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/config/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <head>
        <link href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css" rel="stylesheet" />
        <link href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css" rel="stylesheet" />
        <link href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/fill/style.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        <DrugChatbot />
      </body>
    </html>
  )
}
