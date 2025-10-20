"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatINR } from "@/lib/currency"
import { useWishlist } from "@/hooks/use-wishlist"

// Global notification state
let globalNotification: ((product: string, isAdded: boolean) => void) | null = null;

export function setWishlistNotifier(notifier: (product: string, isAdded: boolean) => void) {
  globalNotification = notifier;
}

export default function ProductCard({
  product,
  premium,
  onAdd,
}: {
  product: Product
  premium?: boolean
  onAdd: () => void
}) {
  const { addItem, removeItem, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)
  const [isAnimating, setIsAnimating] = useState(false)

  const toggleWishlist = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)
    
    if (inWishlist) {
      removeItem(product.id)
      if (globalNotification) {
        globalNotification(product.name, false)
      }
    } else {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      })
      if (globalNotification) {
        globalNotification(product.name, true)
      }
    }
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md relative">
      <button
        onClick={toggleWishlist}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:scale-110 transition-transform"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
          animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={inWishlist ? "#ef4444" : "none"}
            stroke={inWishlist ? "#ef4444" : "currentColor"}
            strokeWidth="2"
            initial={false}
            animate={inWishlist ? { scale: 1 } : { scale: 1 }}
          />
        </motion.svg>
      </button>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <CardTitle className="text-balance text-base sm:text-lg">{product.name}</CardTitle>
        {premium ? <Badge variant="secondary">Premium</Badge> : null}
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md border">
          <img
            src={product.image || `/placeholder.svg?height=300&width=400&query=electronics%20product`}
            alt={`${product.name} preview`}
            className="h-full w-full object-cover"
          />
        </div>
        {product.description ? (
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        ) : null}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="font-medium">{formatINR(product.price)}</span>
        <StatefulButton 
          onClick={async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            onAdd();
          }} 
          className="h-9 px-4 text-sm"
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </StatefulButton>
      </CardFooter>
    </Card>
  )
}
