import ProductCard from './ProductCard'
import { s } from '../data'
import type { ProductCardVM } from '../use-storefront'

type ProductSliderProps = {
  title: string
  cards: ProductCardVM[]
  /** Nhãn + handler cho link "Xem tất cả" (tùy chọn). */
  actionLabel?: string
  onAction?: () => void
  /** Số cột trên desktop (mobile luôn cuộn ngang qua class .qt-slider). */
  cols?: number
}

/**
 * Một dãy sản phẩm dùng chung cho các section trang chủ (Bán chạy, TPCN,
 * Chăm sóc da, Thiết bị y tế) và mục "Sản phẩm liên quan". Trên desktop là
 * lưới `cols` cột; trên mobile class `.qt-slider` chuyển sang cuộn ngang.
 */
export default function ProductSlider({ title, cards, actionLabel, onAction, cols = 5 }: ProductSliderProps) {
  return (
    <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
      <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
        <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>{title}</h2>
        {actionLabel && onAction ? (
          <span onClick={onAction} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>
            {actionLabel}
          </span>
        ) : null}
      </div>
      <div className="qt-slider" style={{ ...s('display:grid;gap:16px'), gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {cards.map((c, i) => (
          <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
        ))}
      </div>
    </div>
  )
}
