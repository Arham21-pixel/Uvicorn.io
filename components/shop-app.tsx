"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"
import { buildTrie, type Trie } from "@/lib/algos/trie"
import { quickSortProductsByPrice } from "@/lib/algos/quicksort"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useOrders } from "@/hooks/use-orders"
import type { Product } from "@/lib/types"
import CartPanel from "@/components/cart-panel"
import { formatINR } from "@/lib/currency"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import ProductCard from "@/components/product-card"
import ProductSkeletonGrid from "@/components/product-skeleton-grid"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { WishlistItem } from "@/hooks/use-wishlist"
import type { Order } from "@/hooks/use-orders"
import { DiwaliSaleBanner } from "@/components/diwali-sale-banner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

import { WishlistNotification } from "@/components/wishlist-notification"
import { setWishlistNotifier } from "@/components/product-card"

export default function ShopApp() {
  const { data: products = [], isLoading } = useSWR<Product[]>("/api/products", fetcher, {
    revalidateOnFocus: false,
  })

  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)
  const [activeTab, setActiveTab] = useState<"shop" | "wishlist" | "orders">("shop")
  
  // Wishlist notification state
  const [wishlistNotif, setWishlistNotif] = useState({ show: false, product: "", isAdded: false })

  // Set up global notifier
  useMemo(() => {
    setWishlistNotifier((product: string, isAdded: boolean) => {
      setWishlistNotif({ show: true, product, isAdded })
    })
  }, [])

  const trie: Trie | null = useMemo(() => {
    if (!products.length) return null
    return buildTrie(products.map((p) => p.name))
  }, [products])

  const suggestions = useMemo(() => {
    if (!trie || query.trim() === "") return []
    return trie.startsWith(query.trim()).slice(0, 6)
  }, [trie, query])

  const minPrice = useMemo(() => (products.length ? Math.min(...products.map((p) => p.price)) : 0), [products])
  const maxPrice = useMemo(() => (products.length ? Math.max(...products.map((p) => p.price)) : 0), [products])

  useMemo(() => {
    if (products.length && !priceRange) setPriceRange([minPrice, maxPrice])
  }, [products, minPrice, maxPrice, priceRange])

  const { addItem, totalQuantity, total } = useCart()
  const { toast } = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const baseByQuery = q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products
    const baseByPrice =
      priceRange && priceRange.length === 2
        ? baseByQuery.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
        : baseByQuery
    return quickSortProductsByPrice(baseByPrice, sortAsc)
  }, [products, query, sortAsc, priceRange])

  return (
    <main className="min-h-dvh">
      <DiwaliSaleBanner />
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.img 
              src="/brand/uvicorn-logo.jpg" 
              alt="Uvicorn logo" 
              className="h-8 w-8 rounded-md" 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                duration: 0.8 
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            />
            <div>
              <motion.h1 
                className="text-xl font-semibold text-pretty bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Uvicorn
              </motion.h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/welcome" className="text-sm text-muted-foreground hover:underline">
              Start
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort</span>
              <Select value={sortAsc ? "asc" : "desc"} onValueChange={(v) => setSortAsc(v === "asc")}>
                <SelectTrigger className="w-[200px]" aria-label="Sort products by price">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Price: Low → High</SelectItem>
                  <SelectItem value="desc">Price: High → Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <StatefulButton
              onClick={async () => {
                await new Promise(resolve => setTimeout(resolve, 300));
                setCartOpen(true);
              }}
              className="h-9 px-4 text-sm bg-black text-white hover:bg-black/90"
              aria-haspopup="dialog"
              aria-expanded={cartOpen}
              aria-controls="cart-panel"
            >
              Cart / Checkout ({totalQuantity})
            </StatefulButton>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Search for laptops...",
              "Find wireless headphones...",
              "Look for gaming keyboards...",
              "Search smartphones...",
              "Discover smart watches...",
              "Find USB cables...",
            ]}
            onChange={(e) => setQuery(e.target.value)}
            onSubmit={(e) => {
              e.preventDefault();
            }}
            value={query}
          />
          {suggestions.length > 0 && query && (
            <ul className="mx-auto max-w-xl mt-2 rounded-md border bg-background shadow" role="listbox">
              {suggestions.map((s, i) => (
                <li
                  key={s + i}
                  role="option"
                  tabIndex={0}
                  className="cursor-pointer px-3 py-2 hover:bg-accent"
                  onClick={() => setQuery(s)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setQuery(s)
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Navigation Tabs */}
        <div className="border-t">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("shop")}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "shop"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🛍️ Shop
                {activeTab === "shop" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "wishlist"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ❤️ Wishlist
                {activeTab === "wishlist" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === "orders"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                📦 My Orders
                {activeTab === "orders" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {activeTab === "shop" && (
        <>
          <section className="mx-auto max-w-6xl px-4 pt-4">
            <div className="rounded-md border bg-card text-card-foreground px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src="/brand/uvicorn-logo.jpg" alt="Uvicorn logo" className="h-10 w-10 rounded-md" />
                  <div>
                    <h2 className="text-lg font-semibold text-pretty">Uvicorn App</h2>
                    <p className="text-sm text-muted-foreground">
                      Welcome back! Manage your cart and discover electronics.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="rounded-md border bg-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Price range:{" "}
              <span className="font-medium">
                {formatINR(priceRange?.[0] ?? minPrice)} – {formatINR(priceRange?.[1] ?? maxPrice)}
              </span>
            </p>
            <div className="sm:w-1/2">
              {priceRange ? (
                <Slider
                  aria-label="Filter by price range"
                  min={minPrice}
                  max={maxPrice}
                  step={50000}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

          <section className="mx-auto max-w-6xl px-4 py-6">
            {isLoading ? (
              <ProductSkeletonGrid count={6} />
            ) : filtered.length === 0 ? (
              <p className="text-muted-foreground">No products found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((p, idx) => {
                  const premiumCutoff = Math.max(maxPrice * 0.8, minPrice + (maxPrice - minPrice) * 0.7)
                  const premium = p.price >= premiumCutoff
                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      premium={premium}
                      onAdd={() => {
                        addItem({ product: p, quantity: 1 })
                        toast({ title: "Added to cart", description: `${p.name} added.` })
                      }}
                    />
                  )
                })}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "wishlist" && <WishlistTab />}
      {activeTab === "orders" && <OrdersTab />}

      <WishlistNotification
        isVisible={wishlistNotif.show}
        productName={wishlistNotif.product}
        isAdded={wishlistNotif.isAdded}
        onClose={() => setWishlistNotif({ ...wishlistNotif, show: false })}
      />

      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/90 backdrop-blur px-4 py-3 sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-base font-semibold">{formatINR(total)}</p>
          </div>
          <Button onClick={() => setCartOpen(true)} aria-haspopup="dialog" aria-controls="cart-panel">
            Proceed to Checkout
          </Button>
        </div>
      </div>

      <CartPanel open={cartOpen} onOpenChange={setCartOpen} />
    </main>
  )
}

function WishlistTab() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <svg className="w-24 h-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground">Add items you love to your wishlist!</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">My Wishlist ({items.length} items)</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item: WishlistItem) => (
          <Card key={item.productId} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md border">
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-2">
              <span className="font-medium">{formatINR(item.price)}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    addItem({ product: { id: item.productId, name: item.name, price: item.price, image: item.image } as any, quantity: 1 })
                    toast({ title: "Added to cart", description: `${item.name} added to cart` })
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    removeItem(item.productId)
                    toast({ title: "Removed", description: `${item.name} removed from wishlist` })
                  }}
                >
                  ❌
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}

function OrdersTab() {
  const { orders } = useOrders()

  if (orders.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4"
        >
          <svg className="w-24 h-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h2 className="text-2xl font-semibold">No Orders Yet</h2>
          <p className="text-muted-foreground">Your order history will appear here</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">My Orders ({orders.length})</h2>
      <div className="space-y-4">
        {orders.map((order: Order) => (
          <Card key={order.orderId}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Email:</span> {order.email}
                </div>
                <div className="space-y-2">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm border-b pb-2">
                      <div className="flex items-center gap-3">
                        {item.product.image && (
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                        )}
                        <span>{item.product.name} × {item.quantity}</span>
                      </div>
                      <span className="font-medium">{formatINR(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span>Subtotal:</span>
                  <span>{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (18%):</span>
                  <span>{formatINR(order.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{formatINR(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
