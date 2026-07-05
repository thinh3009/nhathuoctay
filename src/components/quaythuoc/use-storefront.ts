'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { type CardVM } from './ProductCard'
import {
  type Cat,
  type NewsArticle,
  type Product,
  catLabel,
  fmt,
  newsData,
  palette,
  products as staticProducts,
  reviewData,
  s,
  tint,
} from './data'

export type Screen =
  | 'home'
  | 'category'
  | 'search'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'done'
  | 'news'
  | 'article'
export type Form = { name: string; phone: string; address: string; city: string; note: string; pay: string }
type CartLine = { id: string; qty: number }

// Ngưỡng nghiệp vụ đơn hàng — khớp server (`/api/checkout`) để tổng tiền hiển thị
// bằng đúng tổng tiền ghi vào đơn.
const FREE_SHIP_THRESHOLD = 500000
const SHIPPING_FEE = 30000

// Map phương thức thanh toán của storefront → enum server chấp nhận.
const PAYMENT_METHOD_MAP: Record<string, 'cod' | 'bank_transfer' | 'momo'> = {
  cod: 'cod',
  bank: 'bank_transfer',
  momo: 'momo',
}

/** View-model chung cho một thẻ sản phẩm (ProductCard). */
export type ProductCardVM = { p: CardVM; onView: () => void; onAdd: () => void }

type State = {
  screen: Screen
  cat: 'all' | Cat
  uses: string[]
  sort: string
  dealsOnly: boolean
  query: string
  selected: string
  articleId: string
  cart: CartLine[]
  detailQty: number
  showRx: boolean
  rxName: string
  toast: string
  toastSeq: number
  ordered: string | null
  placingOrder: boolean
  form: Form
}

const INITIAL: State = {
  screen: 'home',
  cat: 'all',
  uses: [],
  sort: 'popular',
  dealsOnly: false,
  query: '',
  selected: 't1',
  articleId: 'n1',
  cart: [],
  detailQty: 1,
  showRx: false,
  rxName: '',
  toast: '',
  toastSeq: 0,
  ordered: null,
  placingOrder: false,
  form: { name: '', phone: '', address: '', city: '', note: '', pay: 'cod' },
}

/** Query param trang chủ nhận từ server (?screen=, ?q=, ?rx=…) để dựng đúng màn SPA. */
export type StorefrontInitialParams = {
  screen?: string
  cat?: string
  deals?: string
  p?: string
  q?: string
  rx?: string
}

const VALID_CATS: readonly Cat[] = ['thuoc', 'tpcn', 'thietbi', 'skincare']

// Dựng state khởi tạo từ searchParams do server truyền xuống. Chạy ngay trong lần
// render đầu (cả server lẫn hydrate) nên F5 giữ nguyên màn đang xem, không nháy
// về trang chủ như khi khôi phục bằng effect sau hydration.
function initialStateFromParams(params: StorefrontInitialParams | undefined, products: Product[]): State {
  if (!params) return INITIAL
  const patch: Partial<State> = {}
  if (params.q) {
    patch.query = params.q
    patch.screen = 'search'
  }
  if (params.rx) patch.showRx = true
  if (params.screen === 'category') {
    patch.screen = 'category'
    patch.cat = params.cat && VALID_CATS.includes(params.cat as Cat) ? (params.cat as Cat) : 'all'
    patch.dealsOnly = params.deals === '1'
  } else if (params.screen === 'product') {
    if (params.p && products.some((item) => item.id === params.p)) {
      patch.screen = 'product'
      patch.selected = params.p
    }
  } else if (params.screen === 'news') {
    patch.screen = 'news'
  }
  return { ...INITIAL, ...patch }
}

function chip(active: boolean): CSSProperties {
  return active
    ? s('padding:8px 15px;border-radius:22px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid #2e9e5b;background:#2e9e5b;color:#fff;white-space:nowrap')
    : s('padding:8px 15px;border-radius:22px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid #d8e6dd;background:#fff;color:#3a4a42;white-space:nowrap')
}
function tab(active: boolean): CSSProperties {
  return active
    ? s('padding:9px 14px;border-radius:10px;font-size:13.5px;font-weight:600;cursor:pointer;background:#eaf6ef;color:#1c7a45')
    : s('padding:9px 14px;border-radius:10px;font-size:13.5px;font-weight:500;cursor:pointer;background:transparent;color:#4a564e')
}
function navStyle(active: boolean): CSSProperties {
  return {
    cursor: 'pointer',
    fontWeight: active ? 700 : 500,
    color: active ? '#1c7a45' : '#3a4a42',
    fontSize: '14px',
    padding: '13px 0',
    borderBottom: active ? '2px solid #2e9e5b' : '2px solid transparent',
  }
}

function genOrderCode(): string {
  return 'QT16-' + Math.floor(100000 + Math.random() * 900000)
}

/**
 * Hook điều phối toàn bộ trạng thái + hành động + view-model của storefront
 * (state-machine "screen"). Các component con nhận `hub` do hook này trả về
 * để render, giúp tách QuayThuoc16 thành nhiều file dễ bảo trì.
 */
export function useStorefront({
  products: productsProp,
  news: newsProp,
  initialParams,
}: {
  products?: Product[]
  news?: NewsArticle[]
  initialParams?: StorefrontInitialParams
}) {
  const router = useRouter()
  // Dùng sản phẩm từ DB nếu có, fallback dữ liệu tĩnh khi rỗng.
  const products = productsProp && productsProp.length > 0 ? productsProp : staticProducts
  // Tin tức từ DB nếu có, fallback dữ liệu tĩnh khi rỗng.
  const news = newsProp && newsProp.length > 0 ? newsProp : newsData
  const get = (id: string): Product => products.find((p) => p.id === id) ?? products[0]!

  const [state, setState] = useState<State>(() => initialStateFromParams(initialParams, products))
  // Drawer bộ lọc trên mobile (màn hình danh mục)
  const [mobileFilter, setMobileFilter] = useState(false)
  // Header mobile: mở ô tìm kiếm / menu 3 mục
  const [mobSearch, setMobSearch] = useState(false)
  const [mobMenu, setMobMenu] = useState(false)

  const set = (patch: Partial<State>) => setState((prev) => ({ ...prev, ...patch }))
  const top = () => {
    try {
      window.scrollTo(0, 0)
    } catch {
      /* noop */
    }
  }

  // Toast tự ẩn sau 2s; toastSeq đảm bảo cùng nội dung lặp lại vẫn reset timer.
  useEffect(() => {
    if (!state.toast) return
    const id = setTimeout(() => setState((prev) => ({ ...prev, toast: '' })), 2000)
    return () => clearTimeout(id)
  }, [state.toastSeq, state.toast])

  // Ghi màn hình hiện tại lên URL bằng replaceState (không điều hướng, không re-render)
  // để F5 giữ nguyên màn danh mục/sản phẩm/tin tức đang xem thay vì về trang chủ.
  useEffect(() => {
    const keep = new URLSearchParams()
    if (state.screen === 'category') {
      keep.set('screen', 'category')
      if (state.cat !== 'all') keep.set('cat', state.cat)
      if (state.dealsOnly) keep.set('deals', '1')
    } else if (state.screen === 'product') {
      keep.set('screen', 'product')
      keep.set('p', state.selected)
    } else if (state.screen === 'news') {
      keep.set('screen', 'news')
    } else if (state.screen === 'search' && state.query.trim()) {
      keep.set('q', state.query)
    }
    const qs = keep.toString()
    window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname)
  }, [state.screen, state.cat, state.dealsOnly, state.selected, state.query])

  // Drawer bộ lọc mobile: khóa cuộn nền + đóng bằng phím Escape (chuẩn a11y).
  useEffect(() => {
    if (!mobileFilter) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileFilter(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileFilter])

  const toastMsg = (m: string) => setState((prev) => ({ ...prev, toast: m, toastSeq: prev.toastSeq + 1 }))

  const goHome = () => {
    set({ screen: 'home' })
    top()
  }
  const goCatScreen = (cat: 'all' | Cat) => {
    set({ screen: 'category', cat, uses: [], dealsOnly: false })
    top()
  }
  const goDeals = () => {
    set({ screen: 'category', cat: 'all', uses: [], dealsOnly: true })
    top()
  }
  const openProduct = (id: string) => {
    set({ screen: 'product', selected: id, detailQty: 1 })
    top()
  }
  const goCart = () => {
    set({ screen: 'cart' })
    top()
  }
  const goNews = () => {
    set({ screen: 'news' })
    top()
  }
  // Mở bài viết thật (trang /bai-viet/[slug]) thay vì màn hình bài viết trong SPA.
  const openArticle = (slug: string) => router.push(`/bai-viet/${slug}`)

  const cartCount = () => state.cart.reduce((a, c) => a + c.qty, 0)

  const goCheckout = () => {
    if (cartCount() === 0) return
    set({ screen: 'checkout' })
    top()
  }
  const addToCart = (id: string, qty = 1) => {
    const cart = state.cart.slice()
    const e = cart.find((c) => c.id === id)
    if (e) e.qty += qty
    else cart.push({ id, qty })
    set({ cart })
    toastMsg('Đã thêm vào giỏ hàng')
  }
  const addCombo = (ids: string[]) => {
    const cart = state.cart.slice()
    ids.forEach((id) => {
      const e = cart.find((c) => c.id === id)
      if (e) e.qty += 1
      else cart.push({ id, qty: 1 })
    })
    set({ cart })
    toastMsg('Đã thêm combo vào giỏ hàng')
  }
  const incItem = (id: string) => set({ cart: state.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c)) })
  const decItem = (id: string) => set({ cart: state.cart.map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c)) })
  const removeItem = (id: string) => set({ cart: state.cart.filter((c) => c.id !== id) })
  const toggleUse = (u: string) =>
    set({ uses: state.uses.includes(u) ? state.uses.filter((x) => x !== u) : state.uses.concat(u) })
  const setSort = (so: string) => set({ sort: so })
  const detailInc = () => set({ detailQty: state.detailQty + 1 })
  const detailDec = () => set({ detailQty: Math.max(1, state.detailQty - 1) })
  const doSearch = () => {
    if (!state.query.trim()) return
    set({ screen: 'search' })
    top()
  }
  const onQueryKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') doSearch()
  }
  const setForm = (f: keyof Form, v: string) => set({ form: { ...state.form, [f]: v } })
  const openRx = () => set({ showRx: true })
  const closeRx = () => set({ showRx: false })
  const onRxFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) set({ rxName: file.name })
  }
  const submitRx = () => {
    set({ showRx: false, rxName: '' })
    toastMsg('Đã gửi toa, dược sĩ sẽ liên hệ với bạn')
  }
  const placeOrder = async () => {
    if (state.placingOrder) return
    const f = state.form

    // Validate khớp ràng buộc server để báo lỗi thân thiện, tránh 400 khó hiểu.
    if (f.name.trim().length < 2) return toastMsg('Vui lòng nhập họ tên (tối thiểu 2 ký tự)')
    if (f.phone.trim().length < 9) return toastMsg('Số điện thoại chưa hợp lệ')
    if (f.address.trim().length < 5) return toastMsg('Vui lòng nhập địa chỉ chi tiết')
    if (f.city.trim().length < 2) return toastMsg('Vui lòng nhập tỉnh/thành phố')

    // Chỉ đặt các dòng là sản phẩm thật (có slug trong danh sách DB) — combo/dữ liệu
    // demo với id không hợp lệ bị loại để đơn không bị server từ chối.
    const items = state.cart
      .filter((line) => products.some((p) => p.id === line.id))
      .map((line) => ({ slug: line.id, quantity: line.qty }))

    if (items.length === 0) {
      toastMsg('Giỏ hàng trống hoặc sản phẩm không khả dụng')
      return
    }

    set({ placingOrder: true })
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: f.name.trim(),
            phone: f.phone.trim(),
            addressLine: f.address.trim(),
            city: f.city.trim(),
          },
          paymentMethod: PAYMENT_METHOD_MAP[f.pay] ?? 'cod',
          note: f.note.trim() || undefined,
          items,
        }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          placingOrder: false,
          toast: (data && data.error) || 'Đặt hàng thất bại, vui lòng thử lại',
          toastSeq: prev.toastSeq + 1,
        }))
        return
      }

      setState((prev) => ({
        ...prev,
        placingOrder: false,
        screen: 'done',
        ordered: data?.orderNumber ?? genOrderCode(),
        cart: [],
      }))
      top()
    } catch {
      setState((prev) => ({
        ...prev,
        placingOrder: false,
        toast: 'Lỗi kết nối, vui lòng thử lại',
        toastSeq: prev.toastSeq + 1,
      }))
    }
  }

  const cardVM = (p: Product): ProductCardVM => {
    const t = tint(p.cat)
    return {
      p: {
        name: p.name,
        image: p.image ?? '',
        catLabel: catLabel(p.cat),
        priceText: fmt(p.price),
        oldPriceText: p.oldPrice ? fmt(p.oldPrice) : '',
        ratingText: p.rating.toFixed(1),
        reviewsText: p.reviews + ' đánh giá',
        badge: p.badge ?? '',
        tintBg: t.bg,
        tintFg: t.fg,
      },
      onView: () => openProduct(p.id),
      onAdd: () => addToCart(p.id),
    }
  }

  /* ---- computed view-model (≈ renderVals) ---- */
  const sst = state
  const cc = cartCount()
  const sel = get(sst.selected)
  // Các section trang chủ lấy từ sản phẩm DB thật (theo danh mục / lượt đánh giá).
  const topByCat = (c: Cat, n: number) =>
    products.filter((p) => p.cat === c).sort((a, b) => b.reviews - a.reviews).slice(0, n).map(cardVM)
  const bestSellers = products
    .slice()
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 5)
    .map(cardVM)
  const supps = topByCat('tpcn', 5)
  const devices = topByCat('thietbi', 5)
  const skincare = topByCat('skincare', 5)

  const newsVM = (a: NewsArticle, i: number) => {
    const c = palette[i % palette.length]!
    return { ...a, tintBg: c[0], tintFg: c[1], onClick: () => openArticle(a.id) }
  }
  const newsHome = news.slice(0, 3).map(newsVM)
  const newsList = news.map(newsVM)
  const art = news.find((a) => a.id === sst.articleId) ?? news[0]!
  const ac = palette[news.indexOf(art) % palette.length]!
  const article = {
    tag: art.tag,
    title: art.title,
    date: art.date,
    tintBg: ac[0],
    tintFg: ac[1],
    body: [
      art.excerpt,
      'Theo đội ngũ dược sĩ tại Quầy thuốc 16, hiểu đúng và chủ động chăm sóc sức khỏe mỗi ngày quan trọng hơn nhiều so với điều trị khi đã có bệnh. Hãy bắt đầu từ những thói quen nhỏ và duy trì đều đặn.',
      'Nếu bạn còn băn khoăn về sản phẩm hoặc liều dùng phù hợp, đừng ngần ngại liên hệ dược sĩ để được tư vấn miễn phí. Chúng tôi luôn sẵn sàng đồng hành cùng sức khỏe của bạn và gia đình.',
      'Lưu ý: nội dung bài viết mang tính tham khảo, không thay thế cho chỉ định của bác sĩ hoặc dược sĩ.',
    ],
  }

  // Combo dựng từ SẢN PHẨM THẬT (DB) — mỗi combo gom 3 sản phẩm bán chạy, giá ưu đãi
  // 85%. Dùng slug thật nên combo thêm vào giỏ và đặt hàng được như sản phẩm thường.
  const comboMeta = [
    { tag: 'Tiết kiệm', title: 'Combo chăm sóc gia đình' },
    { tag: 'Bán chạy', title: 'Combo sức khỏe mỗi ngày' },
    { tag: 'Ưu đãi', title: 'Combo tiết kiệm cuối tuần' },
  ]
  const comboBase = products.slice().sort((a, b) => b.reviews - a.reviews)
  const combos = comboMeta
    .map((meta, ci) => {
      const picks = comboBase.slice(ci * 3, ci * 3 + 3)
      if (picks.length < 3) return null
      const ids = picks.map((p) => p.id)
      const sum = picks.reduce((a, p) => a + p.price, 0)
      const price = Math.round((sum * 0.85) / 1000) * 1000
      return {
        tag: meta.tag,
        title: meta.title,
        items: picks.map((p) => p.name),
        priceText: fmt(price),
        oldPriceText: fmt(sum),
        saveText: 'Tiết kiệm ' + fmt(sum - price),
        onAdd: () => addCombo(ids),
      }
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)

  const cnt = (c: Cat) => products.filter((p) => p.cat === c).length
  // Danh mục không còn sản phẩm nào (vd: admin ẩn danh mục — server đã lọc hết
  // sản phẩm thuộc nó) thì ẩn khỏi thẻ danh mục + nav trang chủ.
  const catCards = (
    [
      { key: 'thuoc', label: 'Thuốc', desc: 'Giảm đau, cảm cúm, tiêu hóa, hô hấp' },
      { key: 'tpcn', label: 'Thực phẩm chức năng', desc: 'Vitamin, bổ sung, đẹp da, xương khớp' },
      { key: 'skincare', label: 'Chăm sóc da', desc: 'Chống nắng, dưỡng ẩm, trị mụn' },
      { key: 'thietbi', label: 'Thiết bị y tế', desc: 'Máy đo, nhiệt kế, vật tư y tế' },
    ] as { key: Cat; label: string; desc: string }[]
  )
    .filter((c) => cnt(c.key) > 0)
    .map((c) => {
      const t = tint(c.key)
      return { label: c.label, desc: c.desc, countText: cnt(c.key) + ' sản phẩm', tintBg: t.bg, tintFg: t.fg, onClick: () => goCatScreen(c.key) }
    })

  const trustBadges = [
    { icon: '🛡️', title: 'Chính hãng 100%', desc: 'Nguồn gốc rõ ràng' },
    { icon: '💬', title: 'Dược sĩ tư vấn 24/7', desc: 'Miễn phí, tận tình' },
    { icon: '🚚', title: 'Giao nhanh 2 giờ', desc: 'Nội thành TP.HCM' },
    { icon: '↩️', title: 'Đổi trả dễ dàng', desc: 'Trong vòng 7 ngày' },
  ]
  const catNavLinks = (
    [
      { key: 'thuoc', label: 'Thuốc' },
      { key: 'tpcn', label: 'Thực phẩm chức năng' },
      { key: 'thietbi', label: 'Thiết bị y tế' },
      { key: 'skincare', label: 'Chăm sóc da' },
    ] as { key: Cat; label: string }[]
  )
    .filter((c) => cnt(c.key) > 0)
    .map((c) => ({
      label: c.label,
      onClick: () => goCatScreen(c.key),
      style: navStyle(sst.screen === 'category' && sst.cat === c.key && !sst.dealsOnly),
    }))

  const navLinks = [
    { label: 'Trang chủ', onClick: goHome, style: navStyle(sst.screen === 'home') },
    ...catNavLinks,
    { label: 'Khuyến mãi', onClick: goDeals, style: navStyle(sst.dealsOnly) },
    { label: 'Tin tức', onClick: goNews, style: navStyle(sst.screen === 'news' || sst.screen === 'article') },
  ]

  // category results
  let list = products.slice()
  if (sst.cat !== 'all') list = list.filter((p) => p.cat === sst.cat)
  if (sst.dealsOnly) list = list.filter((p) => p.oldPrice)
  if (sst.uses.length) list = list.filter((p) => p.uses.some((u) => sst.uses.includes(u)))
  if (sst.sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  else if (sst.sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  else list.sort((a, b) => b.reviews - a.reviews)
  const results = list.map((p) => cardVM(p))
  // Danh mục không còn sản phẩm (admin ẩn) cũng bị loại khỏi tab/drawer bộ lọc,
  // đồng bộ với nav — tránh dẫn khách vào màn "0 sản phẩm".
  const catTabs = ([{ k: 'all', l: 'Tất cả' }, { k: 'thuoc', l: 'Thuốc' }, { k: 'tpcn', l: 'Thực phẩm chức năng' }, { k: 'skincare', l: 'Chăm sóc da' }, { k: 'thietbi', l: 'Thiết bị y tế' }] as { k: 'all' | Cat; l: string }[])
    .filter((t) => t.k === 'all' || cnt(t.k) > 0)
    .map((t) => ({
      label: t.l,
      onClick: () => set({ cat: t.k, uses: [] }),
      style: tab(sst.cat === t.k),
    }))
  const allUses = ['Giảm đau, hạ sốt', 'Cảm cúm', 'Tiêu hóa', 'Hô hấp', 'Vitamin & khoáng chất', 'Xương khớp', 'Tim mạch', 'Thiết bị đo', 'Chống nắng', 'Dưỡng ẩm', 'Trị mụn', 'Làm sạch da']
  const useChips = allUses.map((u) => ({ label: u, onClick: () => toggleUse(u), style: chip(sst.uses.includes(u)) }))
  const sortBtns = [{ k: 'popular', l: 'Phổ biến' }, { k: 'price-asc', l: 'Giá thấp → cao' }, { k: 'price-desc', l: 'Giá cao → thấp' }].map((b) => ({
    label: b.l,
    onClick: () => setSort(b.k),
    style: chip(sst.sort === b.k),
  }))
  const catTitle = sst.dealsOnly ? 'Đang khuyến mãi' : sst.cat === 'all' ? 'Tất cả sản phẩm' : catLabel(sst.cat)

  // search
  const q = sst.query.trim().toLowerCase()
  const sr = q ? products.filter((p) => (p.name + ' ' + p.brand + ' ' + p.uses.join(' ')).toLowerCase().includes(q)) : []
  const searchResults = sr.map((p) => cardVM(p))

  // detail
  const dt = tint(sel.cat)
  const related = products.filter((p) => p.cat === sel.cat && p.id !== sel.id).slice(0, 5).map((p) => cardVM(p))
  const d = {
    name: sel.name,
    image: sel.image ?? '',
    brand: sel.brand,
    catLabel: catLabel(sel.cat),
    priceText: fmt(sel.price),
    oldPriceText: sel.oldPrice ? fmt(sel.oldPrice) : '',
    discountText: sel.oldPrice ? '-' + Math.round((1 - sel.price / sel.oldPrice) * 100) + '%' : '',
    ratingText: sel.rating.toFixed(1),
    reviewsText: sel.reviews + ' đánh giá',
    unit: sel.unit,
    usesText: sel.uses.join(', '),
    badge: sel.badge ?? '',
    tintBg: dt.bg,
    tintFg: dt.fg,
    desc:
      sel.name +
      ' là sản phẩm ' +
      (sel.cat === 'thietbi' ? 'thiết bị y tế' : sel.cat === 'tpcn' ? 'thực phẩm chức năng' : 'dược phẩm') +
      ' chính hãng từ ' +
      sel.brand +
      '. Sản phẩm được bảo quản đúng tiêu chuẩn, có đầy đủ hóa đơn. Vui lòng đọc kỹ hướng dẫn sử dụng và tham khảo ý kiến dược sĩ trước khi dùng.',
    onCat: () => goCatScreen(sel.cat),
    inc: detailInc,
    dec: detailDec,
    add: () => addToCart(sel.id, sst.detailQty),
    buyNow: () => {
      addToCart(sel.id, sst.detailQty)
      goCart()
    },
  }
  const reviews = reviewData.map((r) => ({ ...r, initial: r.name.charAt(0) }))

  // cart
  const cartView = sst.cart.map((c) => {
    const p = get(c.id)
    const t = tint(p.cat)
    return {
      id: p.id,
      name: p.name,
      image: p.image ?? '',
      catLabel: catLabel(p.cat),
      priceText: fmt(p.price),
      lineText: fmt(p.price * c.qty),
      qty: c.qty,
      tintBg: t.bg,
      tintFg: t.fg,
      onView: () => openProduct(p.id),
      inc: () => incItem(p.id),
      dec: () => decItem(p.id),
      remove: () => removeItem(p.id),
    }
  })
  const subtotal = sst.cart.reduce((a, c) => a + get(c.id).price * c.qty, 0)
  const ship = cc === 0 || subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + ship
  const freeshipHint =
    cc > 0 && subtotal < FREE_SHIP_THRESHOLD
      ? 'Mua thêm ' + fmt(FREE_SHIP_THRESHOLD - subtotal) + ' để được miễn phí giao hàng'
      : ''

  const pays = [
    { k: 'cod', l: 'Thanh toán khi nhận hàng (COD)', d: 'Trả tiền mặt cho shipper' },
    { k: 'bank', l: 'Chuyển khoản ngân hàng', d: 'Dược sĩ gửi thông tin chuyển khoản sau khi đặt' },
    { k: 'momo', l: 'Ví MoMo', d: 'Thanh toán qua ví điện tử' },
  ]
  const payOptions = pays.map((p) => {
    const on = sst.form.pay === p.k
    return {
      label: p.l,
      desc: p.d,
      onClick: () => setForm('pay', p.k),
      dot: on ? '#2e9e5b' : '#cdd8d1',
      dotFill: on ? '#2e9e5b' : 'transparent',
      style: {
        ...s('display:flex;align-items:center;gap:12px;border-radius:12px;padding:14px 16px;cursor:pointer'),
        border: on ? '1.5px solid #2e9e5b' : '1.5px solid #e0ebe4',
        background: on ? '#f3faf5' : '#fff',
      } as CSSProperties,
    }
  })

  const subtotalText = fmt(subtotal)
  const shipText = ship === 0 ? 'Miễn phí' : fmt(ship)
  const totalText = fmt(total)

  return {
    // state + setters
    sst,
    cc,
    set,
    setForm,
    mobileFilter,
    setMobileFilter,
    mobSearch,
    setMobSearch,
    mobMenu,
    setMobMenu,
    // navigation / actions
    goHome,
    goCatScreen,
    goDeals,
    goCart,
    goNews,
    goCheckout,
    openRx,
    closeRx,
    onRxFile,
    submitRx,
    placeOrder,
    doSearch,
    onQueryKey,
    // view-models
    navLinks,
    catCards,
    // Danh mục cho footer — cùng bộ lọc cnt>0 với nav (danh mục ẩn không hiện).
    footerCats: catNavLinks.map(({ label, onClick }) => ({ label, onClick })),
    trustBadges,
    bestSellers,
    supps,
    devices,
    skincare,
    combos,
    newsHome,
    newsList,
    article,
    catTitle,
    results,
    catTabs,
    useChips,
    sortBtns,
    searchResults,
    d,
    reviews,
    related,
    cartView,
    subtotalText,
    shipText,
    totalText,
    freeshipHint,
    payOptions,
  }
}

/** Kiểu "hub" mà useStorefront trả về — dùng cho props của các component con. */
export type StorefrontHub = ReturnType<typeof useStorefront>
