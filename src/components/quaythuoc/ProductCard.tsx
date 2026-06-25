'use client'

import { s } from './data'

export type CardVM = {
  name: string
  catLabel: string
  priceText: string
  oldPriceText: string
  ratingText: string
  reviewsText: string
  badge: string
  tintBg: string
  tintFg: string
}

type Props = {
  p: CardVM
  onView: () => void
  onAdd: () => void
}

export default function ProductCard({ p, onView, onAdd }: Props) {
  return (
    <div
      className="qt-prodcard"
      style={s('background:#fff;border:1px solid #e7efe9;border-radius:14px;padding:10px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box;transition:box-shadow .15s,transform .15s')}
    >
      <div
        onClick={onView}
        style={{ ...s('position:relative;cursor:pointer;border-radius:10px;aspect-ratio:1 / 1;display:flex;align-items:center;justify-content:center;overflow:hidden'), background: p.tintBg }}
      >
        {p.badge ? (
          <div style={s('position:absolute;top:8px;left:8px;background:#e8654e;color:#fff;font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;letter-spacing:.2px')}>{p.badge}</div>
        ) : null}
        <div style={s('width:38%;height:38%;position:relative;opacity:.92')}>
          <div style={{ ...s('position:absolute;left:36%;top:0;width:28%;height:100%;border-radius:7px'), background: p.tintFg }} />
          <div style={{ ...s('position:absolute;top:36%;left:0;height:28%;width:100%;border-radius:7px'), background: p.tintFg }} />
        </div>
      </div>
      <div style={{ ...s('font-size:11px;font-weight:600;letter-spacing:.2px'), color: p.tintFg }}>{p.catLabel}</div>
      <div
        onClick={onView}
        style={s('cursor:pointer;font-size:14px;font-weight:600;color:#1f2a24;line-height:1.35;min-height:38px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden')}
      >
        {p.name}
      </div>
      <div style={s('display:flex;align-items:center;gap:5px;font-size:12px;color:#8a948e')}>
        <span style={s('color:#f1a821')}>★</span>
        <span style={s('color:#5a655e;font-weight:600')}>{p.ratingText}</span>
        <span>· {p.reviewsText}</span>
      </div>
      <div style={s('margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:6px')}>
        <div>
          <div style={s('font-size:16px;font-weight:700;color:#1c7a45')}>{p.priceText}</div>
          {p.oldPriceText ? (
            <div style={s('font-size:12px;color:#b3bdb6;text-decoration:line-through')}>{p.oldPriceText}</div>
          ) : null}
        </div>
        <button
          className="qt-addbtn"
          onClick={onAdd}
          style={s('border:none;background:#2e9e5b;color:#fff;width:36px;height:36px;border-radius:10px;font-size:20px;line-height:1;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center')}
        >
          +
        </button>
      </div>
    </div>
  )
}
