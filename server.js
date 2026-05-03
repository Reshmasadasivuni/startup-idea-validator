import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/ }))
app.use(express.json())

const VALIDATE_PROMPT = `You are a brutally honest startup analyst with 20 years of venture capital experience.

Analyze the given startup idea and return ONLY a raw JSON object — no markdown, no explanation, nothing outside the JSON.

Return exactly this shape:
{
  "summary": "One sentence explaining what this startup does and who it serves.",
  "target_users": ["Specific user type 1", "Specific user type 2", "Specific user type 3"],
  "market_opportunity": [
    "Specific market size signal or real demand evidence for this category.",
    "Why NOW is the right timing — name the macro trend, tech shift, or behavior change.",
    "Who specifically will pay first and what pain they currently endure."
  ],
  "competition_insight": [
    "Name 1-2 real existing players and their biggest exploitable weakness.",
    "Market saturation level with reason: Low/Medium/High — be specific.",
    "Where this idea can carve a defensible niche competitors cannot easily copy."
  ],
  "monetization_strategy": [
    "Primary revenue model with realistic price point and payment cadence.",
    "Secondary revenue stream or upsell path once core product is working.",
    "Which customer segment unlocks revenue fastest and how to reach them."
  ],
  "execution_difficulty": {
    "level": "Medium",
    "reason": "Two sentences on the single hardest execution challenge and what makes it hard."
  },
  "pros": [
    "Specific structural advantage this idea has over alternatives.",
    "Defensible moat or network effect this can build over time.",
    "Timing or market condition that favors this idea right now.",
    "Customer behavior or habit that this idea aligns with naturally."
  ],
  "cons": [
    "Core limitation that directly constrains growth or margin.",
    "Structural business model weakness that will surface at scale.",
    "Customer acquisition challenge specific to this idea's audience.",
    "Regulatory, legal, or resource constraint that cannot be ignored."
  ],
  "risks": [
    "Business risk: specific scenario that kills revenue or survival.",
    "Technical risk: implementation or infrastructure challenge at scale.",
    "Market risk: external force or shift that could drain traction.",
    "Competitive risk: how an incumbent or funded rival could neutralize this."
  ],
  "suggestions": [
    "Concrete product change that directly improves retention or conversion.",
    "Specific go-to-market tactic for landing the first 100 paying users.",
    "Partnership or distribution channel that shortcuts customer acquisition.",
    "Feature or positioning pivot that creates clear differentiation."
  ],
  "next_steps": [
    "Do THIS specific thing in the next 48 hours to validate real demand.",
    "Build or test THIS in week 1 to confirm core assumption.",
    "Reach THIS measurable milestone by end of month 1.",
    "Achieve THIS outcome in 90 days to be credible to investors or customers."
  ],
  "score": 7,
  "score_reason": "2-3 sentences explaining exactly why this score — reference specific strengths and weaknesses of this idea.",
  "verdict": "One punchy, opinionated final call on whether to pursue this idea."
}

Rules:
- Every single point must be specific to THIS idea. Zero generic startup advice allowed.
- Each array item: one sentence, max 22 words. Be direct.
- execution_difficulty.level must be exactly one of: "Low", "Medium", "High"
- score is integer 1-10. Most ideas are 4-6. Reserve 8+ for genuinely differentiated concepts.
- Never use these words: unique, innovative, leverage, robust, seamlessly, synergy, game-changer, revolutionary, disruptive.`

const ACTION_PROMPTS = {
  pitch: (idea) => `Write a compelling 30-second elevator pitch for this startup idea: "${idea}"

Structure it exactly like this:
**Hook:** [One sentence that grabs attention — lead with the problem or a shocking stat]
**Problem:** [The specific pain in one sentence]
**Solution:** [What this startup does, in 1-2 sentences]
**Why now:** [Market timing or trend making this urgent]
**Traction/Ask:** [What you're looking for or have already done]

Make it sound like a confident YC Demo Day pitch. Be specific, punchy, and authentic. No fluff.`,

  competitors: (idea) => `Map out the competitive landscape for this startup idea: "${idea}"

Return a structured breakdown:

**Direct Competitors** (name 3-4 real companies):
For each: name, their core strength, their biggest exploitable weakness

**Indirect Competitors / Substitutes:**
What are users doing today instead of using this product?

**Market Gaps:**
List 2-3 specific gaps none of the above fully address

**Competitive Moat Strategy:**
The one thing this startup should build that would be hardest for competitors to copy

**Difficulty to Enter:** Easy / Medium / Hard — and why in one sentence`,

  improve: (idea, score) => `This startup idea currently scores ${score}/10: "${idea}"

Give 5 specific, ranked changes the founder should make to increase the viability score.

For each improvement:
**Change [N]:** What exactly to do differently
**Impact:** Why this raises the score (which weakness it fixes)
**How:** Concrete first step to implement this

Start with the highest-impact change. Be tactical and direct. No generic advice.`,

  refine: (idea) => `Help me refine and sharpen this startup idea: "${idea}"

Present 3 strategic angles the founder should consider:

**Angle 1 — Niche Down:**
[Describe a narrower, more focused version] → Target user + core promise

**Angle 2 — Platform Play:**
[Describe a broader, more scalable version] → Expansion logic + endgame

**Angle 3 — Business Model Pivot:**
[Same problem, completely different monetization or delivery model] → Why it might work better

For each angle: 2-3 sentences max. End with a recommendation on which angle has the most potential and why.`,
}

async function groq(messages, temperature = 0.75) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      temperature,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    if (response.status === 401) throw Object.assign(new Error('Invalid Groq API key — check your .env file'), { status: 401 })
    if (response.status === 429) throw Object.assign(new Error('Rate limited — try again in a moment'), { status: 429 })
    throw Object.assign(new Error(err.error?.message ?? 'Groq API error'), { status: 500 })
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

app.post('/api/validate', async (req, res) => {
  const { idea } = req.body
  if (!idea || typeof idea !== 'string' || !idea.trim()) {
    return res.status(400).json({ error: 'idea is required' })
  }

  try {
    const text = await groq([
      { role: 'system', content: VALIDATE_PROMPT },
      { role: 'user', content: `Startup idea: ${idea.trim()}` },
    ], 0.7)

    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
    const result = JSON.parse(cleaned)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(err.status ?? 500).json({ error: err.message ?? 'Validation failed' })
  }
})

app.post('/api/action', async (req, res) => {
  const { idea, action, context } = req.body
  if (!idea || !action) return res.status(400).json({ error: 'idea and action are required' })

  const promptFn = ACTION_PROMPTS[action]
  if (!promptFn) return res.status(400).json({ error: `Unknown action: ${action}` })

  try {
    const content = await groq([
      { role: 'user', content: promptFn(idea, context) },
    ], 0.8)
    res.json({ content })
  } catch (err) {
    console.error(err)
    res.status(err.status ?? 500).json({ error: err.message ?? 'Action failed' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`))
