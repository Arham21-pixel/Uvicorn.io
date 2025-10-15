"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { formatINR } from "@/lib/currency"

export default function ProductCard({
  product,
  premium,
  onAdd,
}: {
  product: Product
  premium?: boolean
  onAdd: () => void
}) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
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
        <Button size="sm" onClick={onAdd} aria-label={`Add ${product.name} to cart`}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
