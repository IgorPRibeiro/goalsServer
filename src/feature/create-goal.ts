import { db } from '../db'
import { goals } from '../db/schema'

type CreteGoalRequest = {
  title: string
  desiredWeeklyFrequency: number
}

export async function createGoal({
  desiredWeeklyFrequency,
  title,
}: CreteGoalRequest) {
  const result = await db
    .insert(goals)
    .values({
      title,
      desiredWeeklyFrequency,
    })
    .returning()

  const goal = result[0]
  return {
    goal,
  }
}
