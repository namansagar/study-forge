'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import useRequireAuth from '../../../components/useRequireAuth'
import { Flashcards, Quiz, Summary } from '../../../components/StudyViews'
import { api } from '../../../lib/api'

const TABS = ['Summary', 'Flashcards', 'Quiz']

export default function NotePage() {
  const user = useRequireAuth()
  const { id } = useParams()
  const router = useRouter()

  const [note, setNote] = useState(null)
  const [tab, setTab] = useState('Summary')
  const [error, setError] = useState('')
  const [generating, setGenerating] = useState(false)
  const [fromCache, setFromCache] = useState(false)

  useEffect(() => {
    if (!user) return
    api(`/notes/${id}`)
      .then(setNote)
      .catch((err) => setError(err.message))
  }, [user, id])

  async function generate() {
    setError('')
    setGenerating(true)
    try {
      const result = await api(`/notes/${id}/generate`, { method: 'POST' })
      setNote({ ...note, studySet: result.studySet })
      setFromCache(result.cached)
      setTab('Summary')
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function remove() {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    try {
      await api(`/notes/${id}`, { method: 'DELETE' })
      router.replace('/notes')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return null

  return (
    <>
      <Header user={user} />
      <main className="page">
        <Link href="/notes" className="back">Back to notes</Link>

        {!note ? (
          <p className={error ? 'error' : 'muted'} role={error ? 'alert' : undefined}>
            {error || 'Loading note...'}
          </p>
        ) : (
          <>
            <h1>{note.title}</h1>
            <p className="note-body">{note.content}</p>

            <div className="actions">
              <button className="btn" onClick={generate} disabled={generating}>
                {generating ? 'Generating...' : note.studySet ? 'Generate again' : 'Generate study set'}
              </button>
              <button className="btn btn-quiet" onClick={remove}>Delete note</button>
            </div>
            {error && <p role="alert" className="error">{error}</p>}
            {fromCache && (
              <p className="muted">This result came from the cache, so it appeared instantly.</p>
            )}

            {note.studySet && (
              <section className="panel stack">
                <div className="tabs" role="tablist">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      role="tab"
                      aria-selected={tab === t}
                      className={tab === t ? 'tab active' : 'tab'}
                      onClick={() => setTab(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {tab === 'Summary' && <Summary text={note.studySet.summary} />}
                {tab === 'Flashcards' && <Flashcards cards={note.studySet.flashcards} />}
                {tab === 'Quiz' && <Quiz questions={note.studySet.quiz} />}
              </section>
            )}
          </>
        )}
      </main>
    </>
  )
}
