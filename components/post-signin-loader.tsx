"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { LoaderOne } from "@/components/ui/loader"

export default function PostSignInLoader() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const isJustSignedIn = searchParams.get("signed_in") === "1"
    if (!isJustSignedIn) return

    // Show loader briefly, then remove the query param to keep URLs clean
    setShow(true)
    const t = setTimeout(() => {
      setShow(false)
      const params = new URLSearchParams(Array.from(searchParams.entries()))
      params.delete("signed_in")
      const next = params.toString() ? `?${params.toString()}` : ""
      router.replace(`${window.location.pathname}${next}`)
    }, 2000) // set loader duration to 2 seconds

    return () => clearTimeout(t)
  }, [searchParams, router])

  if (!show) return null
  return <LoaderOne message="Welcome back! Loading your store…" />
}
