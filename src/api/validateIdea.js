async function apiFetch(path, body) {
  let res
  try {
    res = await fetch(`http://localhost:3001${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Run: npm run server')
  }

  const contentType = res.headers.get('content-type') ?? ''
  let data
  if (contentType.includes('application/json')) {
    data = await res.json()
  } else {
    const text = await res.text()
    throw new Error(`Unexpected response (${res.status}): ${text.slice(0, 120)}`)
  }

  if (!res.ok) throw new Error(data.error ?? `Server error ${res.status}`)
  return data
}

export async function validateIdea(idea) {
  return apiFetch('/api/validate', { idea })
}

export async function callAction(idea, action, context) {
  const data = await apiFetch('/api/action', { idea, action, context })
  return data.content
}
