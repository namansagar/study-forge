'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearSession } from '../lib/api'

export default function Header({ user }) {
  const router = useRouter()

  function logout() {
    clearSession()
    router.replace('/login')
  }

  return (
    <header className="topbar">
      <Link href="/notes" className="brand">StudyForge</Link>
      {user && (
        <div className="topbar-right">
          <span>{user.displayName}</span>
          <button className="btn btn-quiet" onClick={logout}>Log out</button>
        </div>
      )}
    </header>
  )
}
