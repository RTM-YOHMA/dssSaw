// SAW (Simple Additive Weighting) Calculation Engine

interface Student {
  id: string
  name: string
  nisn: string
  class: string
  c1: number
  c2: number
  c3: number
  c4: number
}

interface CriteriaWeights {
  c1: number // 40%
  c2: number // 30%
  c3: number // 20%
  c4: number // 10%
}

interface NormalizedStudent extends Student {
  n1: number
  n2: number
  n3: number
  n4: number
  score: number
  rank: number
}

const DEFAULT_WEIGHTS: CriteriaWeights = {
  c1: 0.4,
  c2: 0.3,
  c3: 0.2,
  c4: 0.1,
}

// Normalize values to 0-1 scale (benefit criteria - higher is better)
function normalizeValue(value: number, maxValue: number): number {
  if (maxValue === 0) return 0
  return value / maxValue
}

// Calculate SAW scores for all students
export function calculateSAW(students: Student[], weights: CriteriaWeights = DEFAULT_WEIGHTS): NormalizedStudent[] {
  if (students.length === 0) return []

  // Find max values for each criterion
  const maxC1 = Math.max(...students.map((s) => s.c1), 1)
  const maxC2 = Math.max(...students.map((s) => s.c2), 1)
  const maxC3 = Math.max(...students.map((s) => s.c3), 1)
  const maxC4 = Math.max(...students.map((s) => s.c4), 1)

  // Normalize and calculate scores
  let normalizedStudents: NormalizedStudent[] = students.map((student) => {
    const n1 = normalizeValue(student.c1, maxC1)
    const n2 = normalizeValue(student.c2, maxC2)
    const n3 = normalizeValue(student.c3, maxC3)
    const n4 = normalizeValue(student.c4, maxC4)

    const score = n1 * weights.c1 + n2 * weights.c2 + n3 * weights.c3 + n4 * weights.c4

    return {
      ...student,
      n1,
      n2,
      n3,
      n4,
      score,
      rank: 0,
    }
  })

  // Sort by score descending and assign ranks
  normalizedStudents.sort((a, b) => b.score - a.score)
  normalizedStudents = normalizedStudents.map((student, index) => ({
    ...student,
    rank: index + 1,
  }))

  return normalizedStudents
}

// Get top N students
export function getTopStudents(students: NormalizedStudent[], topN = 10): NormalizedStudent[] {
  return students.slice(0, topN)
}

// Format score for display
export function formatScore(score: number): string {
  return (score * 100).toFixed(2)
}
