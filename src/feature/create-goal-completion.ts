import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'
import dayjs from 'dayjs'

type CreteGoalCompletionRequest = {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreteGoalCompletionRequest) {
  const lastDayOfWeek = dayjs().endOf('week').toDate()
  const firstDayofWeek = dayjs().startOf('week').toDate()
  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayofWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const result = await db
    .with(goalCompletionCounts)
    .select({
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId))
    .limit(1)

  const { completionCount, desiredWeeklyFrequency } = result[0]
  console.log(completionCount, desiredWeeklyFrequency)
  if (completionCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week!')
  }

  const insrertResult = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning()

  const goalCompletion = insrertResult[0]
  return {
    goalCompletion,
  }
}
