"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Center, Loader } from '@mantine/core'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Wait for session to load

    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  // Show loading while determining redirect
  return (
    <Center style={{ height: '100vh' }}>
      <Loader size="lg" />
    </Center>
  )
}
