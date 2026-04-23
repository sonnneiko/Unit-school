import type { User } from '../types'

export function localToday(): string {
  return new Date().toLocaleDateString('sv')  // 'sv' locale = ISO YYYY-MM-DD in local tz
}

function localYesterday(): string {
  return new Date(Date.now() - 86400000).toLocaleDateString('sv')
}

export function updateStreak(user: User): Partial<User> {
  const today = localToday()
  if (user.lastStreakDate === today) return {}
  if (user.lastStreakDate === localYesterday()) {
    return { streak: user.streak + 1, lastStreakDate: today }
  }
  return { streak: 1, lastStreakDate: today }
}
