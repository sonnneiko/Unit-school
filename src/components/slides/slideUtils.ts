export function calcProgress(currentIndex: number, totalSlides: number): number {
  if (totalSlides <= 1) return 0
  return Math.round((currentIndex / (totalSlides - 1)) * 100)
}
