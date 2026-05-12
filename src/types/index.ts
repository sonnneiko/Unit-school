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

export type SlideType = 'welcome' | 'tabs' | 'info' | 'feature' | 'methods' | 'flowchart' | 'diagram' | 'cheatsheet' | 'merchant' | 'compare' | 'kassa' | 'acquiring' | 'vendors' | 'entities' | 'finish' | 'tools' | 'tgchats' | 'search' | 'niches' | 'funnel' | 'objections' | 'kstati' | 'recurring' | 'helpdocs' | 'vat' | 'requirements' | 'unitchecks' | 'kanban'

export interface Slide {
  id: string // unique within lesson only
  type: SlideType
  hasInternalNav?: boolean
  content: WelcomeContent | TabsContent | InfoContent | FeatureContent | MethodsContent | FlowchartContent | DiagramContent | CheatsheetContent | MerchantContent | CompareContent | KassaContent | AcquiringContent | VendorsSlideContent | EntitiesContent | FinishContent | ToolsContent | TgChatsContent | SearchContent | NichesContent | FunnelContent | ObjectionsContent | KstatiContent | RecurringOverviewContent | RecurringRequirementsContent | HelpIntroContent | HelpPortalsContent | VatContent | ReqContent | UnitChecksContent | KanbanIntroContent | KanbanBoardContent | KanbanRulesContent | KanbanCommunicationContent
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
  gradient: string
  logo?: string
  description: string
  videoUrl?: string
  ctaLabel?: string  // если задан — показывается кнопка вместо видео
  ctaUrl?: string
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

// ── Search slide ──────────────────────────────────────────────
export interface SearchChannel {
  icon: string
  title: string
  sub: string
  sections: {
    icon: string
    label: string
    color: string
    items: string[]
  }[]
  tip: string
  side: {
    title: string
    items: string[]
  }
}

export interface SearchContent {
  channels: SearchChannel[]
}

// ── Niches slide ──────────────────────────────────────────────
export interface NicheItem {
  id: string
  emoji: string
  title: string
  sub: string
  whoText: string
  whoTags: string[]
  pains: string[]
  script: string
  note: string
  lifehack?: string
}

export interface NichesContent {
  niches: NicheItem[]
}

// ── Funnel slide ──────────────────────────────────────────────
export interface FunnelSection {
  icon: string
  label: string
  color: string
  content: string
}

export interface FunnelStage {
  emoji: string
  title: string
  sub: string
  sections: FunnelSection[]
  side: 'followup' | 'sources' | 'none'
}

export interface FunnelContent {
  stages: FunnelStage[]
}

// ── Objections slide ──────────────────────────────────────────
export interface ObjectionItem {
  emoji: string
  short: string
  title: string
  why: string
  reply: string[]
  script: string
  tip: string
}

export interface ObjectionsContent {
  objections: ObjectionItem[]
}

// ── Kstati slide ──────────────────────────────────────────────
export interface KstatiTip {
  title: string
  text: string
}

export interface KstatiContent {
  tips: KstatiTip[]
  image?: string
}

export interface Topic {
  id: string
  icon: string
  title: string
  lessonId: string
  startTab?: number
}

// ── Recurring slides ──────────────────────────────────────────
export interface RecurringNote {
  title: string
  text: string
  warn?: boolean
}

export interface RecurringOverviewContent {
  variant: 'overview'
  tag: string
  title: string
  description: string
  facts: string[]
  notes: RecurringNote[]
}

export interface RecurringRequirement {
  emoji: string
  name: string
  desc: string
}

export interface RecurringChecklistItem {
  label: string
  done: boolean
}

export interface RecurringRequirementsContent {
  variant: 'requirements'
  eyebrow: string
  title: string
  sub: string
  requirements: RecurringRequirement[]
  checklist: RecurringChecklistItem[]
  badge: string
}

// ── HelpDocs slides ───────────────────────────────────────────
export interface HelpUseCard {
  title: string
  text: string
}

export interface HelpIntroContent {
  variant: 'intro'
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  useCases: HelpUseCard[]
}

export interface HelpPortalSection {
  icon: string
  name: string
  desc: string
}

export interface HelpPortal {
  badge: string
  badgeVariant: 'blue' | 'purple'
  url: string
  tagline: string
  sections: HelpPortalSection[]
  ctaUrl: string
}

export interface HelpPortalsContent {
  variant: 'portals'
  title: string
  subtitle: string
  portals: [HelpPortal, HelpPortal]
}

// ── VAT slides ────────────────────────────────────────────────
export interface VatCompareCard {
  label: string
  title: string
  desc: string
  badge: string
  variant: 'receipt' | 'txn'
}

export interface VatDefinitionContent {
  variant: 'definition'
  eyebrow: string
  title: string
  alert: string
  description: string
  rightLabel: string
  compareCards: VatCompareCard[]
  note: string
}

export interface VatLawContent {
  variant: 'law'
  eyebrow: string
  title: string
  lawTitle: string
  lawText: string
  description: string
  rightLabel: string
  taxedItems: string[]
  notTaxedItems: string[]
  note: string
}

export interface VatTariff {
  tier: string
  volume: string
  baseRate: string
  vat: string
  total: string
  highlight?: boolean
}

export interface VatCalculationContent {
  variant: 'calculation'
  eyebrow: string
  title: string
  subtitle: string
  formulaEq: string
  formulaSub: string
  formulaNotes: string[]
  tariffs: VatTariff[]
}

export interface VatBankNote {
  name: string
  desc: string
  variant: 'tochka' | 'standard'
}

export interface VatSpecialContent {
  variant: 'special'
  eyebrow: string
  title: string
  banks: VatBankNote[]
  rightLabel: string
  minCommTitle: string
  minCommDesc: string
  minCommCalc: string
  minCommConclusion: string
  whereNote: string
}

export interface VatFaqItem {
  q: string
  a: string
}

export interface VatFaqContent {
  variant: 'faq'
  eyebrow: string
  title: string
  items: VatFaqItem[]
}

export type VatContent = VatDefinitionContent | VatLawContent | VatCalculationContent | VatSpecialContent | VatFaqContent

// ── Requirements slides ───────────────────────────────────────
export interface ReqTimelineItem {
  icon: string
  text: string
}

export interface ReqOutcome {
  label: string
  type: 'starter' | 'final'
  title: string
  desc: string
}

export interface ReqIntroContent {
  variant: 'req-intro'
  eyebrow: string
  title: string
  timelineItems: ReqTimelineItem[]
  outcomesLabel: string
  outcomes: ReqOutcome[]
  note: string
}

export interface ReqStatus {
  key: 'active' | 'revision' | 'recheck' | 'archived' | 'blocked'
  name: string
  desc: string
  action: string
}

export interface ReqStatusesContent {
  variant: 'req-statuses'
  eyebrow: string
  title: string
  statuses: ReqStatus[]
}

export interface ReqTechCard {
  icon: string
  title: string
  desc: string
}

export interface ReqSiteContent {
  variant: 'req-site'
  eyebrow: string
  title: string
  checklist: string[]
  rightLabel: string
  techCards: ReqTechCard[]
  note: string
}

export interface ReqPortalRow {
  icon: string
  text: string
  badge?: string
  badgeVariant?: 'ru' | 'money' | 'both'
}

export interface ReqPortal {
  badgeLabel: string
  badgeVariant: 'ru' | 'money'
  url: string
  tagline: string
  rows: ReqPortalRow[]
}

export interface ReqPortalsContent {
  variant: 'req-portals'
  eyebrow: string
  title: string
  portals: [ReqPortal, ReqPortal]
}

export interface ReqProhibitedContent {
  variant: 'req-prohibited'
  eyebrow: string
  title: string
  items: string[]
}

export type ReqContent = ReqIntroContent | ReqStatusesContent | ReqSiteContent | ReqPortalsContent | ReqProhibitedContent

// ── UnitChecks (ЮнитЧеки) slides ─────────────────────────────
export interface UnitChecksIntroContent {
  variant: 'uc-intro'
  eyebrow: string
  title: string
  warn: string
  checklistLabel: string
  checklist: string[]
  image: string
}

export interface UnitChecksLawCard {
  title: string
  text: string
}

export interface UnitChecksReqItem {
  icon: string
  text: string
}

export interface UnitChecksFineRow {
  name: string
  ip: string
  ur: string
  ipClass?: 'red' | 'orange'
  urClass?: 'red' | 'orange'
}

export interface UnitChecksLawContent {
  variant: 'uc-law'
  eyebrow: string
  title: string
  lawCard: UnitChecksLawCard
  reqItems: UnitChecksReqItem[]
  rightLabel: string
  fines: UnitChecksFineRow[]
  alert: string
}

export interface UnitChecksSchemeNode {
  icon: string
  title: string
  role: string
  desc: string
  variant: 'merchant' | 'buyer' | 'unitpay' | 'ofd' | 'fns'
}

export interface UnitChecksSchemeContent {
  variant: 'uc-scheme'
  eyebrow: string
  title: string
  nodes: UnitChecksSchemeNode[]
}

export interface UnitChecksDataBlock {
  color: 'blue' | 'purple' | 'green'
  title: string
  tags?: string[]
  note?: string
  text?: string
}

export interface UnitChecksDataContent {
  variant: 'uc-data'
  eyebrow: string
  title: string
  leftBlocks: UnitChecksDataBlock[]
  rightLabel: string
  vatRates: string[]
  vatNote: string
  partnersBlock: UnitChecksDataBlock
}

export interface UnitChecksFaqItem {
  q: string
  a: string
}

export interface UnitChecksFaqContent {
  variant: 'uc-faq'
  eyebrow: string
  title: string
  items: UnitChecksFaqItem[]
}

export type UnitChecksContent =
  | UnitChecksIntroContent
  | UnitChecksLawContent
  | UnitChecksSchemeContent
  | UnitChecksDataContent
  | UnitChecksFaqContent

export type KanbanColumn = {
  id: string
  badge: string
  badgeColor: 'red' | 'blue' | 'yellow' | 'green' | 'teal' | 'gray' | 'purple'
  step: number | null
  who: string
  desc: string
  hint: string
  cards?: Array<{ title: string; assignee: string; assigneeColor: string }>
}

export type KanbanIntroContent = {
  variant: 'intro'
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  checklist: Array<{ step: number; text: string }>
}

export type KanbanBoardContent = {
  variant: 'board'
  boardTitle: string
  columns: KanbanColumn[]
}

export type KanbanRulesContent = {
  variant: 'rules'
  title: string
  formatLabel: string
  formatExample: string
  examples: string[]
  bodyRules: string[]
  warning: string
}

export type KanbanCommunicationContent = {
  variant: 'communication'
  title: string
  urgentText: string
  urgentChat: string
  dmAllowed: string[]
  dmForbidden: string[]
  exampleMessages: Array<{ sender: string; text: string }>
}
