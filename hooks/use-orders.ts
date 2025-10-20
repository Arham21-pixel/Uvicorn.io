import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types'

export type OrderItem = {
  product: Product
  quantity: number
}

export type Order = {
  orderId: string
  items: OrderItem[]
  email: string
  subtotal: number
  tax: number
  total: number
  date: Date
  status: 'completed' | 'pending' | 'shipped'
}

type OrdersStore = {
  orders: Order[]
  addOrder: (order: Omit<Order, 'date' | 'status'>) => void
  getOrders: () => Order[]
  clear: () => void
}

export const useOrders = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({
          orders: [
            {
              ...order,
              date: new Date(),
              status: 'completed'
            },
            ...state.orders
          ]
        }))
      },
      getOrders: () => get().orders,
      clear: () => set({ orders: [] })
    }),
    {
      name: 'uvicorn-orders-storage'
    }
  )
)
