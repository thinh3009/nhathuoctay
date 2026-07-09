'use client'

type QuantitySelectorProps = {
  quantity: number
  onChange: (value: number) => void
}

export default function QuantitySelector({ quantity, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center rounded-full border border-stone-300">
      <button
        className="h-11 w-11 text-xl font-semibold text-stone-700"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        type="button"
      >
        -
      </button>
      <span className="flex h-11 min-w-14 items-center justify-center border-x border-stone-300 px-3 text-base font-semibold text-stone-900">
        {quantity}
      </span>
      <button
        className="h-11 w-11 text-xl font-semibold text-stone-700"
        onClick={() => onChange(quantity + 1)}
        type="button"
      >
        +
      </button>
    </div>
  )
}
