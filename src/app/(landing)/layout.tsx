type LandingLayoutProps = Readonly<{
  children: React.ReactNode
}>

// Trang chủ "Quầy thuốc 16" là một storefront full-bleed tự chứa header/footer riêng,
// nên layout này chỉ render thẳng children (không bọc chrome chung).
export default function LandingLayout({ children }: LandingLayoutProps) {
  return <>{children}</>
}
