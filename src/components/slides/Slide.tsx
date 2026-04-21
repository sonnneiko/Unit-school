import type { Slide as SlideType, Lesson, WelcomeContent, InfoContent, DiagramContent, CheatsheetContent, TabsContent, FinishContent } from '../../types'
import { WelcomeSlide } from './WelcomeSlide'
import { InfoSlide } from './InfoSlide'
import { DiagramSlide } from './DiagramSlide'
import { CheatsheetSlide } from './CheatsheetSlide'
import { TabsSlide } from './TabsSlide'
import { FinishSlide } from './FinishSlide'

interface Props {
  slide: SlideType
  onNext: () => void
  nextLesson?: Lesson | null
}

export function Slide({ slide, onNext, nextLesson }: Props) {
  switch (slide.type) {
    case 'welcome':
      return <WelcomeSlide content={slide.content as WelcomeContent} onNext={onNext} />
    case 'info':
      return <InfoSlide content={slide.content as InfoContent} />
    case 'diagram':
      return <DiagramSlide content={slide.content as DiagramContent} />
    case 'cheatsheet':
      return <CheatsheetSlide content={slide.content as CheatsheetContent} />
    case 'tabs':
      return <TabsSlide content={slide.content as TabsContent} />
    case 'finish':
      return <FinishSlide content={slide.content as FinishContent} nextLesson={nextLesson} />
    default:
      return <div>Неизвестный тип слайда</div>
  }
}
