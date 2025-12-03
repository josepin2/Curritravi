export type Experience = {
  company: string
  role: string
  start: string
  end?: string
  description?: string
}

export type Education = {
  school: string
  degree: string
  start: string
  end?: string
}

export type CVData = {
  fullName: string
  title: string
  summary: string
  email: string
  phone: string
  location: string
  website?: string
  photo?: string
  accent?: string
  template?: 'elegant' | 'minimal' | 'classic'
  driversLicense?: string
  skills: string[]
  experience: Experience[]
  education: Education[]
}

export const emptyCV: CVData = {
  fullName: '',
  title: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  photo: '',
  accent: '#3d7bfd',
  template: 'elegant',
  driversLicense: '',
  skills: [],
  experience: [],
  education: [],
}

