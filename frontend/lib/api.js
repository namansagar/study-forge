const TOKEN_KEY = 'studyforge:token'
const USER_KEY = 'studyforge:user'

export function getToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(USER_KEY))
  } catch {
    return null
  }
}

export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  // An expired or invalid token: send the person back to log in
  if (res.status === 401 && token) {
    clearSession()
    window.location.href = '/login'
    throw new Error('Your session expired. Log in again.')
  }
  if (res.status === 204) return null

  const data = await res.json().catch(() => null)
  if (!res.ok) throw new Error(data?.message || 'Something went wrong. Try again.')
  return data
}
