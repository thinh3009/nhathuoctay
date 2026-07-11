'use client'

import { s } from '../data'

export type CardVM = {
  name: string
  image: string
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
  const isDiscount = p.badge.startsWith('-')
  return (
    <div
      className="qt-prodcard"
      style={s('background:var(--neutral-0);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:10px;display:flex;flex-direction:column;gap:8px;height:100%;box-sizing:border-box;transition:box-shadow var(--duration-base),transform var(--duration-base)')}
    >
      <div
        onClick={onView}
        style={{ ...s('position:relative;cursor:pointer;border-radius:var(--radius-md);aspect-ratio:1 / 1;display:flex;align-items:center;justify-content:center;overflow:hidden'), background: p.tintBg }}
      >
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={p.name} loading="lazy" src={p.image} style={s('width:100%;height:100%;object-fit:cover')} />
        ) : (
          <div style={s('width:38%;height:38%;position:relative;opacity:.92')}>
            <div style={{ ...s('position:absolute;left:36%;top:0;width:28%;height:100%;border-radius:7px'), background: p.tintFg }} />
            <div style={{ ...s('position:absolute;top:36%;left:0;height:28%;width:100%;border-radius:7px'), background: p.tintFg }} />
          </div>
        )}
        {p.badge ? (
          <div
            style={{
              ...s('position:absolute;top:8px;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:var(--radius-pill);letter-spacing:.2px'),
              left: isDiscount ? 8 : undefined,
              right: isDiscount ? undefined : 8,
              background: isDiscount ? 'var(--color-brand-accent)' : 'var(--color-brand-primary)',
            }}
          >
            {p.badge}
          </div>
        ) : null}
      </div>
      <div style={{ ...s('font-size:11px;font-weight:600;letter-spacing:.2px'), color: p.tintFg }}>{p.catLabel}</div>
      <div
        onClick={onView}
        style={s('cursor:pointer;font-size:14px;font-weight:600;color:var(--color-text-heading);line-height:1.35;min-height:38px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden')}
      >
        {p.name}
      </div>
      <div style={s('display:flex;align-items:center;gap:5px;font-size:12px;color:var(--color-text-muted)')}>
        <i className="ph-fill ph-star" style={s('color:var(--color-brand-accent);font-size:13px')} />
        <span style={s('color:var(--color-text-body);font-weight:600')}>{p.ratingText}</span>
        <span>· {p.reviewsText}</span>
      </div>
      <div style={s('margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:6px')}>
        <div>
          <div style={{ ...s('font:var(--text-heading-sm)'), color: 'var(--color-brand-accent)' }}>{p.priceText}</div>
          {p.oldPriceText ? (
            <div style={s('font-size:12px;color:var(--neutral-400);text-decoration:line-through')}>{p.oldPriceText}</div>
          ) : null}
        </div>
        <button
          className="qt-addbtn"
          onClick={onAdd}
          aria-label="Thêm vào giỏ"
          style={s('border:none;background:var(--color-brand-primary);color:#fff;width:36px;height:36px;border-radius:50%;font-size:18px;line-height:1;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background var(--duration-base)')}
        >
          <i className="ph-bold ph-plus" />
        </button>
      </div>
    </div>
  )
}
