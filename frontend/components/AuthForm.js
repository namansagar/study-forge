'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api, saveSession } from '../lib/api'

export default function AuthForm({ mode }) {
  const router = useRouter()
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ displayName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const session = await api(`/auth/${mode}`, { method: 'POST', body: form })
      saveSession(session)
      router.replace('/notes')
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <main className="auth">
      <h1 className="brand brand-large">StudyForge</h1>
      <p className="lede">Paste your notes. Get a summary, flashcards and a quiz.</p>

      <form className="panel stack" onSubmit={submit}>
        <h2>{isRegister ? 'Create your account' : 'Log in'}</h2>

        {isRegister && (
          <label>
            Name
            <input value={form.displayName} onChange={update('displayName')} maxLength={50} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            minLength={isRegister ? 8 : undefined}
            required
          />
          {isRegister && <small>At least 8 characters</small>}
        </label>

        {error && <p role="alert" className="error">{error}</p>}

        <button className="btn" disabled={busy}>
          {busy ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
        </button>

        <p className="swap">
          {isRegister ? (
            <>Already have an account? <Link href="/login">Log in</Link></>
          ) : (
            <>New here? <Link href="/register">Create an account</Link></>
          )}
        </p>
      </form>
    </main>
  )
}
