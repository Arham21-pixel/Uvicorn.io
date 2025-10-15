"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type LoginFormProps = {
  onSuccessRedirectTo?: string
  className?: string
  showSignUpHint?: boolean
  footer?: React.ReactNode
}

export default function LoginForm({
  onSuccessRedirectTo = "/",
  className,
  showSignUpHint = true,
  footer,
}: LoginFormProps) {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)

    // Direct redirect without signed_in query and loader trigger
    router.push(onSuccessRedirectTo)
  }

  return (
    <form onSubmit={onSubmit} className={className} aria-label="Sign in form">
      <div className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <Input
            id="password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={loading} aria-label="Sign in">
          {loading ? "Signing in..." : "Sign In"}
        </Button>
        {footer}
      </div>
    </form>
  )
}
