'use client'

import { useState } from 'react'

export function Summary({ text }) {
  return <p className="summary">{text}</p>
}

export function Flashcards({ cards }) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = cards[index]

  function go(delta) {
    setFlipped(false)
    setIndex((index + delta + cards.length) % cards.length)
  }

  return (
    <div className="stack">
      <button
        className="index-card"
        onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? 'Showing answer. Click to show question' : 'Showing question. Click to show answer'}
      >
        <span className="card-side">{flipped ? 'Answer' : 'Question'}</span>
        <span className="card-text">{flipped ? card.answer : card.question}</span>
      </button>
      <div className="card-nav">
        <button className="btn btn-quiet" onClick={() => go(-1)}>Previous</button>
        <span>{index + 1} of {cards.length}</span>
        <button className="btn btn-quiet" onClick={() => go(1)}>Next</button>
      </div>
    </div>
  )
}

export function Quiz({ questions }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  const score = questions.filter((q, i) => answers[i] === q.correctIndex).length
  const allAnswered = Object.keys(answers).length === questions.length

  function reset() {
    setAnswers({})
    setChecked(false)
  }

  return (
    <div className="stack">
      {questions.map((q, i) => (
        <fieldset key={i} className="question">
          <legend>{i + 1}. {q.question}</legend>
          {q.options.map((opt, j) => {
            const isCorrect = checked && j === q.correctIndex
            const isWrong = checked && answers[i] === j && j !== q.correctIndex
            return (
              <label key={j} className={`option ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}>
                <input
                  type="radio"
                  name={`q${i}`}
                  checked={answers[i] === j}
                  disabled={checked}
                  onChange={() => setAnswers({ ...answers, [i]: j })}
                />
                {opt}
              </label>
            )
          })}
          {checked && <p className="explain">{q.explanation}</p>}
        </fieldset>
      ))}

      {checked ? (
        <div className="quiz-result">
          <strong>You scored {score} out of {questions.length}.</strong>
          <button className="btn btn-quiet" onClick={reset}>Try again</button>
        </div>
      ) : (
        <button className="btn" disabled={!allAnswered} onClick={() => setChecked(true)}>
          Check answers
        </button>
      )}
    </div>
  )
}
