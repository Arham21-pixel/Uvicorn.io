"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from "react"
import { motion } from "motion/react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import LoginForm from "@/components/auth/login-form"
import Link from "next/link"
import SignOutButton from "@/components/sign-out-button"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

export default function LandingCarousel() {
  const [api, setApi] = React.useState<CarouselApi | null>(null)
  const params = useSearchParams()

  React.useEffect(() => {
    const target = params?.get("slide")
    if (api && target === "signin") {
      api.scrollTo(1)
    }
  }, [api, params])

  return (
    <main className="min-h-dvh flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="relative w-full max-w-4xl">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            <CarouselItem>
              <section className="rounded-md border bg-card text-card-foreground p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <motion.img 
                    src="/brand/uvicorn-logo.jpg" 
                    alt="Uvicorn logo" 
                    className="h-16 w-16 rounded-md" 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20,
                      duration: 0.8 
                    }}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                  />
                  <div>
                    <motion.h1 
                      className="text-3xl font-semibold text-balance bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      Uvicorn
                    </motion.h1>
                    <motion.p 
                      className="mt-2 text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      Fast, reliable shopping.
                    </motion.p>
                  </div>
                  <motion.div 
                    className="mt-2 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <Button onClick={() => api?.scrollTo(1)}>Sign in</Button>
                    <Button variant="outline" asChild>
                      <Link href="/auth/sign-up">Create account</Link>
                    </Button>
                  </motion.div>
                </div>
              </section>
            </CarouselItem>

            <CarouselItem>
              <section>
                <LoginForm onSuccessRedirectTo="/" showSignUpHint={true} />
                <div className="mt-4 flex justify-center">
                  <Button variant="ghost" size="sm" onClick={() => api?.scrollTo(0)}>
                    Back to start
                  </Button>
                </div>
              </section>
            </CarouselItem>

            <CarouselItem>
              <section className="rounded-md border bg-card text-card-foreground p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <img src="/brand/uvicorn-logo.jpg" alt="Uvicorn logo" className="h-12 w-12 rounded-md" />
                  <div>
                    <h2 className="text-2xl font-semibold text-balance">Account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">You can sign out of your Uvicorn account here.</p>
                  </div>
                  <SignOutButton />
                </div>
              </section>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </main>
  )
}
