// Logo "Quầy Thuốc Tây Số 16" — khớp 1:1 asset trong Design System
// (claude.ai/design · assets/logo/icon-mark.svg + logo-full.svg).
// Mark hình trái tim: cam (#F0930D) ôm lấy xanh ngọc (#00897B) + số "16".
// Lockup đầy đủ kèm dòng chữ vẽ tay "Q THUỐC TÂY" bên dưới.

const ORANGE = '#F0930D'
const TEAL = '#00897B'

// Chỉ riêng mark trái tim + "16" (dùng ở footer, favicon, chỗ hẹp).
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      height={size}
      viewBox="0 0 242 110"
      width={(size * 242) / 110}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M88,36 C82,22 66,16 54,20 C40,25 33,40 38,55 C44,73 60,85 78,98 C88,90 98,80 105,70" stroke={ORANGE} strokeWidth="14" />
        <path d="M87,30 C94,15 112,12 121,22 C130,32 129,50 117,59 C113,62 108,64 103,64" stroke={TEAL} strokeWidth="13" />
      </g>
      <g fill="none" stroke={ORANGE} strokeLinecap="round" strokeLinejoin="round">
        <path d="M146,36 L161,22 L161,90" strokeWidth="15" />
        <path d="M224,24 C206,32 191,45 187,60" strokeWidth="15" />
        <circle cx="207" cy="70" r="20" strokeWidth="14" />
      </g>
    </svg>
  )
}

// Lockup đầy đủ (mark + chữ vẽ tay) — dùng ở header. Kích thước theo chiều cao.
// `src` (tùy chọn): logo admin tự upload — nếu có thì hiển thị ảnh thay cho lockup SVG.
export default function Logo({
  height = 46,
  title = 'Quầy Thuốc Tây Số 16',
  src,
}: {
  height?: number
  title?: string
  src?: string
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={title} style={{ height, width: 'auto', display: 'block', objectFit: 'contain' }} />
    )
  }
  return (
    <svg
      height={height}
      role="img"
      aria-label={title}
      viewBox="0 0 280 150"
      width={(height * 280) / 150}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Mark: trái tim cam ôm xanh ngọc + số 16 */}
      <g transform="translate(14,0)">
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M88,36 C82,22 66,16 54,20 C40,25 33,40 38,55 C44,73 60,85 78,98 C88,90 98,80 105,70" stroke={ORANGE} strokeWidth="14" />
          <path d="M87,30 C94,15 112,12 121,22 C130,32 129,50 117,59 C113,62 108,64 103,64" stroke={TEAL} strokeWidth="13" />
        </g>
        <g fill="none" stroke={ORANGE} strokeLinecap="round" strokeLinejoin="round">
          <path d="M146,36 L161,22 L161,90" strokeWidth="15" />
          <path d="M224,24 C206,32 191,45 187,60" strokeWidth="15" />
          <circle cx="207" cy="70" r="20" strokeWidth="14" />
        </g>
      </g>
      {/* Dòng chữ vẽ tay "Q THUỐC TÂY" */}
      <g fill="none" stroke={TEAL} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="28" cy="122" r="12" />
        <path d="M34,131 L42,140" stroke={ORANGE} />
        <path d="M58,108 L74,108 M66,108 L66,134" />
        <path d="M82,108 L82,134 M98,108 L98,134 M82,121 L98,121" />
        <path d="M106,108 L106,122 C106,130 110,134 114,134 C118,134 122,130 122,122 L122,108" />
        <circle cx="142" cy="122" r="12" />
        <path d="M136,103 L142,97 L148,103" />
        <path d="M150,99 L156,93" />
        <path d="M186,112 C182,107 175,106 170,109 C164,112 162,118 163,124 C164,131 170,135 176,135 C180,135 184,133 186,130" />
        <path d="M204,108 L220,108 M212,108 L212,134" />
        <path d="M226,134 L234,108 L242,134 M229,126 L239,126" />
        <path d="M229,103 L234,97 L239,103" />
        <path d="M248,108 L256,120 L264,108 M256,120 L256,134" />
      </g>
    </svg>
  )
}
