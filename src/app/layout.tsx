import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NutriHome',
  description: 'Nhà thuốc và chăm sóc sức khỏe trực tuyến',
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
