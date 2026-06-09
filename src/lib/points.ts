import prisma from './prisma'

export const ACTION_TYPES = {
  // One-time actions
  ONBOARDING_INTRO: { points: 50, dailyCap: null, oneTime: true },
  SOCIAL_LINK_REDDIT: { points: 75, dailyCap: null, oneTime: true },
  SOCIAL_LINK_X: { points: 75, dailyCap: null, oneTime: true },
  
  // Recurring Discord actions
  MESSAGE_SENT: { points: 2, dailyCap: 5, oneTime: false },
  THREAD_STARTED: { points: 5, dailyCap: 3, oneTime: false },
  HELPFUL_ANSWER: { points: 15, dailyCap: null, oneTime: false },
  REACTION_RECEIVED: { points: 1, dailyCap: 10, oneTime: false },
  SHOWCASE_POST: { points: 20, dailyCap: 1, oneTime: false },
  TIP_SHARED: { points: 8, dailyCap: 2, oneTime: false },
  
  // External mention actions
  ZENCODER_MENTION_X: { points: 30, dailyCap: 1, oneTime: false },
  ZENCODER_MENTION_REDDIT: { points: 30, dailyCap: 1, oneTime: false },
}

export const TIER_THRESHOLDS = [
  { tier: 'LURKER', min: 0, max: 99, role: 'Lurker' },
  { tier: 'MEMBER', min: 100, max: 499, role: 'Member' },
  { tier: 'BUILDER', min: 500, max: 1499, role: 'Builder' },
  { tier: 'CONTRIBUTOR', min: 1500, max: 3999, role: 'Contributor' },
  { tier: 'CHAMPION', min: 4000, max: Infinity, role: 'Champion' },
]

export function getWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const dayStart = yearStart.getUTCDay() || 7
  yearStart.setUTCDate(yearStart.getUTCDate() + 4 - dayStart)
  const diff = d.valueOf() - yearStart.valueOf()
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

export async function checkDailyCap(
  memberId: string,
  actionType: string,
  date: Date = new Date()
): Promise<boolean> {
  const action = ACTION_TYPES[actionType as keyof typeof ACTION_TYPES]
  if (!action || action.dailyCap === null) return true

  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const count = await prisma.pointEvent.count({
    where: {
      memberId,
      actionType,
      createdAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    },
  })

  return count < action.dailyCap
}

export async function checkOneTimeAction(
  memberId: string,
  actionType: string
): Promise<boolean> {
  const count = await prisma.pointEvent.count({
    where: {
      memberId,
      actionType,
    },
  })
  return count === 0
}

export function getTierFromPoints(points: number): string {
  const tier = TIER_THRESHOLDS.find(t => points >= t.min && points <= t.max)
  return tier?.tier || 'LURKER'
}

export async function checkStreakMultiplier(
  memberId: string,
  weekKey: string
): Promise<number> {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
  })

  if (!member?.streakActive) {
    return 1
  }

  return 1.2
}

export async function awardPoints(
  memberId: string,
  actionType: string,
  metadata: Record<string, any> = {}
): Promise<{ success: boolean; points: number; message: string }> {
  const action = ACTION_TYPES[actionType as keyof typeof ACTION_TYPES]
  if (!action) {
    return { success: false, points: 0, message: 'Invalid action type' }
  }

  // Check one-time actions
  if (action.oneTime) {
    const exists = await checkOneTimeAction(memberId, actionType)
    if (!exists) {
      return { success: false, points: 0, message: 'This action has already been completed' }
    }
  }

  // Check daily caps
  if (action.dailyCap !== null) {
    const withinCap = await checkDailyCap(memberId, actionType)
    if (!withinCap) {
      return { success: false, points: 0, message: `Daily cap of ${action.dailyCap} reached for this action` }
    }
  }

  const weekKey = getWeekKey()
  const multiplier = await checkStreakMultiplier(memberId, weekKey)
  const pointsAwarded = Math.floor(action.points * multiplier)

  const pointEvent = await prisma.pointEvent.create({
    data: {
      memberId,
      actionType,
      pointsAwarded,
      multipliers: JSON.stringify([multiplier > 1 ? multiplier : null].filter(Boolean)),
      metadata: JSON.stringify(metadata),
      weekKey,
    },
  })

  // Update member points
  const member = await prisma.member.update({
    where: { id: memberId },
    data: {
      totalPoints: { increment: pointsAwarded },
      weeklyPoints: { increment: pointsAwarded },
      lastActive: new Date(),
    },
  })

  // Check for tier upgrade
  const newTier = getTierFromPoints(member.totalPoints)
  if (member.tier !== newTier) {
    await prisma.member.update({
      where: { id: memberId },
      data: { tier: newTier },
    })
  }

  return {
    success: true,
    points: pointsAwarded,
    message: `Awarded ${pointsAwarded} points for ${actionType}`,
  }
}

export async function getLeaderboard(
  period: 'all-time' | 'weekly' = 'all-time',
  limit: number = 100
) {
  const members = await prisma.member.findMany({
    orderBy: {
      [period === 'all-time' ? 'totalPoints' : 'weeklyPoints']: 'desc',
    },
    take: limit,
    select: {
      id: true,
      username: true,
      totalPoints: true,
      weeklyPoints: true,
      tier: true,
      streakDays: true,
      streakActive: true,
    },
  })

  return members.map((m, index) => ({
    rank: index + 1,
    ...m,
  }))
}

export async function resetWeeklyPoints() {
  const members = await prisma.member.findMany({
    select: { id: true, weeklyPoints: true },
  })

  // Archive top 10
  const topMembers = members.sort((a, b) => b.weeklyPoints - a.weeklyPoints).slice(0, 10)

  // Reset weekly points
  await prisma.member.updateMany({
    data: { weeklyPoints: 0 },
  })

  return topMembers
}
