import type { CartJSON, CartItem, Product } from "@/lib/types"

/**
 * Cart
 * - Internal structure uses Map<string, { product, quantity }> for O(1) average-case
 *   add/remove/update operations based on product id.
 * - Serialization to JSON keeps portability with localStorage and network.
 *
 * Complexity:
 * - add/remove/setQuantity/get: average O(1)
 * - toArray: O(n)
 * - subtotal: O(n)
 */
export class Cart {
  private items: Map<string, CartItem>

  constructor(items?: Map<string, CartItem>) {
    this.items = items ?? new Map()
  }

  static fromJSON(json: CartJSON) {
    const m = new Map<string, CartItem>()
    for (const it of json.items) {
      m.set(it.product.id, { product: it.product, quantity: it.quantity })
    }
    return new Cart(m)
  }

  toJSON(): CartJSON {
    return { items: this.toArray() }
  }

  clone(): Cart {
    return new Cart(new Map(this.items))
  }

  toArray(): CartItem[] {
    return Array.from(this.items.values())
  }

  add(product: Product, qty = 1) {
    const existing = this.items.get(product.id)
    if (existing) {
      existing.quantity += qty
      this.items.set(product.id, existing)
    } else {
      this.items.set(product.id, { product, quantity: qty })
    }
  }

  remove(productId: string) {
    this.items.delete(productId)
  }

  setQuantity(productId: string, qty: number) {
    if (qty <= 0) {
      this.items.delete(productId)
      return
    }
    const existing = this.items.get(productId)
    if (existing) {
      existing.quantity = qty
      this.items.set(productId, existing)
    }
  }

  subtotal(): number {
    let sum = 0
    for (const it of this.items.values()) {
      sum += it.product.price * it.quantity
    }
    return sum
  }
}
