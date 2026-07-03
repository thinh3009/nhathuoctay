'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import AuthMenu from '@/components/AuthMenu'
import ProductCard, { type CardVM } from './ProductCard'
import {
  type Cat,
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

type Screen = 'home' | 'category' | 'search' | 'product' | 'cart' | 'checkout' | 'done' | 'news' | 'article'
type Form = { name: string; phone: string; address: string; note: string; pay: string }
type CartLine = { id: string; qty: number }

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
  form: { name: '', phone: '', address: '', note: '', pay: 'cod' },
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

export default function QuayThuoc16({ products: productsProp }: { products?: Product[] }) {
  // Dùng sản phẩm từ DB nếu có, fallback dữ liệu tĩnh khi rỗng.
  const products = productsProp && productsProp.length > 0 ? productsProp : staticProducts
  const get = (id: string): Product => products.find((p) => p.id === id) ?? products[0]!

  const [state, setState] = useState<State>(INITIAL)

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
  const openArticle = (id: string) => {
    set({ screen: 'article', articleId: id })
    top()
  }

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
  const placeOrder = () => {
    const f = state.form
    if (!f.name.trim() || !f.phone.trim() || !f.address.trim()) {
      toastMsg('Vui lòng nhập đầy đủ thông tin')
      return
    }
    const code = genOrderCode()
    set({ screen: 'done', ordered: code, cart: [] })
    top()
  }

  const cardVM = (p: Product): { p: CardVM; onView: () => void; onAdd: () => void } => {
    const t = tint(p.cat)
    return {
      p: {
        name: p.name,
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
  const byId = (ids: string[]) => ids.map((id) => cardVM(get(id)))
  const bestSellers = byId(['t10', 't9', 't5', 's5', 'd2', 't1', 'd4']).slice(0, 5)
  const supps = byId(['s1', 's5', 's3', 's2', 's7'])
  const devices = byId(['d1', 'd2', 'd4', 'd6', 'd5'])
  const skincare = byId(['k1', 'k2', 'k3', 'k5', 'k6'])

  const newsVM = (a: (typeof newsData)[number], i: number) => {
    const c = palette[i % palette.length]!
    return { ...a, tintBg: c[0], tintFg: c[1], onClick: () => openArticle(a.id) }
  }
  const newsHome = newsData.slice(0, 3).map(newsVM)
  const newsList = newsData.map(newsVM)
  const art = newsData.find((a) => a.id === sst.articleId) ?? newsData[0]!
  const ac = palette[newsData.indexOf(art) % palette.length]!
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

  const combos = [
    { tag: 'Mùa mưa', title: 'Combo cảm cúm gia đình', ids: ['t4', 't9', 'd4'], items: ['Decolgen Forte', 'Vitamin C 1000mg sủi', 'Khẩu trang y tế 4 lớp'] },
    { tag: 'Tiêu hóa', title: 'Combo tiêu hóa khỏe mạnh', ids: ['t5', 's4', 't7'], items: ['Berberin Mekophar', 'Men vi sinh Probio', 'Oresol bù điện giải'] },
    { tag: 'Người lớn tuổi', title: 'Combo chăm sóc sức khỏe', ids: ['d1', 's1', 's2'], items: ['Máy đo huyết áp Omron', 'Dầu cá Omega-3', 'Canxi Corbiere'] },
  ].map((k) => {
    const sum = k.ids.reduce((a, id) => a + get(id).price, 0)
    const price = Math.round((sum * 0.85) / 1000) * 1000
    return {
      tag: k.tag,
      title: k.title,
      items: k.items,
      priceText: fmt(price),
      oldPriceText: fmt(sum),
      saveText: 'Tiết kiệm ' + fmt(sum - price),
      onAdd: () => addCombo(k.ids),
    }
  })

  const cnt = (c: Cat) => products.filter((p) => p.cat === c).length
  const catCards = (
    [
      { key: 'thuoc', label: 'Thuốc', desc: 'Giảm đau, cảm cúm, tiêu hóa, hô hấp' },
      { key: 'tpcn', label: 'Thực phẩm chức năng', desc: 'Vitamin, bổ sung, đẹp da, xương khớp' },
      { key: 'skincare', label: 'Chăm sóc da', desc: 'Chống nắng, dưỡng ẩm, trị mụn' },
      { key: 'thietbi', label: 'Thiết bị y tế', desc: 'Máy đo, nhiệt kế, vật tư y tế' },
    ] as { key: Cat; label: string; desc: string }[]
  ).map((c) => {
    const t = tint(c.key)
    return { label: c.label, desc: c.desc, countText: cnt(c.key) + ' sản phẩm', tintBg: t.bg, tintFg: t.fg, onClick: () => goCatScreen(c.key) }
  })

  const trustBadges = [
    { icon: '🛡️', title: 'Chính hãng 100%', desc: 'Nguồn gốc rõ ràng' },
    { icon: '💬', title: 'Dược sĩ tư vấn 24/7', desc: 'Miễn phí, tận tình' },
    { icon: '🚚', title: 'Giao nhanh 2 giờ', desc: 'Nội thành TP.HCM' },
    { icon: '↩️', title: 'Đổi trả dễ dàng', desc: 'Trong vòng 7 ngày' },
  ]
  const navLinks = [
    { label: 'Trang chủ', onClick: goHome, style: navStyle(sst.screen === 'home') },
    { label: 'Thuốc', onClick: () => goCatScreen('thuoc'), style: navStyle(sst.screen === 'category' && sst.cat === 'thuoc' && !sst.dealsOnly) },
    { label: 'Thực phẩm chức năng', onClick: () => goCatScreen('tpcn'), style: navStyle(sst.screen === 'category' && sst.cat === 'tpcn' && !sst.dealsOnly) },
    { label: 'Thiết bị y tế', onClick: () => goCatScreen('thietbi'), style: navStyle(sst.screen === 'category' && sst.cat === 'thietbi' && !sst.dealsOnly) },
    { label: 'Chăm sóc da', onClick: () => goCatScreen('skincare'), style: navStyle(sst.screen === 'category' && sst.cat === 'skincare' && !sst.dealsOnly) },
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
  const catTabs = ([{ k: 'all', l: 'Tất cả' }, { k: 'thuoc', l: 'Thuốc' }, { k: 'tpcn', l: 'Thực phẩm chức năng' }, { k: 'skincare', l: 'Chăm sóc da' }, { k: 'thietbi', l: 'Thiết bị y tế' }] as { k: 'all' | Cat; l: string }[]).map((t) => ({
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
  const ship = cc === 0 ? 0 : subtotal >= 300000 ? 0 : 20000
  const total = subtotal + ship
  const freeshipHint = cc > 0 && subtotal < 300000 ? 'Mua thêm ' + fmt(300000 - subtotal) + ' để được miễn phí giao hàng' : ''

  const pays = [
    { k: 'cod', l: 'Thanh toán khi nhận hàng (COD)', d: 'Trả tiền mặt cho shipper' },
    { k: 'bank', l: 'Chuyển khoản ngân hàng', d: 'Quét mã QR khi đặt hàng' },
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

  return (
    <div className="qt-root" style={s("font-family:'Be Vietnam Pro',system-ui,sans-serif;background:#f6faf7;color:#1f2a24;min-height:100vh;display:flex;flex-direction:column")}>
      {/* ============ HEADER ============ */}
      <div style={s('background:#14532d;color:#cdeed8;font-size:12.5px')}>
        <div style={s('max-width:1180px;margin:0 auto;padding:7px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%')}>
          <span>Tận tâm, tận lòng · Giao nhanh trong 2 giờ nội thành</span>
          <span style={s('display:flex;gap:18px')}>
            <span>Hotline: 1900 16 16</span>
            <span>Theo dõi đơn hàng</span>
          </span>
        </div>
      </div>
      <header style={s('position:sticky;top:0;z-index:30;background:#fff;box-shadow:0 1px 0 #e4ece7')}>
        <div style={s('max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;gap:22px;width:100%')}>
          <div onClick={goHome} style={s('display:flex;align-items:center;gap:11px;cursor:pointer;flex-shrink:0')}>
            <div style={s('width:42px;height:42px;background:#2e9e5b;border-radius:12px;position:relative;flex-shrink:0')}>
              <div style={s('position:absolute;left:38%;top:20%;width:24%;height:60%;background:#fff;border-radius:4px')} />
              <div style={s('position:absolute;top:38%;left:20%;height:24%;width:60%;background:#fff;border-radius:4px')} />
            </div>
            <div style={s('line-height:1.1')}>
              <div style={s('font-size:19px;font-weight:800;color:#14532d')}>
                Quầy thuốc <span style={s('color:#2e9e5b')}>16</span>
              </div>
              <div style={s('font-size:11px;color:#8a948e;font-weight:500')}>Tận tâm, tận lòng</div>
            </div>
          </div>
          <div style={s('flex:1;display:flex;align-items:center;background:#f1f6f3;border:1.5px solid #e0ebe4;border-radius:12px;padding:0 6px 0 14px;max-width:560px')}>
            <span style={s('color:#8a948e;font-size:16px')}>⌕</span>
            <input
              value={sst.query}
              onChange={(e) => set({ query: e.target.value })}
              onKeyDown={onQueryKey}
              placeholder="Tìm thuốc, thực phẩm chức năng, thiết bị y tế..."
              style={s('flex:1;border:none;background:transparent;outline:none;padding:11px 10px;font-size:14px;color:#1f2a24')}
            />
            <button onClick={doSearch} style={s('border:none;background:#2e9e5b;color:#fff;padding:8px 18px;border-radius:9px;font-weight:600;font-size:14px;cursor:pointer')}>
              Tìm
            </button>
          </div>
          <button onClick={openRx} style={s('display:flex;align-items:center;gap:7px;border:1.5px solid #2e9e5b;background:#fff;color:#1c7a45;padding:9px 14px;border-radius:11px;font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0')}>
            📋 Đặt thuốc theo toa
          </button>
          <button onClick={goCart} style={s('position:relative;display:flex;align-items:center;gap:8px;background:#eaf6ef;border:none;color:#14532d;padding:9px 15px;border-radius:11px;font-weight:600;font-size:13.5px;cursor:pointer;flex-shrink:0')}>
            <span style={s('font-size:17px')}>🛒</span> Giỏ hàng
            {cc > 0 ? (
              <span style={s('position:absolute;top:-6px;right:-6px;background:#e8654e;color:#fff;font-size:11px;font-weight:700;min-width:20px;height:20px;border-radius:11px;display:flex;align-items:center;justify-content:center;padding:0 5px')}>{cc}</span>
            ) : null}
          </button>
          <AuthMenu variant="light" />
        </div>
        <nav style={s('border-top:1px solid #eef3f0')}>
          <div style={s('max-width:1180px;margin:0 auto;padding:0 24px;display:flex;gap:26px;width:100%')}>
            {navLinks.map((n, i) => (
              <div key={i} onClick={n.onClick} style={n.style}>
                {n.label}
              </div>
            ))}
          </div>
        </nav>
      </header>

      <main style={s('flex:1')}>
        {/* ============ HOME ============ */}
        {sst.screen === 'home' ? (
          <div>
            {/* HERO A */}
            <div style={s('max-width:1180px;margin:16px auto 0;padding:0 24px;width:100%')}>
                <div style={s('background:#eaf7ef;border-radius:22px;padding:48px 52px;display:flex;align-items:center;gap:40px;overflow:hidden')}>
                  <div style={s('flex:1;min-width:0')}>
                    <div style={s('display:inline-block;background:#fff;color:#1c7a45;font-size:12.5px;font-weight:600;padding:6px 13px;border-radius:20px;margin-bottom:16px')}>Nhà thuốc trực tuyến · Chính hãng 100%</div>
                    <h1 style={s('font-size:42px;line-height:1.12;font-weight:800;color:#14532d;margin:0 0 14px')}>
                      Chăm sóc sức khỏe
                      <br />
                      cho cả gia đình bạn
                    </h1>
                    <p style={s('font-size:16px;color:#4a564e;margin:0 0 26px;max-width:440px;line-height:1.6')}>Hơn 5.000 sản phẩm thuốc, thực phẩm chức năng và thiết bị y tế. Dược sĩ tư vấn miễn phí, giao tận nơi.</p>
                    <div style={s('display:flex;gap:12px;flex-wrap:wrap')}>
                      <button onClick={() => goCatScreen('thuoc')} style={s('background:#2e9e5b;color:#fff;border:none;padding:14px 26px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Mua thuốc ngay</button>
                      <button onClick={openRx} style={s('background:#fff;color:#1c7a45;border:1.5px solid #cfe6da;padding:14px 24px;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer')}>Đặt thuốc theo toa</button>
                    </div>
                    <div style={s('display:flex;gap:26px;margin-top:30px')}>
                      <div><div style={s('font-size:22px;font-weight:800;color:#14532d')}>5.000+</div><div style={s('font-size:12.5px;color:#8a948e')}>Sản phẩm</div></div>
                      <div><div style={s('font-size:22px;font-weight:800;color:#14532d')}>2 giờ</div><div style={s('font-size:12.5px;color:#8a948e')}>Giao nội thành</div></div>
                      <div><div style={s('font-size:22px;font-weight:800;color:#14532d')}>24/7</div><div style={s('font-size:12.5px;color:#8a948e')}>Dược sĩ tư vấn</div></div>
                    </div>
                  </div>
                  <div style={s('width:340px;flex-shrink:0;background:repeating-linear-gradient(135deg,#d7eede,#d7eede 11px,#cde7d6 11px,#cde7d6 22px);border-radius:18px;height:300px;display:flex;align-items:center;justify-content:center;color:#5a8a6e;font:600 12px ui-monospace,monospace;text-align:center')}>
                    ảnh hero
                    <br />
                    (sản phẩm / dược sĩ)
                  </div>
                </div>
              </div>
            {/* category cards */}
            <div style={s('max-width:1180px;margin:46px auto 0;padding:0 24px;width:100%')}>
              <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0 0 18px')}>Danh mục sản phẩm</h2>
              <div style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:14px')}>
                {catCards.map((c, i) => (
                  <div key={i} onClick={c.onClick} className="qt-card" style={s('background:#fff;border:1px solid #e7efe9;border-radius:18px;padding:24px;cursor:pointer;display:flex;align-items:center;gap:18px;transition:box-shadow .15s')}>
                    <div style={{ ...s('width:62px;height:62px;border-radius:16px;position:relative;flex-shrink:0'), background: c.tintBg }}>
                      <div style={{ ...s('position:absolute;left:38%;top:24%;width:24%;height:52%;border-radius:5px'), background: c.tintFg }} />
                      <div style={{ ...s('position:absolute;top:38%;left:24%;height:24%;width:52%;border-radius:5px'), background: c.tintFg }} />
                    </div>
                    <div>
                      <div style={s('font-size:17px;font-weight:700;color:#1f2a24')}>{c.label}</div>
                      <div style={s('font-size:13px;color:#8a948e;margin-top:3px')}>{c.desc}</div>
                      <div style={s('font-size:12.5px;color:#2e9e5b;font-weight:600;margin-top:8px')}>{c.countText} →</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* best sellers */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
                <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>🔥 Bán chạy nhất</h2>
                <span onClick={() => goCatScreen('thuoc')} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>Xem tất cả →</span>
              </div>
              <div style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
                {bestSellers.map((c, i) => (
                  <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                ))}
              </div>
            </div>

            {/* combos */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0 0 18px')}>💚 Combo tiết kiệm</h2>
              <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
                {combos.map((k, i) => (
                  <div key={i} style={s('background:#fff;border:1px solid #e7efe9;border-radius:18px;overflow:hidden;display:flex;flex-direction:column')}>
                    <div style={s('background:#2e9e5b;color:#fff;padding:9px 18px;font-size:13px;font-weight:600;display:flex;justify-content:space-between')}><span>{k.tag}</span><span>{k.saveText}</span></div>
                    <div style={s('padding:20px;display:flex;flex-direction:column;gap:12px;flex:1')}>
                      <div style={s('font-size:17px;font-weight:700;color:#14532d')}>{k.title}</div>
                      <div style={s('display:flex;flex-direction:column;gap:7px;flex:1')}>
                        {k.items.map((it, j) => (
                          <div key={j} style={s('font-size:13.5px;color:#4a564e;display:flex;gap:8px')}><span style={s('color:#2e9e5b')}>✓</span>{it}</div>
                        ))}
                      </div>
                      <div style={s('display:flex;align-items:flex-end;justify-content:space-between;margin-top:6px')}>
                        <div><div style={s('font-size:20px;font-weight:800;color:#1c7a45')}>{k.priceText}</div><div style={s('font-size:12.5px;color:#b3bdb6;text-decoration:line-through')}>{k.oldPriceText}</div></div>
                        <button onClick={k.onAdd} style={s('background:#eaf6ef;color:#1c7a45;border:none;padding:11px 18px;border-radius:10px;font-weight:700;font-size:13.5px;cursor:pointer')}>Mua combo</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* supplements */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
                <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>Thực phẩm chức năng nổi bật</h2>
                <span onClick={() => goCatScreen('tpcn')} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>Xem tất cả →</span>
              </div>
              <div style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
                {supps.map((c, i) => (
                  <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                ))}
              </div>
            </div>

            {/* skincare */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
                <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>✨ Chăm sóc da</h2>
                <span onClick={() => goCatScreen('skincare')} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>Xem tất cả →</span>
              </div>
              <div style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
                {skincare.map((c, i) => (
                  <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                ))}
              </div>
            </div>

            {/* prescription band */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('background:#eaf7ef;border-radius:20px;padding:36px 44px;display:flex;align-items:center;justify-content:space-between;gap:30px;flex-wrap:wrap')}>
                <div style={s('display:flex;align-items:center;gap:22px')}>
                  <div style={s('font-size:46px')}>📋</div>
                  <div><div style={s('font-size:24px;font-weight:800;color:#14532d')}>Có toa của bác sĩ?</div><div style={s('font-size:15px;color:#4a564e;margin-top:6px')}>Chụp ảnh toa thuốc, dược sĩ soạn đơn và giao tận nhà cho bạn.</div></div>
                </div>
                <button onClick={openRx} style={s('background:#2e9e5b;color:#fff;border:none;padding:15px 30px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Đặt thuốc theo toa</button>
              </div>
            </div>

            {/* devices */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
                <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>Thiết bị y tế</h2>
                <span onClick={() => goCatScreen('thietbi')} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>Xem tất cả →</span>
              </div>
              <div style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
                {devices.map((c, i) => (
                  <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                ))}
              </div>
            </div>

            {/* news */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('display:flex;align-items:center;justify-content:space-between;margin-bottom:18px')}>
                <h2 style={s('font-size:22px;font-weight:700;color:#14532d;margin:0')}>📰 Tin tức sức khỏe</h2>
                <span onClick={goNews} style={s('font-size:13.5px;color:#2e9e5b;font-weight:600;cursor:pointer')}>Xem tất cả →</span>
              </div>
              <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
                {newsHome.map((a, i) => (
                  <div key={i} onClick={a.onClick} className="qt-card" style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column')}>
                    <div style={{ ...s('aspect-ratio:16 / 9;position:relative;display:flex;align-items:center;justify-content:center'), background: a.tintBg }}>
                      <div style={{ ...s('font:600 11px ui-monospace,monospace'), color: a.tintFg }}>ảnh bài viết</div>
                      <div style={{ ...s('position:absolute;top:12px;left:12px;background:#fff;font-size:11px;font-weight:600;padding:4px 11px;border-radius:20px'), color: a.tintFg }}>{a.tag}</div>
                    </div>
                    <div style={s('padding:18px;display:flex;flex-direction:column;gap:8px;flex:1')}>
                      <div style={s('font-size:16px;font-weight:700;color:#14532d;line-height:1.35')}>{a.title}</div>
                      <div style={s('font-size:13px;color:#6b7770;line-height:1.55;flex:1')}>{a.excerpt}</div>
                      <div style={s('font-size:12px;color:#9aa8a0;margin-top:4px')}>{a.date} · Dược sĩ Quầy thuốc 16</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* trust strip */}
            <div style={s('max-width:1180px;margin:44px auto 0;padding:0 24px;width:100%')}>
              <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:18px;padding:26px;display:grid;grid-template-columns:repeat(4,1fr);gap:18px')}>
                {trustBadges.map((t, i) => (
                  <div key={i} style={s('display:flex;align-items:center;gap:13px')}>
                    <div style={s('width:46px;height:46px;background:#eaf6ef;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#2e9e5b;font-size:20px;flex-shrink:0')}>{t.icon}</div>
                    <div><div style={s('font-size:14px;font-weight:700;color:#1f2a24')}>{t.title}</div><div style={s('font-size:12.5px;color:#8a948e')}>{t.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* ============ CATEGORY ============ */}
        {sst.screen === 'category' ? (
          <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
            <div style={s('font-size:13px;color:#8a948e;margin-bottom:14px')}><span onClick={goHome} style={s('cursor:pointer;color:#2e9e5b')}>Trang chủ</span> / {catTitle}</div>
            <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 6px')}>{catTitle}</h1>
            <div style={s('font-size:14px;color:#8a948e;margin-bottom:22px')}>{results.length} sản phẩm</div>
            <div style={s('display:grid;grid-template-columns:240px 1fr;gap:26px;align-items:start')}>
              <aside style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:20px;position:sticky;top:140px')}>
                <div style={s('font-size:14px;font-weight:700;color:#14532d;margin-bottom:12px')}>Danh mục</div>
                <div style={s('display:flex;flex-direction:column;gap:7px;margin-bottom:22px')}>
                  {catTabs.map((t, i) => (
                    <div key={i} onClick={t.onClick} style={t.style}>{t.label}</div>
                  ))}
                </div>
                <div style={s('font-size:14px;font-weight:700;color:#14532d;margin-bottom:12px')}>Lọc theo công dụng</div>
                <div style={s('display:flex;flex-wrap:wrap;gap:8px')}>
                  {useChips.map((u, i) => (
                    <button key={i} onClick={u.onClick} style={u.style}>{u.label}</button>
                  ))}
                </div>
              </aside>
              <div>
                <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap')}>
                  <span style={s('font-size:13.5px;color:#8a948e;font-weight:600')}>Sắp xếp:</span>
                  {sortBtns.map((so, i) => (
                    <button key={i} onClick={so.onClick} style={so.style}>{so.label}</button>
                  ))}
                </div>
                {results.length > 0 ? (
                  <div style={s('display:grid;grid-template-columns:repeat(4,1fr);gap:16px')}>
                    {results.map((c, i) => (
                      <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                    ))}
                  </div>
                ) : (
                  <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:60px;text-align:center')}><div style={s('font-size:40px;margin-bottom:10px')}>🔍</div><div style={s('font-size:16px;font-weight:600;color:#4a564e')}>Không tìm thấy sản phẩm phù hợp</div><div style={s('font-size:13.5px;color:#9aa8a0;margin-top:6px')}>Hãy thử bỏ bớt bộ lọc</div></div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* ============ SEARCH ============ */}
        {sst.screen === 'search' ? (
          <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
            <h1 style={s('font-size:24px;font-weight:800;color:#14532d;margin:0 0 6px')}>Kết quả cho &quot;{sst.query}&quot;</h1>
            <div style={s('font-size:14px;color:#8a948e;margin-bottom:22px')}>{searchResults.length} sản phẩm</div>
            {searchResults.length > 0 ? (
              <div style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
                {searchResults.map((c, i) => (
                  <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                ))}
              </div>
            ) : (
              <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:60px;text-align:center')}><div style={s('font-size:40px;margin-bottom:10px')}>🔍</div><div style={s('font-size:16px;font-weight:600;color:#4a564e')}>Không tìm thấy &quot;{sst.query}&quot;</div><div style={s('font-size:13.5px;color:#9aa8a0;margin-top:6px')}>Kiểm tra chính tả hoặc thử từ khóa khác</div></div>
            )}
          </div>
        ) : null}

        {/* ============ NEWS ============ */}
        {sst.screen === 'news' ? (
          <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
            <div style={s('font-size:13px;color:#8a948e;margin-bottom:14px')}><span onClick={goHome} style={s('cursor:pointer;color:#2e9e5b')}>Trang chủ</span> / Tin tức</div>
            <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 6px')}>Tin tức sức khỏe</h1>
            <div style={s('font-size:14px;color:#8a948e;margin-bottom:24px')}>Kiến thức và lời khuyên từ đội ngũ dược sĩ Quầy thuốc 16</div>
            <div style={s('display:grid;grid-template-columns:repeat(3,1fr);gap:18px')}>
              {newsList.map((a, i) => (
                <div key={i} onClick={a.onClick} className="qt-card" style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;flex-direction:column')}>
                  <div style={{ ...s('aspect-ratio:16 / 9;position:relative;display:flex;align-items:center;justify-content:center'), background: a.tintBg }}>
                    <div style={{ ...s('font:600 11px ui-monospace,monospace'), color: a.tintFg }}>ảnh bài viết</div>
                    <div style={{ ...s('position:absolute;top:12px;left:12px;background:#fff;font-size:11px;font-weight:600;padding:4px 11px;border-radius:20px'), color: a.tintFg }}>{a.tag}</div>
                  </div>
                  <div style={s('padding:18px;display:flex;flex-direction:column;gap:8px;flex:1')}>
                    <div style={s('font-size:16px;font-weight:700;color:#14532d;line-height:1.35')}>{a.title}</div>
                    <div style={s('font-size:13px;color:#6b7770;line-height:1.55;flex:1')}>{a.excerpt}</div>
                    <div style={s('font-size:12px;color:#9aa8a0;margin-top:4px')}>{a.date} · Dược sĩ Quầy thuốc 16</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ============ ARTICLE ============ */}
        {sst.screen === 'article' ? (
          <div style={s('max-width:760px;margin:0 auto;padding:24px;width:100%')}>
            <div style={s('font-size:13px;color:#8a948e;margin-bottom:16px')}><span onClick={goHome} style={s('cursor:pointer;color:#2e9e5b')}>Trang chủ</span> / <span onClick={goNews} style={s('cursor:pointer;color:#2e9e5b')}>Tin tức</span> / {article.tag}</div>
            <div style={s('display:inline-block;background:#eaf6ef;color:#1c7a45;font-size:12px;font-weight:600;padding:5px 13px;border-radius:20px;margin-bottom:14px')}>{article.tag}</div>
            <h1 style={s('font-size:30px;font-weight:800;color:#14532d;margin:0 0 12px;line-height:1.25')}>{article.title}</h1>
            <div style={s('font-size:13px;color:#9aa8a0;margin-bottom:22px')}>{article.date} · Dược sĩ Quầy thuốc 16</div>
            <div style={{ ...s('aspect-ratio:16 / 9;border-radius:18px;display:flex;align-items:center;justify-content:center;margin-bottom:26px;font:600 12px ui-monospace,monospace'), background: article.tintBg, color: article.tintFg }}>ảnh minh họa bài viết</div>
            <div style={s('display:flex;flex-direction:column;gap:18px')}>
              {article.body.map((para, i) => (
                <p key={i} style={s('font-size:16px;line-height:1.75;color:#3a4a42;margin:0')}>{para}</p>
              ))}
            </div>
            <div style={s('margin-top:30px')}><button onClick={goNews} style={s('background:#eaf6ef;color:#1c7a45;border:none;padding:12px 24px;border-radius:11px;font-weight:600;font-size:14px;cursor:pointer')}>← Quay lại tin tức</button></div>
          </div>
        ) : null}

        {/* ============ PRODUCT DETAIL ============ */}
        {sst.screen === 'product' ? (
          <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
            <div style={s('font-size:13px;color:#8a948e;margin-bottom:18px')}><span onClick={goHome} style={s('cursor:pointer;color:#2e9e5b')}>Trang chủ</span> / <span onClick={d.onCat} style={s('cursor:pointer;color:#2e9e5b')}>{d.catLabel}</span> / {d.name}</div>
            <div style={s('display:grid;grid-template-columns:440px 1fr;gap:36px;align-items:start')}>
              <div style={{ ...s('border-radius:20px;aspect-ratio:1 / 1;display:flex;align-items:center;justify-content:center;position:relative'), background: d.tintBg }}>
                {d.badge ? <div style={s('position:absolute;top:16px;left:16px;background:#e8654e;color:#fff;font-size:13px;font-weight:600;padding:5px 14px;border-radius:20px')}>{d.badge}</div> : null}
                <div style={s('width:34%;height:34%;position:relative;opacity:.92')}><div style={{ ...s('position:absolute;left:36%;top:0;width:28%;height:100%;border-radius:12px'), background: d.tintFg }} /><div style={{ ...s('position:absolute;top:36%;left:0;height:28%;width:100%;border-radius:12px'), background: d.tintFg }} /></div>
              </div>
              <div>
                <div style={{ ...s('font-size:13px;font-weight:600;margin-bottom:8px'), color: d.tintFg }}>{d.catLabel} · {d.brand}</div>
                <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 12px;line-height:1.2')}>{d.name}</h1>
                <div style={s('display:flex;align-items:center;gap:8px;font-size:14px;color:#8a948e;margin-bottom:18px')}><span style={s('color:#f1a821')}>★★★★★</span><span style={s('color:#5a655e;font-weight:600')}>{d.ratingText}</span><span>· {d.reviewsText}</span></div>
                <div style={s('display:flex;align-items:flex-end;gap:14px;background:#f6faf7;border-radius:14px;padding:18px 22px;margin-bottom:22px')}>
                  <div style={s('font-size:30px;font-weight:800;color:#1c7a45')}>{d.priceText}</div>
                  {d.oldPriceText ? <div style={s('font-size:16px;color:#b3bdb6;text-decoration:line-through;padding-bottom:5px')}>{d.oldPriceText}</div> : null}
                  {d.discountText ? <div style={s('background:#fde8e3;color:#c44a32;font-size:13px;font-weight:700;padding:3px 10px;border-radius:8px;margin-bottom:6px')}>{d.discountText}</div> : null}
                </div>
                <div style={s('display:flex;flex-direction:column;gap:9px;margin-bottom:24px')}>
                  <div style={s('display:flex;gap:10px;font-size:14px;color:#4a564e')}><span style={s('color:#9aa8a0;min-width:90px')}>Quy cách</span><span style={s('font-weight:600;color:#2a352e')}>{d.unit}</span></div>
                  <div style={s('display:flex;gap:10px;font-size:14px;color:#4a564e')}><span style={s('color:#9aa8a0;min-width:90px')}>Công dụng</span><span style={s('font-weight:600;color:#2a352e')}>{d.usesText}</span></div>
                  <div style={s('display:flex;gap:10px;font-size:14px;color:#4a564e')}><span style={s('color:#9aa8a0;min-width:90px')}>Xuất xứ</span><span style={s('font-weight:600;color:#2a352e')}>Chính hãng, có hóa đơn</span></div>
                </div>
                <div style={s('display:flex;align-items:center;gap:16px')}>
                  <div style={s('display:flex;align-items:center;border:1.5px solid #e0ebe4;border-radius:11px;overflow:hidden')}>
                    <button onClick={d.dec} style={s('border:none;background:#f1f6f3;width:42px;height:46px;font-size:20px;cursor:pointer;color:#1c7a45')}>−</button>
                    <div style={s('width:48px;text-align:center;font-size:16px;font-weight:700')}>{sst.detailQty}</div>
                    <button onClick={d.inc} style={s('border:none;background:#f1f6f3;width:42px;height:46px;font-size:20px;cursor:pointer;color:#1c7a45')}>+</button>
                  </div>
                  <button onClick={d.add} style={s('flex:1;background:#fff;color:#1c7a45;border:1.5px solid #2e9e5b;padding:14px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Thêm vào giỏ</button>
                  <button onClick={d.buyNow} style={s('flex:1;background:#2e9e5b;color:#fff;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Mua ngay</button>
                </div>
                <div style={s('margin-top:24px;padding:18px 20px;background:#f6faf7;border-radius:14px;font-size:14px;color:#4a564e;line-height:1.65')}>{d.desc}</div>
              </div>
            </div>

            {/* reviews */}
            <div style={s('margin-top:44px')}>
              <h2 style={s('font-size:20px;font-weight:700;color:#14532d;margin:0 0 18px')}>Đánh giá sản phẩm</h2>
              <div style={s('display:grid;grid-template-columns:240px 1fr;gap:26px;align-items:start')}>
                <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:24px;text-align:center')}>
                  <div style={s('font-size:42px;font-weight:800;color:#1c7a45')}>{d.ratingText}</div>
                  <div style={s('color:#f1a821;font-size:18px;margin:6px 0')}>★★★★★</div>
                  <div style={s('font-size:13px;color:#8a948e')}>{d.reviewsText}</div>
                </div>
                <div style={s('display:flex;flex-direction:column;gap:14px')}>
                  {reviews.map((r, i) => (
                    <div key={i} style={s('background:#fff;border:1px solid #e7efe9;border-radius:14px;padding:18px')}>
                      <div style={s('display:flex;align-items:center;gap:11px;margin-bottom:8px')}><div style={s('width:36px;height:36px;border-radius:50%;background:#eaf6ef;display:flex;align-items:center;justify-content:center;font-weight:700;color:#2e9e5b;font-size:14px')}>{r.initial}</div><div><div style={s('font-size:14px;font-weight:700;color:#2a352e')}>{r.name}</div><div style={s('font-size:11.5px;color:#9aa8a0')}>{r.date}</div></div><div style={s('margin-left:auto;color:#f1a821;font-size:13px')}>{r.stars}</div></div>
                      <div style={s('font-size:13.5px;color:#4a564e;line-height:1.6')}>{r.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* related */}
            <div style={s('margin-top:44px')}>
              <h2 style={s('font-size:20px;font-weight:700;color:#14532d;margin:0 0 18px')}>Sản phẩm liên quan</h2>
              <div style={s('display:grid;grid-template-columns:repeat(5,1fr);gap:16px')}>
                {related.map((c, i) => (
                  <ProductCard key={i} p={c.p} onView={c.onView} onAdd={c.onAdd} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* ============ CART ============ */}
        {sst.screen === 'cart' ? (
          <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
            <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 22px')}>Giỏ hàng</h1>
            {cc > 0 ? (
              <div style={s('display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start')}>
                <div style={s('display:flex;flex-direction:column;gap:14px')}>
                  {cartView.map((c, i) => (
                    <div key={i} style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:16px;display:flex;align-items:center;gap:16px')}>
                      <div onClick={c.onView} style={{ ...s('width:80px;height:80px;border-radius:12px;position:relative;flex-shrink:0;cursor:pointer'), background: c.tintBg }}><div style={{ ...s('position:absolute;left:38%;top:24%;width:24%;height:52%;border-radius:5px'), background: c.tintFg }} /><div style={{ ...s('position:absolute;top:38%;left:24%;height:24%;width:52%;border-radius:5px'), background: c.tintFg }} /></div>
                      <div style={s('flex:1;min-width:0')}><div style={{ ...s('font-size:11px;font-weight:600'), color: c.tintFg }}>{c.catLabel}</div><div onClick={c.onView} style={s('font-size:15px;font-weight:600;color:#1f2a24;cursor:pointer;margin:2px 0 4px')}>{c.name}</div><div style={s('font-size:15px;font-weight:700;color:#1c7a45')}>{c.priceText}</div></div>
                      <div style={s('display:flex;align-items:center;border:1.5px solid #e0ebe4;border-radius:10px;overflow:hidden')}><button onClick={c.dec} style={s('border:none;background:#f1f6f3;width:34px;height:38px;font-size:18px;cursor:pointer;color:#1c7a45')}>−</button><div style={s('width:40px;text-align:center;font-weight:700;font-size:15px')}>{c.qty}</div><button onClick={c.inc} style={s('border:none;background:#f1f6f3;width:34px;height:38px;font-size:18px;cursor:pointer;color:#1c7a45')}>+</button></div>
                      <div style={s('width:110px;text-align:right;font-size:16px;font-weight:700;color:#14532d')}>{c.lineText}</div>
                      <button onClick={c.remove} style={s('border:none;background:transparent;color:#c0c9c3;font-size:20px;cursor:pointer;padding:6px')}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:24px;position:sticky;top:140px')}>
                  <div style={s('font-size:17px;font-weight:700;color:#14532d;margin-bottom:18px')}>Tóm tắt đơn hàng</div>
                  <div style={s('display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:11px')}><span>Tạm tính</span><span style={s('font-weight:600')}>{subtotalText}</span></div>
                  <div style={s('display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:11px')}><span>Phí giao hàng</span><span style={s('font-weight:600')}>{shipText}</span></div>
                  {freeshipHint ? <div style={s('background:#eaf7ef;color:#1c7a45;font-size:12.5px;padding:9px 12px;border-radius:9px;margin-bottom:11px')}>{freeshipHint}</div> : null}
                  <div style={s('border-top:1px solid #eef3f0;margin:14px 0;padding-top:14px;display:flex;justify-content:space-between;align-items:center')}><span style={s('font-size:16px;font-weight:700;color:#14532d')}>Tổng cộng</span><span style={s('font-size:22px;font-weight:800;color:#1c7a45')}>{totalText}</span></div>
                  <button onClick={goCheckout} style={s('width:100%;background:#2e9e5b;color:#fff;border:none;padding:15px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;margin-top:8px')}>Tiến hành thanh toán</button>
                  <button onClick={goHome} style={s('width:100%;background:transparent;color:#8a948e;border:none;padding:12px;font-size:13.5px;cursor:pointer;margin-top:4px')}>Tiếp tục mua sắm</button>
                </div>
              </div>
            ) : (
              <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:70px;text-align:center')}><div style={s('font-size:48px;margin-bottom:14px')}>🛒</div><div style={s('font-size:17px;font-weight:600;color:#4a564e')}>Giỏ hàng của bạn đang trống</div><button onClick={goHome} style={s('margin-top:18px;background:#2e9e5b;color:#fff;border:none;padding:13px 28px;border-radius:11px;font-weight:700;font-size:14px;cursor:pointer')}>Mua sắm ngay</button></div>
            )}
          </div>
        ) : null}

        {/* ============ CHECKOUT ============ */}
        {sst.screen === 'checkout' ? (
          <div style={s('max-width:1180px;margin:0 auto;padding:24px;width:100%')}>
            <div style={s('font-size:13px;color:#8a948e;margin-bottom:14px')}><span onClick={goCart} style={s('cursor:pointer;color:#2e9e5b')}>Giỏ hàng</span> / Thanh toán</div>
            <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 22px')}>Thanh toán</h1>
            <div style={s('display:grid;grid-template-columns:1fr 360px;gap:26px;align-items:start')}>
              <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:26px')}>
                <div style={s('font-size:16px;font-weight:700;color:#14532d;margin-bottom:18px')}>Thông tin nhận hàng</div>
                <div style={s('display:flex;flex-direction:column;gap:14px')}>
                  <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Họ và tên *</label><input value={sst.form.name} onChange={(e) => setForm('name', e.target.value)} placeholder="Nguyễn Văn A" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
                  <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Số điện thoại *</label><input value={sst.form.phone} onChange={(e) => setForm('phone', e.target.value)} placeholder="09xx xxx xxx" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
                  <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Địa chỉ giao hàng *</label><input value={sst.form.address} onChange={(e) => setForm('address', e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
                  <div><label style={s('font-size:13px;font-weight:600;color:#4a564e;display:block;margin-bottom:6px')}>Ghi chú (tùy chọn)</label><input value={sst.form.note} onChange={(e) => setForm('note', e.target.value)} placeholder="Thời gian giao, lưu ý cho dược sĩ..." style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:12px 14px;font-size:14px;outline:none')} /></div>
                </div>
                <div style={s('font-size:16px;font-weight:700;color:#14532d;margin:26px 0 14px')}>Phương thức thanh toán</div>
                <div style={s('display:flex;flex-direction:column;gap:10px')}>
                  {payOptions.map((p, i) => (
                    <div key={i} onClick={p.onClick} style={p.style}><div style={{ ...s('width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center'), border: '2px solid ' + p.dot }}><div style={{ ...s('width:10px;height:10px;border-radius:50%'), background: p.dotFill }} /></div><div><div style={s('font-size:14px;font-weight:600;color:#2a352e')}>{p.label}</div><div style={s('font-size:12px;color:#8a948e')}>{p.desc}</div></div></div>
                  ))}
                </div>
              </div>
              <div style={s('background:#fff;border:1px solid #e7efe9;border-radius:16px;padding:24px;position:sticky;top:140px')}>
                <div style={s('font-size:17px;font-weight:700;color:#14532d;margin-bottom:16px')}>Đơn hàng ({cc})</div>
                <div style={s('display:flex;flex-direction:column;gap:10px;margin-bottom:16px;max-height:200px;overflow:auto')}>
                  {cartView.map((c, i) => (
                    <div key={i} style={s('display:flex;justify-content:space-between;gap:10px;font-size:13px')}><span style={s('color:#4a564e')}>{c.name} <span style={s('color:#9aa8a0')}>×{c.qty}</span></span><span style={s('font-weight:600;color:#14532d;white-space:nowrap')}>{c.lineText}</span></div>
                  ))}
                </div>
                <div style={s('border-top:1px solid #eef3f0;padding-top:14px;display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:10px')}><span>Tạm tính</span><span style={s('font-weight:600')}>{subtotalText}</span></div>
                <div style={s('display:flex;justify-content:space-between;font-size:14px;color:#4a564e;margin-bottom:10px')}><span>Phí giao hàng</span><span style={s('font-weight:600')}>{shipText}</span></div>
                <div style={s('border-top:1px solid #eef3f0;margin-top:10px;padding-top:14px;display:flex;justify-content:space-between;align-items:center')}><span style={s('font-size:16px;font-weight:700;color:#14532d')}>Tổng cộng</span><span style={s('font-size:22px;font-weight:800;color:#1c7a45')}>{totalText}</span></div>
                <button onClick={placeOrder} style={s('width:100%;background:#2e9e5b;color:#fff;border:none;padding:15px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;margin-top:16px')}>Đặt hàng</button>
              </div>
            </div>
          </div>
        ) : null}

        {/* ============ DONE ============ */}
        {sst.screen === 'done' ? (
          <div style={s('max-width:560px;margin:60px auto;padding:24px;width:100%;text-align:center')}>
            <div style={s('width:88px;height:88px;background:#eaf7ef;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 22px;font-size:42px')}>✓</div>
            <h1 style={s('font-size:28px;font-weight:800;color:#14532d;margin:0 0 10px')}>Đặt hàng thành công!</h1>
            <p style={s('font-size:15px;color:#4a564e;margin:0 0 8px;line-height:1.6')}>Cảm ơn bạn đã tin tưởng Quầy thuốc 16. Dược sĩ sẽ gọi xác nhận trong ít phút.</p>
            <div style={s('display:inline-block;background:#f6faf7;border:1px solid #e7efe9;border-radius:12px;padding:14px 26px;margin:14px 0 26px')}><span style={s('font-size:13px;color:#8a948e')}>Mã đơn hàng: </span><span style={s('font-size:16px;font-weight:800;color:#1c7a45')}>{sst.ordered}</span></div>
            <div><button onClick={goHome} style={s('background:#2e9e5b;color:#fff;border:none;padding:14px 30px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer')}>Tiếp tục mua sắm</button></div>
          </div>
        ) : null}
      </main>

      {/* ============ FOOTER ============ */}
      <footer style={s('background:#14532d;color:#a9d6ba;margin-top:54px')}>
        <div style={s('max-width:1180px;margin:0 auto;padding:42px 24px 30px;width:100%;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:32px')}>
          <div>
            <div style={s('display:flex;align-items:center;gap:10px;margin-bottom:14px')}><div style={s('width:36px;height:36px;background:#2e9e5b;border-radius:10px;position:relative')}><div style={s('position:absolute;left:38%;top:22%;width:24%;height:56%;background:#fff;border-radius:3px')} /><div style={s('position:absolute;top:38%;left:22%;height:24%;width:56%;background:#fff;border-radius:3px')} /></div><div style={s('font-size:17px;font-weight:800;color:#fff')}>Quầy thuốc 16</div></div>
            <div style={s('font-size:13.5px;line-height:1.7')}>Tận tâm, tận lòng.<br />Hệ thống nhà thuốc đạt chuẩn GPP, cam kết thuốc chính hãng, tư vấn bởi dược sĩ.</div>
          </div>
          <div><div style={s('font-size:14px;font-weight:700;color:#fff;margin-bottom:14px')}>Danh mục</div><div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}><span onClick={() => goCatScreen('thuoc')} style={s('cursor:pointer')}>Thuốc</span><span onClick={() => goCatScreen('tpcn')} style={s('cursor:pointer')}>Thực phẩm chức năng</span><span onClick={() => goCatScreen('thietbi')} style={s('cursor:pointer')}>Thiết bị y tế</span></div></div>
          <div><div style={s('font-size:14px;font-weight:700;color:#fff;margin-bottom:14px')}>Hỗ trợ</div><div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}><span>Tư vấn dược sĩ</span><span onClick={openRx} style={s('cursor:pointer')}>Đặt thuốc theo toa</span><span>Chính sách đổi trả</span><span>Hướng dẫn mua hàng</span></div></div>
          <div><div style={s('font-size:14px;font-weight:700;color:#fff;margin-bottom:14px')}>Liên hệ</div><div style={s('display:flex;flex-direction:column;gap:9px;font-size:13.5px')}><span>Hotline: 1900 16 16</span><span>cskh@quaythuoc16.vn</span><span>16 Đường Sức Khỏe, Q.1, TP.HCM</span></div></div>
        </div>
        <div style={s('border-top:1px solid rgba(255,255,255,.12)')}><div style={s('max-width:1180px;margin:0 auto;padding:16px 24px;font-size:12.5px;color:#7fb592')}>© 2026 Quầy thuốc 16. Sản phẩm này là bản thiết kế mẫu.</div></div>
      </footer>

      {/* ============ TOAST ============ */}
      {sst.toast ? (
        <div style={s('position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#14532d;color:#fff;padding:13px 24px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.22);z-index:60;animation:qtToast .25s ease;display:flex;align-items:center;gap:9px')}><span style={s('color:#7be0a0')}>✓</span>{sst.toast}</div>
      ) : null}

      {/* ============ RX MODAL ============ */}
      {sst.showRx ? (
        <div onClick={closeRx} style={s('position:fixed;inset:0;background:rgba(20,40,30,.55);z-index:70;display:flex;align-items:center;justify-content:center;padding:24px;animation:qtFade .2s ease')}>
          <div onClick={(e) => e.stopPropagation()} style={s('background:#fff;border-radius:20px;padding:30px;width:480px;max-width:100%;animation:qtModal .25s ease')}>
            <div style={s('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px')}><h2 style={s('font-size:21px;font-weight:800;color:#14532d;margin:0')}>Đặt thuốc theo toa</h2><button onClick={closeRx} style={s('border:none;background:#f1f6f3;width:32px;height:32px;border-radius:9px;font-size:16px;cursor:pointer;color:#8a948e')}>✕</button></div>
            <p style={s('font-size:13.5px;color:#8a948e;margin:0 0 20px;line-height:1.6')}>Chụp hoặc tải ảnh toa thuốc. Dược sĩ sẽ soạn đơn và liên hệ xác nhận với bạn.</p>
            <label style={s('display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:2px dashed #bcdcc8;border-radius:14px;padding:30px;cursor:pointer;background:#f6faf7;text-align:center')}>
              <span style={s('font-size:34px')}>📄</span>
              {!sst.rxName ? (
                <>
                  <span style={s('font-size:14px;font-weight:600;color:#1c7a45')}>Bấm để tải ảnh toa thuốc</span>
                  <span style={s('font-size:12px;color:#9aa8a0')}>PNG, JPG tối đa 10MB</span>
                </>
              ) : (
                <>
                  <span style={s('font-size:14px;font-weight:600;color:#1c7a45')}>✓ {sst.rxName}</span>
                  <span style={s('font-size:12px;color:#9aa8a0')}>Bấm để chọn ảnh khác</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={onRxFile} style={s('display:none')} />
            </label>
            <input value={sst.form.phone} onChange={(e) => setForm('phone', e.target.value)} placeholder="Số điện thoại để dược sĩ liên hệ" style={s('width:100%;border:1.5px solid #e0ebe4;border-radius:11px;padding:13px 14px;font-size:14px;outline:none;margin:16px 0 0')} />
            <button onClick={submitRx} style={s('width:100%;background:#2e9e5b;color:#fff;border:none;padding:14px;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;margin-top:14px')}>Gửi toa cho dược sĩ</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
