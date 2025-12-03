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
      <header className="app-header">
        <h1>Curritravi</h1>
        <p>Genera tu currículum de forma rápida y atractiva</p>
        <div className="header-actions">
          <button className="btn" onClick={resetAll}>Reiniciar</button>
          <button className="btn primary" onClick={handlePrint}>Exportar PDF</button>
        </div>
      </header>
      <main className="grid">
        <CVForm />
        <CVPreview ref={printRef} />
      </main>
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

