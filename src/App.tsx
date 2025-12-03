import { useEffect, useRef, useState } from 'react'
import { CVProvider, useCV } from './context/CVContext'
import CVForm from './components/CVForm'
import CVPreview from './components/CVPreview'
import type { CVData } from './types'
import { emptyCV } from './types'
import { readLocalStorage, useLocalStorage } from './hooks/useLocalStorage'

function Shell() {
  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = () => {
    document.body.classList.add('only-cv')
    const cleanup = () => document.body.classList.remove('only-cv')
    const onAfterPrint = () => { cleanup(); window.removeEventListener('afterprint', onAfterPrint) }
    window.addEventListener('afterprint', onAfterPrint)
    window.print()
    setTimeout(cleanup, 1500)
  }
  const { data, setData } = useCV()
  const [loaded, setLoaded] = useState(false)
  const STORAGE_KEY = 'curritravi:data'
  const existing = readLocalStorage<CVData>(STORAGE_KEY, emptyCV)
  useEffect(() => { if (!loaded) { setData(existing); setLoaded(true) } }, [])
  useLocalStorage(STORAGE_KEY, data)


  const resetAll = () => setData(emptyCV)

  return (
    <div className="app">
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">Curritravi</div>
          <nav className="nav">
            <a href="#datos">Datos</a>
            <a href="#carnet">Carnet</a>
            <a href="#habilidades">Habilidades</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#educacion">Educación</a>
          </nav>
          <div className="sidebar-actions">
            <button className="btn" onClick={resetAll}>Reiniciar</button>
            <button className="btn primary" onClick={handlePrint}>Exportar PDF</button>
          </div>
        </aside>
        <section className="content">
          <CVForm />
          <div className="print-only">
            <CVPreview ref={printRef} />
          </div>
        </section>
      </div>
      <footer className="app-footer">Creación de José M.C · 2026 · Todos los derechos reservados</footer>
    </div>
  )
}

export default function App() {
  return (
    <CVProvider>
      <Shell />
    </CVProvider>
  )
}

