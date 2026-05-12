import type { Slide as SlideType, Lesson, WelcomeContent, InfoContent, FeatureContent, MethodsContent, FlowchartContent, DiagramContent, CheatsheetContent, TabsContent, MerchantContent, CompareContent, KassaContent, AcquiringContent, VendorsSlideContent, EntitiesContent, FinishContent, ToolsContent, TgChatsContent, SearchContent, NichesContent, FunnelContent, ObjectionsContent, KstatiContent, RecurringOverviewContent, RecurringRequirementsContent, HelpIntroContent, HelpPortalsContent, VatContent, ReqContent, UnitChecksContent, KanbanIntroContent, KanbanBoardContent, KanbanRulesContent, KanbanCommunicationContent } from '../../types'
import { WelcomeSlide } from './WelcomeSlide'
import { InfoSlide } from './InfoSlide'
import { FeatureSlide } from './FeatureSlide'
import { MethodsSlide } from './MethodsSlide'
import { FlowchartSlide } from './FlowchartSlide'
import { DiagramSlide } from './DiagramSlide'
import { CheatsheetSlide } from './CheatsheetSlide'
import { TabsSlide } from './TabsSlide'
import { MerchantSlide } from './MerchantSlide'
import { CompareSlide } from './CompareSlide'
import { KassaSlide } from './KassaSlide'
import { AcquiringSlide } from './AcquiringSlide'
import { VendorsSlide } from './VendorsSlide'
import { EntitiesSlide } from './EntitiesSlide'
import { FinishSlide } from './FinishSlide'
import { ToolsSlide } from './ToolsSlide'
import { TgChatsSlide } from './TgChatsSlide'
import { SearchSlide } from './SearchSlide'
import { NichesSlide } from './NichesSlide'
import { FunnelSlide } from './FunnelSlide'
import { ObjectionsSlide } from './ObjectionsSlide'
import { KstatiSlide } from './KstatiSlide'
import { RecurringSlide } from './RecurringSlide'
import { HelpDocsSlide } from './HelpDocsSlide'
import { VatSlide } from './VatSlide'
import { RequirementsSlide } from './RequirementsSlide'
import { UnitChecksSlide } from './UnitChecksSlide'
import { KanbanSlide } from './KanbanSlide'

interface Props {
  slide: SlideType
  onNext: () => void
  nextLesson?: Lesson | null
  onLastTab?: (isLast: boolean) => void
  initialTab?: number
}

export function Slide({ slide, onNext, nextLesson, onLastTab, initialTab }: Props) {
  switch (slide.type) {
    case 'welcome':
      return <WelcomeSlide content={slide.content as WelcomeContent} onNext={onNext} />
    case 'info':
      return <InfoSlide content={slide.content as InfoContent} />
    case 'feature':
      return <FeatureSlide content={slide.content as FeatureContent} />
    case 'methods':
      return <MethodsSlide content={slide.content as MethodsContent} />
    case 'flowchart':
      return <FlowchartSlide content={slide.content as FlowchartContent} />
    case 'diagram':
      return <DiagramSlide content={slide.content as DiagramContent} />
    case 'cheatsheet':
      return <CheatsheetSlide content={slide.content as CheatsheetContent} />
    case 'tabs':
      return <TabsSlide content={slide.content as TabsContent} onLastTab={onLastTab} />
    case 'merchant':
      return <MerchantSlide content={slide.content as MerchantContent} />
    case 'compare':
      return <CompareSlide content={slide.content as CompareContent} />
    case 'kassa':
      return <KassaSlide content={slide.content as KassaContent} />
    case 'acquiring':
      return <AcquiringSlide content={slide.content as AcquiringContent} onLastTab={onLastTab} initialTab={initialTab} />
    case 'vendors':
      return <VendorsSlide content={slide.content as VendorsSlideContent} />
    case 'entities':
      return <EntitiesSlide content={slide.content as EntitiesContent} />
    case 'finish':
      return <FinishSlide content={slide.content as FinishContent} nextLesson={nextLesson} />
    case 'tools':
      return <ToolsSlide content={slide.content as ToolsContent} onNext={onNext} />
    case 'tgchats':
      return <TgChatsSlide content={slide.content as TgChatsContent} />
    case 'search':
      return <SearchSlide content={slide.content as SearchContent} />
    case 'niches':
      return <NichesSlide content={slide.content as NichesContent} />
    case 'funnel':
      return <FunnelSlide content={slide.content as FunnelContent} />
    case 'objections':
      return <ObjectionsSlide content={slide.content as ObjectionsContent} />
    case 'kstati':
      return <KstatiSlide content={slide.content as KstatiContent} />
    case 'recurring':
      return <RecurringSlide content={slide.content as RecurringOverviewContent | RecurringRequirementsContent} />
    case 'helpdocs':
      return <HelpDocsSlide content={slide.content as HelpIntroContent | HelpPortalsContent} />
    case 'vat':
      return <VatSlide content={slide.content as VatContent} />
    case 'requirements':
      return <RequirementsSlide content={slide.content as ReqContent} />
    case 'unitchecks':
      return <UnitChecksSlide content={slide.content as UnitChecksContent} />
    case 'kanban':
      return <KanbanSlide content={slide.content as KanbanIntroContent | KanbanBoardContent | KanbanRulesContent | KanbanCommunicationContent} />
    default:
      return <div>Неизвестный тип слайда</div>
  }
}
