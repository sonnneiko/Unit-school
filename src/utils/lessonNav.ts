import { LEVELS } from '../data/courses'
import { mockLessons } from '../data/lessons'

interface LessonNavInfo {
  prevLessonId: string | null
  nextLessonId: string | null
  topicIndex: number   // 1-based
  topicTotal: number
  sectionTitle: string
}

export function getLessonNavInfo(lessonId: string): LessonNavInfo | null {
  for (const level of LEVELS) {
    for (const section of level.sections) {
      const idx = section.topics.findIndex(t => t.lessonId === lessonId)
      if (idx === -1) continue

      const total = section.topics.length
      const prevTopic = idx > 0 ? section.topics[idx - 1] : null
      const nextTopic = section.topics[idx + 1] ?? null

      const prevLesson = prevTopic ? mockLessons.find(l => l.id === prevTopic.lessonId && l.published) : null
      const nextLesson = nextTopic ? mockLessons.find(l => l.id === nextTopic.lessonId && l.published) : null

      return {
        prevLessonId: prevLesson?.id ?? null,
        nextLessonId: nextLesson?.id ?? null,
        topicIndex: idx + 1,
        topicTotal: total,
        sectionTitle: section.title,
      }
    }
  }
  return null
}
