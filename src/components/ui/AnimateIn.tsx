'use client'

import { type ElementType, useEffect, useRef } from 'react'

type Variant = 'up' | 'left' | 'right' | 'scale'

const BASE_CLASS: Record<Variant, string> = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
}

type AnimateInProps = {
  children: React.ReactNode
  className?: string
  variant?: Variant
  delay?: number
  tag?: ElementType
}

export default function AnimateIn({
  children,
  className = '',
  variant = 'up',
  delay = 0,
  tag: Tag = 'div',
}: AnimateInProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          if (delay) el.style.transitionDelay = `${delay}ms`
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -28px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={`${BASE_CLASS[variant]} ${className}`}>
      {children}
    </Tag>
  )
}
