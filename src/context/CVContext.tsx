import { createContext, useContext, useMemo, useState } from 'react'
import type { CVData } from '../types'
import { emptyCV } from '../types'

type CVContextValue = {
  data: CVData
  setData: (next: CVData) => void
}

const CVContext = createContext<CVContextValue | null>(null)

export function CVProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CVData>(emptyCV)
  const value = useMemo(() => ({ data, setData }), [data])
  return <CVContext.Provider value={value}>{children}</CVContext.Provider>
}

export function useCV() {
  const ctx = useContext(CVContext)
  if (!ctx) throw new Error('useCV must be used within CVProvider')
  return ctx
}

