/**
 * Quicksort average complexity: O(n log n), worst-case O(n^2).
 * Space: O(log n) average due to recursion.
 */
import type { Product } from "@/lib/types"

export function quickSortProductsByPrice(items: Product[], ascending: boolean): Product[] {
  const a = items.slice()

  const cmp = (x: Product, y: Product) => (ascending ? x.price - y.price : y.price - x.price)

  const qs = (lo: number, hi: number) => {
    if (lo >= hi) return
    const p = partition(lo, hi)
    qs(lo, p - 1)
    qs(p + 1, hi)
  }

  const partition = (lo: number, hi: number): number => {
    // choose middle as pivot to reduce worst-case likelihood on sorted data
    const mid = Math.floor((lo + hi) / 2)
    ;[a[mid], a[hi]] = [a[hi], a[mid]]
    const pivot = a[hi]
    let i = lo
    for (let j = lo; j < hi; j++) {
      if (cmp(a[j], pivot) <= 0) {
        ;[a[i], a[j]] = [a[j], a[i]]
        i++
      }
    }
    ;[a[i], a[hi]] = [a[hi], a[i]]
    return i
  }

  qs(0, a.length - 1)
  return a
}
