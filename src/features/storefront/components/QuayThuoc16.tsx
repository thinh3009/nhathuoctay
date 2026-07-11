'use client'

import { type NewsArticle, type Product, type StorefrontCombo, s } from '../data'
import HomeFooter from './HomeFooter'
import HomeHeader from './HomeHeader'
import RxModal from './RxModal'
import Toast from './Toast'
import { useStorefront, type StorefrontInitialParams } from '../use-storefront'
import ArticleScreen from './screens/ArticleScreen'
import CartScreen from './screens/CartScreen'
import CategoryScreen from './screens/CategoryScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import DoneScreen from './screens/DoneScreen'
import HomeScreen from './screens/HomeScreen'
import NewsScreen from './screens/NewsScreen'
import ProductScreen from './screens/ProductScreen'
import SearchScreen from './screens/SearchScreen'

/**
 * Storefront Quầy thuốc 16 (SPA state-machine trong 1 route).
 * Toàn bộ state/logic nằm trong hook `useStorefront`; component này chỉ điều phối:
 * chọn màn hình theo `screen` rồi render header/footer/modal dùng chung.
 */
export default function QuayThuoc16({
  products,
  news,
  combos,
  heroImages,
  ctaImage,
  logoUrl,
  initialParams,
}: {
  products?: Product[]
  news?: NewsArticle[]
  combos?: StorefrontCombo[]
  heroImages?: string[]
  ctaImage?: string
  logoUrl?: string
  initialParams?: StorefrontInitialParams
}) {
  const hub = useStorefront({ products, news, combos, heroImages, ctaImage, logoUrl, initialParams })
  const { screen } = hub.sst

  return (
    <div className="qt-root" style={s("font-family:var(--font-body);background:var(--color-bg-page);color:var(--color-text-body);min-height:100vh;display:flex;flex-direction:column")}>
      <HomeHeader hub={hub} />

      <main style={s('flex:1')}>
        {screen === 'home' ? <HomeScreen hub={hub} /> : null}
        {screen === 'category' ? <CategoryScreen hub={hub} /> : null}
        {screen === 'search' ? <SearchScreen hub={hub} /> : null}
        {screen === 'news' ? <NewsScreen hub={hub} /> : null}
        {screen === 'article' ? <ArticleScreen hub={hub} /> : null}
        {screen === 'product' ? <ProductScreen hub={hub} /> : null}
        {screen === 'cart' ? <CartScreen hub={hub} /> : null}
        {screen === 'checkout' ? <CheckoutScreen hub={hub} /> : null}
        {screen === 'done' ? <DoneScreen hub={hub} /> : null}
      </main>

      <HomeFooter hub={hub} />
      <Toast message={hub.sst.toast} />
      <RxModal hub={hub} />
    </div>
  )
}
