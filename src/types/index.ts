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

export type SlideType = 'welcome' | 'tabs' | 'info' | 'feature' | 'methods' | 'flowchart' | 'diagram' | 'cheatsheet' | 'merchant' | 'compare' | 'kassa' | 'acquiring' | 'vendors' | 'entities' | 'finish' | 'tools' | 'tgchats'

export interface Slide {
  id: string // unique within lesson only
  type: SlideType
  hasInternalNav?: boolean
  content: WelcomeContent | TabsContent | InfoContent | FeatureContent | MethodsContent | FlowchartContent | DiagramContent | CheatsheetContent | MerchantContent | CompareContent | KassaContent | AcquiringContent | VendorsSlideContent | EntitiesContent | FinishContent | ToolsContent | TgChatsContent
}

export interface MethodItem {
  logo: string  // путь к картинке, напр. '/fonts/Mir 1 from Figma.png'
  name: string
}

export interface MethodsContent {
  heading: string
  methods: MethodItem[]
  mockupImage: string
}

export interface WelcomeContent {
  title: string
  subtitle: string
  ctaLabel: string
  bullets?: string[]
  image?: string   // путь к картинке (import-строка), опционально
}

export interface TeamMember {
  name: string
  role: string
  description: string
  photo?: string
  photoPlaceholder: string // CSS color string e.g. "#4CAF50"
}

export interface VendorItem {
  name: string
  scheme: string
  methods: string[]
  payout: string
  forWhom: string
}

export interface TabItem {
  label: string
  icon?: string
  tagline?: string
  taglineBody?: string
  itemType: 'team' | 'vendor'
  items: TeamMember[] | VendorItem[]
}

export interface TabsContent {
  title?: string
  subtitle?: string
  introImage?: string
  tabs: TabItem[]
}

export interface InfoContent {
  heading: string
  bullets: string[]
  illustration?: string
}

export interface FeatureItem {
  icon: string
  title: string
  subtitle: string
}

export interface FeatureContent {
  heading: string
  paragraphs: string[]
  features: FeatureItem[]
  image?: string
}

export interface DiagramContent {
  heading?: string
  nodes: Array<{ label: string; children?: string[] }>
}

export interface FlowchartStep {
  label: string
  variant: 'blue' | 'green'
  logo?: string
  actions: string[]
}

export interface FlowchartContent {
  heading: string
  buyerLabel: string
  steps: FlowchartStep[]
  finalNode?: { label: string; logo?: string }
}

export interface CheatsheetContent {
  sections: Array<{ title: string; headers: string[]; rows: string[][] }>
}

export interface AcquiringTab {
  label: string
  icon: string
  title: string
  description: string
}

export interface AcquiringContent {
  tabs: AcquiringTab[]
}

export interface KassaContent {
  leftTitle: string
  leftSubtitle: string
  leftSubtitleAccent: string
  leftDesc: string
  leftBullets: string[]
  rightTitle: string
  rightDesc: string
  rightPartners: Array<{ name: string; color: string; logo?: string }>
}

export interface ComparePanel {
  title: string
  description: string
  cardTitle: string
  bullets: string[]
  variant: 'green' | 'blue'
}

export interface CompareContent {
  panels: [ComparePanel, ComparePanel]
}

export interface MerchantContent {
  heading: string
  description: string
  acceptLabel: string
  bullets: string[]
  bgImage: string
  phoneImage: string
  formImage: string
  layout?: 'monitor' | 'phone'
}

export interface VendorCardData {
  name: string
  description: string
  gradient: string
  logo?: string
  logoText?: string
  logoColor?: string
  logoBg?: string
}

export interface VendorsSlideContent {
  title: string
  cards: VendorCardData[]
}

export interface FinishContent {
  title: string
  message: string
  nextLessonId: string | null
}

export interface EntitiesPanel {
  title: string
  paragraphs: string[]
  bullets: string[]
  bulletIcon: 'diamond' | 'circle'
  variant: 'purple' | 'pink'
}

export interface EntitiesContent {
  heading: string
  panels: [EntitiesPanel, EntitiesPanel]
}

export interface ToolItem {
  id: string
  title: string
  gradient: string   // полная CSS строка: "linear-gradient(135deg, #AAA, #BBB)"
  icon: string       // имя иконки из lucide-react
  description: string
  videoUrl?: string  // embed URL (YouTube/Loom), опционально
}

export interface ToolsContent {
  tools: ToolItem[]
}

export interface TgChatItem {
  id: string
  name: string
  avatarImage?: string    // путь /team/filename.jpg
  avatarGradient?: string // CSS gradient если нет картинки
  avatarEmoji?: string    // emoji поверх градиента
  avatarText?: string     // короткий текст поверх градиента (напр. "PM")
  preview: string         // текст под названием в списке
  badge?: number          // число непрочитанных
  cardId: string          // id карточки описания
}

export interface TgChatCard {
  id: string
  name: string
  avatarImage?: string
  avatarGradient?: string
  avatarEmoji?: string
  avatarText?: string
  description: string
  tag: string
}

export interface TgChatsContent {
  chats: TgChatItem[]
  cards: TgChatCard[]
  downloadUrl?: string
  footerNote?: string
}

export interface Topic {
  id: string
  icon: string
  title: string
  lessonId: string
  startTab?: number
}
