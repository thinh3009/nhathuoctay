import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { defaultCategorySlug } from './data/products'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import type { CartItem } from './types/cart'

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const handleAddToCart = (slug: string, quantity = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.slug === slug)

      if (!existingItem) {
        return [...currentItems, { slug, quantity }]
      }

      return currentItems.map((item) =>
        item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item,
      )
    })
  }

  const handleDecreaseQuantity = (slug: string) => {
    setCartItems((currentItems) =>
      currentItems.flatMap((item) => {
        if (item.slug !== slug) {
          return [item]
        }

        if (item.quantity <= 1) {
          return []
        }

        return [{ ...item, quantity: item.quantity - 1 }]
      }),
    )
  }

  const handleRemoveFromCart = (slug: string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.slug !== slug))
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Routes>
      <Route
        element={<Navigate replace to={`/category/${defaultCategorySlug}`} />}
        path="/"
      />
      <Route
        element={<HomePage cartCount={cartCount} onAddToCart={handleAddToCart} />}
        path="/category/:categorySlug"
      />
      <Route
        element={
          <ProductDetailPage cartCount={cartCount} onAddToCart={handleAddToCart} />
        }
        path="/product/:slug"
      />
      <Route
        element={
          <CartPage
            cartCount={cartCount}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onDecreaseQuantity={handleDecreaseQuantity}
            onRemoveFromCart={handleRemoveFromCart}
          />
        }
        path="/cart"
      />
      <Route
        element={<Navigate replace to={`/category/${defaultCategorySlug}`} />}
        path="*"
      />
    </Routes>
  )
}

export default App
