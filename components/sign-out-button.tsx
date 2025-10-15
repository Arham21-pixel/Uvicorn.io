"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function SignOutButton({ className }: { className?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSignOut() {
    setLoading(true)
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.replace("/auth/login")
    } catch (err) {
      console.log("[v0] Sign out error:", (err as Error)?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={onSignOut} disabled={loading} className={className} aria-label="Sign out">
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  )
}
