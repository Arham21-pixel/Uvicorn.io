"use client"

import useSWR, { mutate as globalMutate } from "swr"
import { Cart } from "@/lib/structures/cart"
import type { CartJSON, CartItem } from "@/lib/types"

const CART_KEY = "cart:v1"

// Local fetcher reads from localStorage asynchronously
const cartFetcher = async (): Promise<CartJSON> => {
  if (typeof window === "undefined") return { items: [] }
  const raw = window.localStorage.getItem(CART_KEY)
  if (!raw) return { items: [] }
  try {
    return JSON.parse(raw) as CartJSON
  } catch {
    return { items: [] }
  }
}

const persist = (json: CartJSON) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CART_KEY, JSON.stringify(json))
  }
}

export function useCart() {
  const { data = { items: [] } } = useSWR<CartJSON>(CART_KEY, cartFetcher, {
    revalidateOnFocus: false,
    fallbackData: { items: [] },
  })

  // Reconstruct rich Cart structure from JSON for O(1) ops
  const cart = Cart.fromJSON(data)
  const items = cart.toArray()

  const commit = (c: Cart) => {
    const json = c.toJSON()
    persist(json)
    // Update SWR cache without refetch
    globalMutate(CART_KEY, json, false)
  }

  return {
    items,
    totalQuantity: items.reduce((sum, it) => sum + it.quantity, 0),
    subtotal: cart.subtotal(),
    tax: Math.round(cart.subtotal() * 0.18),
    total: Math.round(cart.subtotal() * 1.18),
    addItem: (item: CartItem) => {
      const c = cart.clone()
      c.add(item.product, item.quantity)
      commit(c)
    },
    removeItem: (productId: string) => {
      const c = cart.clone()
      c.remove(productId)
      commit(c)
    },
    updateQuantity: (productId: string, quantity: number) => {
      const c = cart.clone()
      c.setQuantity(productId, quantity)
      commit(c)
    },
    clear: () => {
      const c = new Cart()
      commit(c)
    },
  }
}
