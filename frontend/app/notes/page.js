'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import useRequireAuth from '../../components/useRequireAuth'
import { api } from '../../lib/api'

export default function NotesPage() {
  const user = useRequireAuth()
  const [notes, setNotes] = useState(null)
  const [form, setForm] = useState({ title: '', content: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      setNotes(await api('/notes'))
    } catch (err) {
      setError(err.message)
    }
  }, [])

  useEffect(() => {
    if (user) load()
  }, [user, load])

  async function addNote(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await api('/notes', { method: 'POST', body: form })
      setForm({ title: '', content: '' })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Header user={user} />
      <main className="page">
        <section className="panel stack">
          <h2>New note</h2>
          <form className="stack" onSubmit={addNote}>
            <label>
              Title
              <input
                value={form.title}
                maxLength={120}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label>
              Your notes
              <textarea
                rows={7}
                value={form.content}
                maxLength={10000}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Paste or type what you want to study (at least 20 characters)"
                required
              />
            </label>
            {error && <p role="alert" className="error">{error}</p>}
            <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save note'}</button>
          </form>
        </section>

        <section>
          <h2>Your notes</h2>
          {notes === null ? (
            <p className="muted">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="muted">No notes yet. Save your first note above to get started.</p>
          ) : (
            <ul className="note-list">
              {notes.map((n) => (
                <li key={n.id}>
                  <Link href={`/notes/${n.id}`}>
                    <span className="note-title">{n.title}</span>
                    <span className="note-meta">
                      {n.hasStudySet ? 'Study set ready' : 'Not generated yet'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
