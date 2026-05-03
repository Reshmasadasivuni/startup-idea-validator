import { useState } from 'react'
import InputPanel from '../components/InputPanel'
import ResultPanel from '../components/ResultPanel'
import { validateIdea } from '../api/validateIdea'

export default function Home() {
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleValidate() {
    const trimmed = idea.trim()
    if (!trimmed) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await validateIdea(trimmed)
      setResult(data)
    } catch (err) {
      setError(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">

        {/* Left — sticky input */}
        <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0">
          <div className="lg:sticky lg:top-[calc(3.5rem+2rem)]">
            <InputPanel
              idea={idea}
              setIdea={setIdea}
              onValidate={handleValidate}
              loading={loading}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-white/[0.06] shrink-0" />

        {/* Right — results */}
        <div className="flex-1 min-w-0">
          <ResultPanel
            result={result}
            loading={loading}
            error={error}
            idea={idea}
          />
        </div>
      </div>
    </div>
  )
}
