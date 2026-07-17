import type { Metadata } from 'next'
import DrugChatbot from '@/features/chat/components/DrugChatbot'
import { JsonLd } from '@/components/ui/JsonLd'
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

// Structured data toàn site. TẠM chỉ Organization + WebSite (name/url/logo) — CHƯA có
// địa chỉ/SĐT/email thật nên chưa dùng Pharmacy/LocalBusiness (bắt buộc address). Khi có
// NAP thật, nâng cấp lên Pharmacy + address + geo + openingHours (đã note trong Notion).
const organizationLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo_brand.svg`,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'vi-VN',
    },
  ],
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
        <JsonLd data={organizationLd} />
        {children}
        <DrugChatbot />
      </body>
    </html>
  )
}
