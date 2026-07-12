// Định danh đăng nhập/đăng ký: email HOẶC số điện thoại Việt Nam.
// Dùng chung cho form (client) và route xác thực (server).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// SĐT VN: 10 số bắt đầu bằng 0 (đã chuẩn hoá), hoặc +84 / 84 đầu số.
const PHONE_RE = /^0\d{9}$/

// Bỏ khoảng trắng, dấu chấm, gạch nối trong SĐT và quy +84/84 về 0.
export function normalizePhone(raw: string): string {
  let v = raw.replace(/[\s.\-()]/g, '')
  if (v.startsWith('+84')) v = '0' + v.slice(3)
  else if (v.startsWith('84') && v.length === 11) v = '0' + v.slice(2)
  return v
}

export function isEmail(raw: string): boolean {
  return EMAIL_RE.test(raw.trim())
}

export function isVietnamPhone(raw: string): boolean {
  return PHONE_RE.test(normalizePhone(raw))
}

export type ClassifiedIdentifier =
  | { kind: 'email'; email: string }
  | { kind: 'phone'; phone: string }
  | { kind: 'invalid' }

// Xác định người dùng nhập email hay SĐT, kèm giá trị đã chuẩn hoá.
export function classifyIdentifier(raw: string): ClassifiedIdentifier {
  const value = raw.trim()
  if (value.includes('@')) {
    return isEmail(value) ? { kind: 'email', email: value.toLowerCase() } : { kind: 'invalid' }
  }
  if (isVietnamPhone(value)) {
    return { kind: 'phone', phone: normalizePhone(value) }
  }
  return { kind: 'invalid' }
}
