import { useCV } from '../context/CVContext'
import type { CVData, Experience, Education } from '../types'
import { useRef } from 'react'
import { generateImprovement } from '../lib/ollama'

function Text({ label, name, type = 'text', placeholder }: { label: string; name: keyof CVData; type?: string; placeholder?: string }) {
  const { data, setData } = useCV()
  return (
    <label>
      {label}
      <input
        type={type}
        placeholder={placeholder}
        value={(data[name] as string) || ''}
        onChange={(e) => setData({ ...data, [name]: e.target.value })}
      />
    </label>
  )
}

 

function TextArea({ label, name, placeholder }: { label: string; name: keyof CVData; placeholder?: string }) {
  const { data, setData } = useCV()
  return (
    <label className="grid-full">
      {label}
      <textarea
        rows={4}
        placeholder={placeholder}
        value={(data[name] as string) || ''}
        onChange={(e) => setData({ ...data, [name]: e.target.value })}
      />
    </label>
  )
}

function ListSkills() {
  const { data, setData } = useCV()
  const addSkill = () => setData({ ...data, skills: [...data.skills, ''] })
  const updateSkill = (i: number, v: string) => setData({ ...data, skills: data.skills.map((s, idx) => (idx === i ? v : s)) })
  const removeSkill = (i: number) => setData({ ...data, skills: data.skills.filter((_, idx) => idx !== i) })
  return (
    <div className="grid-full">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: '8px 0' }}>Habilidades</h3>
        <button className="btn success" type="button" onClick={addSkill}>Añadir</button>
      </div>
      {data.skills.length === 0 && <div className="muted">Sin habilidades todavía</div>}
      {data.skills.map((skill, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input value={skill} placeholder="Ej. React" onChange={(e) => updateSkill(i, e.target.value)} />
          <button className="btn danger" type="button" onClick={() => removeSkill(i)}>Quitar</button>
        </div>
      ))}
    </div>
  )
}

function SectionExperience() {
  const { data, setData } = useCV()
  const add = () => setData({ ...data, experience: [...data.experience, { company: '', role: '', start: '', end: '', description: '' }] })
  const update = (i: number, patch: Partial<Experience>) => setData({ ...data, experience: data.experience.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) })
  const remove = (i: number) => setData({ ...data, experience: data.experience.filter((_, idx) => idx !== i) })

  const improve = async (i: number) => {
    const input = data.experience[i]?.description || ''
    if (!input.trim()) return
    update(i, { description: 'Mejorando con IA…' })
    try {
      const out = await generateImprovement('experience', input)
      update(i, { description: out })
    } catch {
      update(i, { description: input })
    }
  }

  return (
    <div className="grid-full">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: '8px 0' }}>Experiencia</h3>
        <button className="btn success" type="button" onClick={add}>Añadir</button>
      </div>
      {data.experience.length === 0 && <div className="muted">Sin experiencias todavía</div>}
      {data.experience.map((e, i) => (
        <div key={i} className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div className="form grid-2">
            <label>
              Empresa
              <input value={e.company} onChange={(ev) => update(i, { company: ev.target.value })} />
            </label>
            <label>
              Rol / Puesto
              <input value={e.role} onChange={(ev) => update(i, { role: ev.target.value })} />
            </label>
            <label>
              Inicio
              <input value={e.start} placeholder="2022" onChange={(ev) => update(i, { start: ev.target.value })} />
            </label>
            <label>
              Fin
              <input value={e.end} placeholder="Actualidad" onChange={(ev) => update(i, { end: ev.target.value })} />
            </label>
            <label className="grid-full">
              Descripción
              <textarea rows={3} value={e.description} onChange={(ev) => update(i, { description: ev.target.value })} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="btn ai" type="button" disabled={e.description === 'Mejorando con IA…'} onClick={() => improve(i)}>
                  {e.description === 'Mejorando con IA…' ? 'Mejorando…' : 'Mejorar con IA'}
                </button>
              </div>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button className="btn danger" type="button" onClick={() => remove(i)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function SectionEducation() {
  const { data, setData } = useCV()
  const add = () => setData({ ...data, education: [...data.education, { school: '', degree: '', start: '', end: '' }] })
  const update = (i: number, patch: Partial<Education>) => setData({ ...data, education: data.education.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) })
  const remove = (i: number) => setData({ ...data, education: data.education.filter((_, idx) => idx !== i) })
  return (
    <div className="grid-full">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: '8px 0' }}>Educación</h3>
        <button className="btn success" type="button" onClick={add}>Añadir</button>
      </div>
      {data.education.length === 0 && <div className="muted">Sin educación registrada</div>}
      {data.education.map((e, i) => (
        <div key={i} className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div className="form grid-2">
            <label>
              Centro
              <input value={e.school} onChange={(ev) => update(i, { school: ev.target.value })} />
            </label>
            <label>
              Título
              <input value={e.degree} onChange={(ev) => update(i, { degree: ev.target.value })} />
            </label>
            <label>
              Inicio
              <input value={e.start} placeholder="2018" onChange={(ev) => update(i, { start: ev.target.value })} />
            </label>
            <label>
              Fin
              <input value={e.end} placeholder="2022" onChange={(ev) => update(i, { end: ev.target.value })} />
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn danger" type="button" onClick={() => remove(i)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CVForm() {
  return (
    <>
    <section className="card" id="datos">
      <h2>Datos del CV</h2>
      <div className="form grid-2">
        <Text label="Nombre completo" name="fullName" placeholder="Ej. Ana Pérez" />
        <Text label="Título profesional" name="title" placeholder="Ej. Desarrolladora Frontend" />
        <SmartSummary />
        <Text label="Email" name="email" type="email" placeholder="ana@correo.com" />
        <Text label="Teléfono" name="phone" placeholder="+34 600 000 000" />
        <Text label="Ubicación" name="location" placeholder="Madrid, España" />
        <Text label="Sitio web" name="website" placeholder="https://portfolio.com" />

        <AvatarUpload />
        <AccentPicker />
        <TemplatePicker />
      </div>
    </section>
    <section className="card" id="carnet">
      <h2>Carnet de conducir</h2>
      <div className="form grid-2">
        <Text label="Tipo de carnet" name="driversLicense" placeholder="Ej. B, A2, C1" />
        <label>
          Nota
          <div className="muted">Puedes escribir varios: "B, A2"</div>
        </label>
      </div>
    </section>
    <section className="card" id="habilidades">
      <h2>Habilidades</h2>
      <div className="form">
        <ListSkills />
      </div>
    </section>
    <section className="card" id="experiencia">
      <h2>Experiencia</h2>
      <div className="form">
        <SectionExperience />
      </div>
    </section>
    <section className="card" id="educacion">
      <h2>Educación</h2>
      <div className="form">
        <SectionEducation />
      </div>
    </section>
    </>
  )
}

function SmartSummary() {
  const { data, setData } = useCV()
  const improve = async () => {
    const input = data.summary || ''
    if (!input.trim()) return
    setData({ ...data, summary: 'Mejorando con IA…' })
    try {
      const out = await generateImprovement('summary', input)
      setData({ ...data, summary: out })
    } catch {
      setData({ ...data, summary: input })
    }
  }
  return (
    <label className="grid-full">
      Resumen
      <textarea rows={4} placeholder="Breve descripción profesional" value={data.summary} onChange={(e) => setData({ ...data, summary: e.target.value })} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <button className="btn ai" type="button" disabled={data.summary === 'Mejorando con IA…'} onClick={improve}>
          {data.summary === 'Mejorando con IA…' ? 'Mejorando…' : 'Mejorar con IA'}
        </button>
      </div>
    </label>
  )
}

function AvatarUpload() {
  const { data, setData } = useCV()
  const inputRef = useRef<HTMLInputElement>(null)
  const onSelect = async (file: File) => {
    const reader = new FileReader()
    reader.onload = () => setData({ ...data, photo: String(reader.result) })
    reader.readAsDataURL(file)
  }
  const clear = () => setData({ ...data, photo: '' })
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: '8px 0' }}>Fotografía</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" type="button" onClick={() => inputRef.current?.click()}>Subir</button>
          {data.photo && <button className="btn" type="button" onClick={clear}>Quitar</button>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f) }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', background: 'var(--surface-2)' }}>
          {data.photo && <img src={data.photo} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div className="muted">Formato recomendado cuadrado, centrado.</div>
      </div>
    </div>
  )
}

function AccentPicker() {
  const { data, setData } = useCV()
  return (
    <label>
      Color de acento
      <input type="color" value={data.accent || '#3d7bfd'} onChange={(e) => setData({ ...data, accent: e.target.value })} />
    </label>
  )
}

function TemplatePicker() {
  const { data, setData } = useCV()
  const set = (t: 'elegant' | 'minimal' | 'classic') => setData({ ...data, template: t })
  const active = data.template || 'elegant'
  return (
    <div className="grid-full">
      <h3 style={{ margin: '8px 0' }}>Plantilla</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className={"btn" + (active === 'elegant' ? ' primary' : '')} type="button" onClick={() => set('elegant')}>Elegante</button>
        <button className={"btn" + (active === 'minimal' ? ' primary' : '')} type="button" onClick={() => set('minimal')}>Minimal</button>
        <button className={"btn" + (active === 'classic' ? ' primary' : '')} type="button" onClick={() => set('classic')}>Clásica</button>
      </div>
    </div>
  )
}

