'use client'

import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

type CartItemControlsProps = {
  productSlug: string
  quantity: number
}

export default function CartItemControls({ productSlug, quantity }: CartItemControlsProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function runRequest(input: RequestInit & { url: string }) {
    setIsPending(true)

    try {
      await fetch(input.url, input)
      startTransition(() => {
        router.refresh()
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:items-end">
      <div className="flex items-center rounded-lg border border-stone-300">
        <button
          className="h-10 w-10 text-lg font-semibold text-stone-700 disabled:opacity-50"
          disabled={isPending}
          onClick={() =>
            quantity <= 1
              ? runRequest({
                  url: `/api/cart/items/${productSlug}`,
                  method: 'DELETE',
                })
              : runRequest({
                  url: `/api/cart/items/${productSlug}`,
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ quantity: quantity - 1 }),
                })
          }
          type="button"
        >
          -
        </button>
        <span className="flex h-10 min-w-12 items-center justify-center border-x border-stone-300 px-3 text-sm font-semibold text-stone-900">
          {quantity}
        </span>
        <button
          className="h-10 w-10 text-lg font-semibold text-stone-700 disabled:opacity-50"
          disabled={isPending}
          onClick={() =>
            runRequest({
              url: `/api/cart/items/${productSlug}`,
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quantity: quantity + 1 }),
            })
          }
          type="button"
        >
          +
        </button>
      </div>

      <button
        className="text-sm font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-50"
        disabled={isPending}
        onClick={() =>
          runRequest({
            url: `/api/cart/items/${productSlug}`,
            method: 'DELETE',
          })
        }
        type="button"
      >
        Xóa khỏi giỏ hàng
      </button>
    </div>
  )
}
