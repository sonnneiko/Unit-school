// src/types/index.ts

export type Level = 'novice' | 'junior' | 'middle' | 'senior'

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'support' | 'account_manager' | 'security' | 'developer' | 'manager'
  progress: Record<string, number> // lessonId → currentSlideIndex (0-based)
  lastActive?: string // ISO date string, e.g. "2026-04-20"
  photo?: string // base64 data URL from FileReader.readAsDataURL
  firstName?: string
  lastName?: string
  patronymic?: string
  phone?: string
  birthDate?: string
  level?: Level // admin override; absent = computed
  streak: number // active days in a row; 0 = never or reset
  lastStreakDate?: string // YYYY-MM-DD local date of last streak activity
  telegram?: string
}

export interface Lesson {
  id: string
  title: string
  tag: string
  published: boolean
  slides: Slide[]
}

export type SlideType = 'welcome' | 'tabs' | 'info' | 'diagram' | 'cheatsheet' | 'finish'

export interface Slide {
  id: string // unique within lesson only
  type: SlideType
  content: WelcomeContent | TabsContent | InfoContent | DiagramContent | CheatsheetContent | FinishContent
}

export interface WelcomeContent {
  title: string
  subtitle: string
  ctaLabel: string
}

export interface TeamMember {
  name: string
  role: string
  description: string
  photoPlaceholder: string // CSS color string e.g. "#4CAF50"
}

export interface VendorItem {
  name: string
  scheme: string
  methods: string[]
  payout: string
  forWhom: string
}

export interface TabsContent {
  tabs: Array<{
    label: string
    itemType: 'team' | 'vendor' // discriminator for safe runtime narrowing
    items: TeamMember[] | VendorItem[]
  }>
}

export interface InfoContent {
  heading: string
  bullets: string[]
  illustration?: string
}

export interface DiagramContent {
  heading?: string
  nodes: Array<{ label: string; children?: string[] }>
}

export interface CheatsheetContent {
  sections: Array<{ title: string; headers: string[]; rows: string[][] }>
}

export interface FinishContent {
  title: string
  message: string
  nextLessonId: string | null
}
