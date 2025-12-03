import { forwardRef } from 'react'
import { useCV } from '../context/CVContext'

export default forwardRef<HTMLDivElement, {}>(function CVPreview(_, ref) {
  const { data } = useCV()
  const accent = data.accent || '#3d7bfd'
  const template = data.template || 'elegant'
  return (
    <section className="card preview" ref={ref as any}>
      <div className={"cv cv-page " + (template === 'minimal' ? 'cv-minimal' : template === 'classic' ? 'cv-classic' : 'cv-elegant')} style={{ ['--accent' as any]: accent }}>
        <div className="cv-header-elegant">
          <div className="avatar">
            {data.photo ? (
              <img src={data.photo} alt="Foto" />
            ) : (
              <div className="avatar-empty" />
            )}
          </div>
          <div className="identity">
            <h1>{data.fullName || 'Tu nombre'}</h1>
            <div className="subtitle">{data.title || 'Tu título profesional'}</div>
          </div>
        </div>

        <div className="cv-body">
          <aside className="cv-sidebar">
            <div className="block">
              <div className="block-title">Contacto</div>
              <div className="block-content muted">
                {[data.email, data.phone, data.location, data.website].filter(Boolean).map((v, i) => (
                  <div key={i}>{v}</div>
                ))}
              </div>
            </div>
            {data.driversLicense && (
              <div className="block">
                <div className="block-title">Carnet de conducir</div>
                <div className="muted">{data.driversLicense}</div>
              </div>
            )}
            {data.skills.length > 0 && (
              <div className="block">
                <div className="block-title">Habilidades</div>
                <div className="skills">
                  {data.skills.filter(Boolean).map((s, i) => (
                    <span key={i} className="skill-pill">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="cv-main">
            {data.summary && (
              <section className="section">
                <h2>Resumen</h2>
                <p>{data.summary}</p>
              </section>
            )}

            {data.experience.length > 0 && (
              <section className="section">
                <h2>Experiencia</h2>
                <ul className="list timeline">
                  {data.experience.map((e, i) => (
                    <li key={i}>
                      <div className="row">
                        <strong>{e.company}</strong>
                        <span className="period">{e.start}{e.end ? `–${e.end}` : ''}</span>
                      </div>
                      <div className="role">{e.role}</div>
                      {e.description && <div className="desc">{e.description}</div>}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {data.education.length > 0 && (
              <section className="section">
                <h2>Educación</h2>
                <ul className="list timeline">
                  {data.education.map((e, i) => (
                    <li key={i}>
                      <div className="row">
                        <strong>{e.school}</strong>
                        <span className="period">{e.start}{e.end ? `–${e.end}` : ''}</span>
                      </div>
                      <div className="role">{e.degree}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>
        </div>
      </div>
    </section>
  )
})

