'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, getUser } from '../lib/api'

// Returns the logged-in user, or sends the visitor to /login
export default function useRequireAuth() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = getUser()
    if (!getToken() || !stored) {
      router.replace('/login')
    } else {
      setUser(stored)
    }
  }, [router])

  return user
}
