import type { QuizQuestion } from '@/types'

export function parseQuizResponse(raw: string): QuizQuestion[] {
  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  const parsed = JSON.parse(cleaned)
  const questions: unknown[] = Array.isArray(parsed) ? parsed : parsed.questions

  return questions.map((q: unknown, i: number) => {
    const question = q as Record<string, unknown>
    if (
      typeof question.question !== 'string' ||
      !Array.isArray(question.options) ||
      typeof question.correct !== 'number' ||
      typeof question.explanation !== 'string'
    ) {
      throw new Error(`Invalid question at index ${i}`)
    }
    return {
      id: (question.id as string) ?? `q${i + 1}`,
      question: question.question,
      options: question.options as string[],
      correct: question.correct,
      explanation: question.explanation,
    }
  })
}
