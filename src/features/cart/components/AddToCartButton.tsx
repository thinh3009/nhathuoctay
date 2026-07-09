'use client'

import { startTransition, useState } from 'react'
import { useRouter } from 'next/navigation'

type AddToCartButtonProps = {
  productSlug: string
  quantity?: number
  className?: string
  label?: string
}

export default function AddToCartButton({
  productSlug,
  quantity = 1,
  className,
  label = 'Thêm vào giỏ',
}: AddToCartButtonProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleClick() {
    setIsPending(true)

    try {
      await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug,
          quantity,
        }),
      })

      startTransition(() => {
        router.refresh()
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button className={className} disabled={isPending} onClick={handleClick} type="button">
      {isPending ? 'Đang thêm...' : label}
    </button>
  )
}
