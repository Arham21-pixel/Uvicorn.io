"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { buildTrie, type Trie } from "@/lib/algos/trie"
import { quickSortProductsByPrice } from "@/lib/algos/quicksort"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import CartPanel from "@/components/cart-panel"
import { formatINR } from "@/lib/currency"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import ProductCard from "@/components/product-card"
import ProductSkeletonGrid from "@/components/product-skeleton-grid"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ShopApp() {
  const { data: products = [], isLoading } = useSWR<Product[]>("/api/products", fetcher, {
    revalidateOnFocus: false,
  })

  const [query, setQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null)

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
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/brand/uvicorn-logo.jpg" alt="Uvicorn logo" className="h-8 w-8 rounded-md" />
            <div>
              <h1 className="text-xl font-semibold text-pretty">Uvicorn</h1>
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
            <Button
              variant="default"
              size="sm"
              onClick={() => setCartOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={cartOpen}
              aria-controls="cart-panel"
            >
              Cart / Checkout ({totalQuantity})
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name..."
              aria-label="Search products"
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 rounded-md border bg-background shadow" role="listbox">
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
        </div>
      </header>

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
