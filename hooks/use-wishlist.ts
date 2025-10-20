import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WishlistItem = {
  productId: string
  name: string
  price: number
  image?: string
  addedAt: Date
}

type WishlistStore = {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const exists = get().items.find(i => i.productId === item.productId)
        if (!exists) {
          set((state) => ({
            items: [...state.items, { ...item, addedAt: new Date() }]
          }))
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.productId !== productId)
        }))
      },
      isInWishlist: (productId) => {
        return get().items.some(i => i.productId === productId)
      },
      clear: () => set({ items: [] })
    }),
    {
      name: 'uvicorn-wishlist-storage'
    }
  )
)
