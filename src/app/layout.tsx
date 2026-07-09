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
      <body>
        {children}
        <DrugChatbot />
      </body>
    </html>
  )
}
