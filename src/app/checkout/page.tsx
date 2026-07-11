'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { s } from '@/features/storefront/data'
import { VIETNAM_PROVINCES } from '@/lib/provinces'
import { computeDiscount, PROMOS } from '@/lib/promos'

type CartItem = {
  slug: string
  name: string
  price: number
  quantity: number
  image?: string
}

const PAYMENT_METHODS = [
  { value: 'cod', icon: 'ph-hand-coins', label: 'Thanh toán khi nhận hàng (COD)', sub: 'Trả tiền mặt khi nhận hàng' },
  { value: 'bank_transfer', icon: 'ph-bank', label: 'Chuyển khoản ngân hàng', sub: 'Chuyển tới tài khoản nhà thuốc' },
  { value: 'momo', icon: 'ph-wallet', label: 'Ví MoMo', sub: 'Thanh toán qua ví điện tử MoMo' },
  { value: 'vnpay', icon: 'ph-qr-code', label: 'VNPAY-QR', sub: 'Quét mã QR qua ứng dụng ngân hàng' },
] as const

type PaymentMethod = (typeof PAYMENT_METHODS)[number]['value']

function formatPrice(n: number) {
  return n.toLocaleString('vi-VN') + '₫'
}

export default function CheckoutPage() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    ward: '',
    district: '',
    city: '',
    note: '',
    paymentMethod: 'cod' as PaymentMethod,
  })

  // Mã giảm giá
  const [promoInput, setPromoInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [promoError, setPromoError] = useState('')

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => {
        // /api/cart trả về item lồng { productSlug, quantity, product, subtotal }.
        const mapped: CartItem[] = (data.items ?? []).map((it: {
          productSlug: string
          quantity: number
          product?: { name?: string; price?: number; images?: { src?: string }[] }
        }) => ({
          slug: it.productSlug,
          name: it.product?.name ?? it.productSlug,
          price: it.product?.price ?? 0,
          quantity: it.quantity,
          image: it.product?.images?.[0]?.src,
        }))
        setItems(mapped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const discount = useMemo(() => computeDiscount(appliedCode, subtotal), [appliedCode, subtotal])
  const total = Math.max(0, subtotal + shippingFee - discount.amount)

  function applyPromo() {
    setPromoError('')
    const res = computeDiscount(promoInput, subtotal)
    if (res.error) {
      setAppliedCode(null)
      setPromoError(res.error)
      return
    }
    if (!res.promo) {
      setAppliedCode(null)
      setPromoError('Mã giảm giá không hợp lệ')
      return
    }
    setAppliedCode(res.promo.code)
  }

  function removePromo() {
    setAppliedCode(null)
    setPromoInput('')
    setPromoError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (items.length === 0) {
      setError('Giỏ hàng trống')
      return
    }
    if (!form.city) {
      setError('Vui lòng chọn Tỉnh/Thành phố')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine: form.addressLine,
            ward: form.ward || undefined,
            district: form.district || undefined,
            city: form.city,
          },
          paymentMethod: form.paymentMethod,
          note: form.note || undefined,
          discountCode: appliedCode || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Đặt hàng thất bại')
        return
      }

      router.push(`/checkout/success?order=${data.orderNumber}`)
    } catch {
      setError('Lỗi kết nối, vui lòng thử lại')
    } finally {
      setSubmitting(false)
    }
  }

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div style={s('min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--color-bg-page);color:var(--color-text-muted)')}>
        Đang tải...
      </div>
    )
  }

  return (
    <div className="qt-root" style={s('min-height:100vh;background:var(--color-bg-page)')}>
      {/* Header */}
      <header style={s('background:var(--neutral-0);border-bottom:1px solid var(--color-border-subtle);box-shadow:var(--shadow-xs)')}>
        <div style={s('max-width:1080px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;gap:14px;width:100%')}>
          <Link href="/" aria-label="Quầy Thuốc Tây Số 16 — trang chủ" style={s('display:flex;align-items:center;text-decoration:none;flex-shrink:0')}>
            <Logo height={44} />
          </Link>
          <span style={s('color:var(--neutral-300)')}>/</span>
          <span style={s('font:var(--text-label);font-weight:600;color:var(--color-text-heading)')}>Thanh toán</span>
        </div>
      </header>

      <div style={s('max-width:1080px;margin:0 auto;padding:28px 24px 56px;width:100%')}>
        <h1 style={s('font:var(--text-display-md);color:var(--color-text-heading);margin:0 0 4px')}>Tiến hành thanh toán</h1>
        <p style={s('font:var(--text-body-sm);color:var(--color-text-muted);margin:0 0 24px')}>
          Kiểm tra thông tin giao hàng và hoàn tất đơn của bạn.
        </p>

        <form className="qt-stack" style={s('display:grid;grid-template-columns:1fr 384px;gap:22px;align-items:start')} onSubmit={handleSubmit}>
          {/* Cột trái: địa chỉ + thanh toán */}
          <div style={s('display:flex;flex-direction:column;gap:18px')}>
            <Card>
              <SectionTitle icon="ph-map-pin-line">Địa chỉ giao hàng</SectionTitle>
              <div style={s('display:grid;gap:16px')}>
                <div className="qt-field-2col" style={s('display:grid;grid-template-columns:1fr 1fr;gap:16px')}>
                  <InputField label="Họ và tên" required placeholder="Nguyễn Văn A" value={form.fullName} onChange={(v) => set('fullName', v)} />
                  <InputField label="Số điện thoại" required type="tel" placeholder="0900 123 456" value={form.phone} onChange={(v) => set('phone', v)} />
                </div>
                <InputField label="Địa chỉ cụ thể" required placeholder="Số nhà, tên đường…" value={form.addressLine} onChange={(v) => set('addressLine', v)} />
                <div className="qt-field-3col" style={s('display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px')}>
                  <InputField label="Phường/Xã" placeholder="Phường 1" value={form.ward} onChange={(v) => set('ward', v)} />
                  <InputField label="Quận/Huyện" placeholder="Quận 1" value={form.district} onChange={(v) => set('district', v)} />
                  <SelectField
                    label="Tỉnh/Thành phố"
                    required
                    placeholder="Chọn tỉnh/thành"
                    value={form.city}
                    onChange={(v) => set('city', v)}
                    options={VIETNAM_PROVINCES}
                  />
                </div>
                <TextareaField label="Ghi chú đơn hàng" placeholder="Ghi chú thêm về đơn hàng (tùy chọn)" value={form.note} onChange={(v) => set('note', v)} />
              </div>
            </Card>

            <Card>
              <SectionTitle icon="ph-credit-card">Phương thức thanh toán</SectionTitle>
              <div style={s('display:flex;flex-direction:column;gap:12px')}>
                {PAYMENT_METHODS.map((m) => {
                  const active = form.paymentMethod === m.value
                  return (
                    <label
                      key={m.value}
                      style={s(
                        `display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:var(--radius-md);cursor:pointer;transition:all var(--duration-base);border:1.5px solid ${
                          active ? 'var(--color-brand-primary)' : 'var(--color-border-subtle)'
                        };background:${active ? 'var(--teal-50)' : 'var(--neutral-0)'}`,
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.value}
                        checked={active}
                        onChange={() => set('paymentMethod', m.value)}
                        style={{ accentColor: 'var(--color-brand-primary)', width: 18, height: 18, flexShrink: 0 }}
                      />
                      <span style={s(`width:42px;height:42px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${active ? 'var(--teal-100)' : 'var(--neutral-100)'};color:var(--teal-700)`)}>
                        <i className={'ph ' + m.icon} style={s('font-size:22px')} />
                      </span>
                      <span>
                        <span style={s('display:block;font:var(--text-label);font-weight:600;color:var(--color-text-heading)')}>{m.label}</span>
                        <span style={s('display:block;font:var(--text-caption);color:var(--color-text-muted)')}>{m.sub}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Cột phải: tóm tắt đơn */}
          <div style={s('position:sticky;top:16px')}>
            <Card>
              <SectionTitle icon="ph-shopping-bag-open">Đơn hàng của bạn</SectionTitle>

              {items.length === 0 ? (
                <div style={s('padding:20px 0;text-align:center;color:var(--color-text-muted)')}>
                  <p style={s('margin:0 0 8px')}>Giỏ hàng trống</p>
                  <Link href="/" style={s('font:var(--text-label);font-weight:600;color:var(--color-text-link);text-decoration:none')}>
                    Tiếp tục mua sắm →
                  </Link>
                </div>
              ) : (
                <>
                  <div style={s('display:flex;flex-direction:column;gap:14px;max-height:280px;overflow-y:auto;padding-right:4px')}>
                    {items.map((item) => (
                      <div key={item.slug} style={s('display:flex;align-items:flex-start;justify-content:space-between;gap:12px')}>
                        <div style={s('min-width:0;flex:1')}>
                          <p style={s('margin:0;font:var(--text-body-sm);font-weight:600;color:var(--color-text-heading);overflow:hidden;text-overflow:ellipsis;white-space:nowrap')}>{item.name}</p>
                          <p style={s('margin:2px 0 0;font:var(--text-caption);color:var(--color-text-muted)')}>
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p style={s('margin:0;flex-shrink:0;font:var(--text-body-sm);font-weight:700;color:var(--color-text-heading)')}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Mã giảm giá */}
                  <div style={s('margin-top:18px;padding-top:18px;border-top:1px solid var(--color-border-subtle)')}>
                    <div style={s('font:var(--text-label);font-weight:600;color:var(--color-text-heading);margin-bottom:8px;display:flex;align-items:center;gap:6px')}>
                      <i className="ph ph-ticket" style={s('font-size:17px;color:var(--color-brand-accent)')} /> Mã giảm giá
                    </div>

                    {appliedCode ? (
                      <div style={s('display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px;border-radius:var(--radius-md);background:var(--color-success-bg);border:1px solid var(--green-600)')}>
                        <span style={s('display:flex;align-items:center;gap:8px;font:var(--text-caption);font-weight:700;color:var(--color-success-fg)')}>
                          <i className="ph ph-seal-check" style={s('font-size:17px')} /> {appliedCode} · -{formatPrice(discount.amount)}
                        </span>
                        <button type="button" onClick={removePromo} style={s('border:none;background:transparent;cursor:pointer;color:var(--color-success-fg);font:var(--text-caption);font-weight:600;text-decoration:underline')}>
                          Bỏ
                        </button>
                      </div>
                    ) : (
                      <div style={s('display:flex;gap:8px')}>
                        <input
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPromo() } }}
                          placeholder="Nhập mã giảm giá"
                          style={s('flex:1;min-width:0;height:44px;border-radius:var(--radius-md);border:1.5px solid var(--color-border-default);background:var(--neutral-0);padding:0 14px;font:var(--text-body-sm);color:var(--color-text-body);outline:none;text-transform:uppercase')}
                        />
                        <button type="button" onClick={applyPromo} style={s('flex-shrink:0;height:44px;padding:0 18px;border:none;border-radius:var(--radius-md);background:var(--color-brand-accent);color:var(--color-text-on-accent);font:var(--text-button);cursor:pointer')}>
                          Áp dụng
                        </button>
                      </div>
                    )}

                    {promoError ? (
                      <p style={s('margin:8px 0 0;font:var(--text-caption);color:var(--color-danger-fg)')}>{promoError}</p>
                    ) : !appliedCode ? (
                      <div style={s('margin-top:8px;display:flex;flex-wrap:wrap;gap:6px')}>
                        {PROMOS.map((p) => (
                          <button
                            key={p.code}
                            type="button"
                            title={p.label}
                            onClick={() => { setPromoInput(p.code); setPromoError('') }}
                            style={s('border:1px dashed var(--color-border-default);background:var(--cream-50);color:var(--color-text-body);border-radius:var(--radius-pill);padding:4px 11px;font:var(--text-caption);font-weight:600;cursor:pointer')}
                          >
                            {p.code}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Tổng tiền */}
                  <div style={s('margin-top:18px;padding-top:18px;border-top:1px solid var(--color-border-subtle);display:flex;flex-direction:column;gap:9px')}>
                    <Row label="Tạm tính" value={formatPrice(subtotal)} />
                    {discount.amount > 0 ? (
                      <Row label="Giảm giá" value={'-' + formatPrice(discount.amount)} valueColor="var(--color-success-fg)" />
                    ) : null}
                    <Row
                      label="Phí vận chuyển"
                      value={shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                      valueColor={shippingFee === 0 ? 'var(--color-brand-primary)' : undefined}
                    />
                    {shippingFee > 0 ? (
                      <p style={s('margin:0;font:var(--text-caption);color:var(--color-text-muted)')}>
                        Mua thêm {formatPrice(500000 - subtotal)} để được miễn phí vận chuyển.
                      </p>
                    ) : null}
                    <div style={s('display:flex;align-items:center;justify-content:space-between;margin-top:6px;padding-top:12px;border-top:1px solid var(--color-border-subtle)')}>
                      <span style={s('font:var(--text-heading-sm);color:var(--color-text-heading)')}>Tổng cộng</span>
                      <span style={s('font:var(--text-heading-md);color:var(--color-brand-accent-active)')}>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {error ? (
                    <div style={s('margin-top:14px;border-radius:var(--radius-md);background:var(--color-danger-bg);color:var(--color-danger-fg);padding:11px 14px;font:var(--text-body-sm)')}>
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    style={s(`margin-top:18px;width:100%;border:none;border-radius:var(--radius-pill);background:var(--color-brand-primary);color:var(--color-text-on-brand);padding:14px;font:var(--text-button);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background var(--duration-base);${submitting ? 'opacity:0.65;cursor:default' : ''}`)}
                  >
                    {submitting ? (
                      'Đang đặt hàng…'
                    ) : (
                      <>
                        <i className="ph ph-check-circle" style={s('font-size:19px')} /> Đặt hàng · {formatPrice(total)}
                      </>
                    )}
                  </button>

                  <p style={s('margin:12px 0 0;text-align:center;font:var(--text-caption);color:var(--color-text-muted);display:flex;align-items:center;justify-content:center;gap:6px')}>
                    <i className="ph ph-shield-check" style={s('font-size:15px;color:var(--color-brand-primary)')} /> Thông tin của bạn được bảo mật an toàn
                  </p>
                </>
              )}
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ---------- Thành phần phụ ---------- */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={s('background:var(--color-bg-surface);border:1px solid var(--color-border-subtle);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:24px')}>
      {children}
    </div>
  )
}

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <h2 style={s('display:flex;align-items:center;gap:9px;font:var(--text-heading-sm);color:var(--color-text-heading);margin:0 0 18px')}>
      <span style={s('width:32px;height:32px;border-radius:var(--radius-sm);background:var(--teal-50);color:var(--color-brand-primary);display:flex;align-items:center;justify-content:center;flex-shrink:0')}>
        <i className={'ph ' + icon} style={s('font-size:18px')} />
      </span>
      {children}
    </h2>
  )
}

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={s('display:flex;align-items:center;justify-content:space-between')}>
      <span style={s('font:var(--text-body-sm);color:var(--color-text-muted)')}>{label}</span>
      <span style={s(`font:var(--text-body-sm);font-weight:600;color:${valueColor ?? 'var(--color-text-body)'}`)}>{value}</span>
    </div>
  )
}

function fieldWrapStyle(focused: boolean) {
  return s(
    `display:flex;align-items:center;height:48px;border-radius:var(--radius-md);background:var(--neutral-0);padding:0 14px;transition:border-color var(--duration-base),box-shadow var(--duration-base);border:1.5px solid ${
      focused ? 'var(--color-brand-primary)' : 'var(--color-border-default)'
    };${focused ? 'box-shadow:var(--shadow-focus)' : ''}`,
  )
}

function labelStyle() {
  return s('display:block;font:var(--text-label);font-weight:600;color:var(--color-text-heading);margin-bottom:7px')
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  type?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <label style={s('display:block')}>
      <span style={labelStyle()}>
        {label}{required ? <span style={s('color:var(--color-danger-fg);margin-left:3px')}>*</span> : null}
      </span>
      <span style={fieldWrapStyle(focused)}>
        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={s('flex:1;min-width:0;border:none;outline:none;background:transparent;font:var(--text-body-md);color:var(--color-text-body)')}
        />
      </span>
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
}) {
  const [focused, setFocused] = useState(false)
  return (
    <label style={s('display:block')}>
      <span style={labelStyle()}>
        {label}{required ? <span style={s('color:var(--color-danger-fg);margin-left:3px')}>*</span> : null}
      </span>
      <span style={{ ...fieldWrapStyle(focused), position: 'relative', padding: 0 }}>
        <select
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...s('width:100%;height:100%;border:none;outline:none;background:transparent;padding:0 38px 0 14px;font:var(--text-body-md);border-radius:var(--radius-md);cursor:pointer'),
            color: value ? 'var(--color-text-body)' : 'var(--color-text-muted)',
            appearance: 'none' as const,
            WebkitAppearance: 'none' as const,
          }}
        >
          <option value="" disabled>{placeholder ?? 'Chọn…'}</option>
          {options.map((o) => (
            <option key={o} value={o} style={{ color: 'var(--color-text-body)' }}>{o}</option>
          ))}
        </select>
        <span style={s('position:absolute;right:14px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--neutral-500);display:flex')}>
          <i className="ph ph-caret-down" style={s('font-size:14px')} />
        </span>
      </span>
    </label>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <label style={s('display:block')}>
      <span style={labelStyle()}>{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={2}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={s(
          `width:100%;border-radius:var(--radius-md);background:var(--neutral-0);padding:12px 14px;font:var(--text-body-md);color:var(--color-text-body);outline:none;resize:vertical;transition:border-color var(--duration-base),box-shadow var(--duration-base);border:1.5px solid ${
            focused ? 'var(--color-brand-primary)' : 'var(--color-border-default)'
          };${focused ? 'box-shadow:var(--shadow-focus)' : ''}`,
        )}
      />
    </label>
  )
}
