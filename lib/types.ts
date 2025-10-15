export type Product = {
  id: string
  name: string
  description: string
  price: number // in paise (INR)
  image?: string // path under /public
}

export type CartItem = {
  product: Product
  quantity: number
}

export type CartJSON = {
  items: CartItem[]
}
