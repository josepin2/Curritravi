const MODEL = 'gemma3:12b-it-qat'

type GenerateRequest = {
  model: string
  prompt: string
  stream?: boolean
}

type GenerateResponse = {
  response: string
}

function buildPrompt(kind: 'summary' | 'experience', input: string) {
  const base = `Mejora el texto para un currículum profesional en español. Tono conciso y claro. Usa logros cuantificables solo si el texto original los aporta; NO inventes cifras. Evita redundancias y muletillas. Corrige gramática y estilo. No añadas instrucciones, encabezados, ni placeholders.`
  if (kind === 'summary') {
    return `${base}\n\nTipo: Resumen profesional\n\nTexto original:\n${input}\n\nDevuelve SOLO el resumen mejorado en 2-3 frases y máximo 300 caracteres. No uses corchetes ni incluyas \"menciona\" o \"por ejemplo\".`
  }
  return `${base}\n\nTipo: Descripción de experiencia\n\nTexto original:\n${input}\n\nDevuelve máximo 4 bullets, cada uno con ≤ 20 palabras y verbos de acción. No inventes cifras; si faltan, usa formulación neutra. Formato: cada línea iniciada por '• ' sin encabezados ni notas.`
}

export async function generateImprovement(kind: 'summary' | 'experience', input: string, signal?: AbortSignal): Promise<string> {
  const url = '/ollama/api/generate'
  const body: GenerateRequest = { model: MODEL, prompt: buildPrompt(kind, input), stream: false }
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal })
  if (!res.ok) throw new Error(`Ollama error ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const data = (await res.json()) as GenerateResponse
    return sanitizeOutput(kind, (data.response || '').trim())
  }
  // Fallback para NDJSON/stream en algunos servidores
  const text = await res.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  let out = ''
  for (const line of lines) {
    try {
      const obj = JSON.parse(line)
      if (typeof obj.response === 'string') out += obj.response
    } catch {}
  }
  return sanitizeOutput(kind, out.trim())
}

function sanitizeOutput(kind: 'summary' | 'experience', text: string): string {
  // Eliminar placeholders o instrucciones entre corchetes y frases guía
  let out = text
    .replace(/\[[^\]]*\]/g, '')
    .replace(/\b(menciona|por ejemplo|placeholder)\b[^\n\r\.]*[\.|\n|\r]?/gi, '')
    .replace(/Tipo\s*:\s*[^\n\r]*[\n\r]?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (kind === 'experience') {
    const lines = out.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    const normalized = lines.map(l => l.replace(/^[–-•]\s*/, '• ')).filter(Boolean)
    const limited = normalized.slice(0, 4).map(l => limitWords(l, 20))
    out = limited.join('\n')
  } else {
    out = limitSentences(out, 3)
    out = truncateChars(out, 300)
  }
  return out
}

function limitSentences(text: string, max: number): string {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return parts.slice(0, max).join(' ').trim()
}

function truncateChars(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim()
}

function limitWords(line: string, max: number): string {
  const isBullet = line.startsWith('• ')
  const raw = isBullet ? line.slice(2) : line
  const words = raw.split(/\s+/).filter(Boolean)
  const trimmed = words.slice(0, max).join(' ')
  return (isBullet ? '• ' : '') + trimmed
}
