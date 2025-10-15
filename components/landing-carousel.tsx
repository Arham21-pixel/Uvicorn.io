"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as React from "react"
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
    <main className="min-h-dvh flex items-center justify-center px-4">
      <div className="relative w-full max-w-4xl">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent>
            <CarouselItem>
              <section className="rounded-md border bg-card text-card-foreground p-8">
                <div className="flex flex-col items-center text-center gap-4">
                  <img src="/brand/uvicorn-logo.jpg" alt="Uvicorn logo" className="h-16 w-16 rounded-md" />
                  <div>
                    <h1 className="text-3xl font-semibold text-balance">Uvicorn</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Fast, reliable shopping.</p>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <Button onClick={() => api?.scrollTo(1)}>Sign in</Button>
                    <Button variant="outline" asChild>
                      <Link href="/auth/sign-up">Create account</Link>
                    </Button>
                  </div>
                </div>
              </section>
            </CarouselItem>

            <CarouselItem>
              <section>
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-center">Sign in to Uvicorn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoginForm
                      onSuccessRedirectTo="/"
                      footer={
                        <p className="text-sm text-muted-foreground text-center">
                          New here?{" "}
                          <Link className="underline" href="/auth/sign-up">
                            Create an account
                          </Link>
                        </p>
                      }
                    />
                    <div className="mt-4 flex justify-center">
                      <Button variant="ghost" size="sm" onClick={() => api?.scrollTo(0)}>
                        Back to start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
