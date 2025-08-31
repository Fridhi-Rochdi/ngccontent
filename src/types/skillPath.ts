import { z } from 'zod'

// Schema Zod pour la validation du sommaire d'entrée
export const SkillPathSommaireSchema = z.object({
  units: z.array(z.object({
    id: z.string(),
    name: z.string(),
    modules: z.array(z.object({
      id: z.string(),
      name: z.string(),
      objective: z.string(),
      lessons: z.array(z.object({
        id: z.string(),
        title: z.string(),
        concepts: z.array(z.object({
          title: z.string(),
          videos_scrimba: z.array(z.string())
        })),
        lab_ngc: z.string(),
        quiz: z.string(),
        project: z.string(),
        correction_bac: z.string().optional()
      }))
    }))
  }))
})

// Schema Zod pour le contenu généré d'une leçon
export const LessonContentSchema = z.object({
  script: z.array(z.object({
    type: z.enum(['introduction', 'concept', 'example', 'exercise', 'summary']),
    title: z.string(),
    narrative: z.string(),
    code_example: z.string().optional(),
    visual_aids: z.array(z.string()).optional()
  })),
  quiz: z.object({
    questions: z.array(z.object({
      id: z.string(),
      type: z.enum(['multiple_choice', 'true_false', 'code_completion']),
      question: z.string(),
      options: z.array(z.string()).optional(),
      correct_answer: z.string(),
      explanation: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard'])
    }))
  }),
  project: z.object({
    title: z.string(),
    brief: z.string(),
    requirements: z.array(z.string()),
    starter_code: z.string().optional(),
    solution_hints: z.array(z.string()),
    evaluation_criteria: z.array(z.string())
  }),
  lab_exercises: z.array(z.object({
    title: z.string(),
    description: z.string(),
    steps: z.array(z.string()),
    expected_output: z.string(),
    hints: z.array(z.string()).optional()
  })),
  correction_bac: z.object({
    video_script: z.string(),
    key_points: z.array(z.string()),
    common_mistakes: z.array(z.string()),
    challenge_exercise: z.object({
      description: z.string(),
      solution: z.string()
    }).optional()
  }).optional()
})

// Types TypeScript dérivés des schemas Zod
export type SkillPathSommaire = z.infer<typeof SkillPathSommaireSchema>
export type LessonContent = z.infer<typeof LessonContentSchema>

// Types pour les interfaces héritées de l'ancien parser
export interface Concept {
  title: string
  videos_scrimba: string[]
}

export interface Lesson {
  id: string
  title: string
  concepts: Concept[]
  lab_ngc: string
  quiz: string
  project: string
  correction_bac?: string
}

export interface Module {
  id: string
  name: string
  objective: string
  lessons: Lesson[]
}

export interface Unit {
  id: string
  name: string
  modules: Module[]
}

export interface SkillPath {
  units: Unit[]
}

// Types pour les interfaces de base de données
export interface SkillPathDB {
  id: string
  name: string
  sommaire: SkillPathSommaire
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
  createdAt: Date
  updatedAt: Date
  lessons: LessonDB[]
}

export interface LessonDB {
  id: string
  title: string
  order: number
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED'
  skillPathId: string
  content: LessonContentWithVersion[]
}

export interface LessonContentWithVersion {
  id: string
  version: 'basic' | 'creative' | 'advanced'
  content: LessonContent
  isSelected: boolean
  createdAt: Date
  lessonId: string
}

export interface ContentEmbedding {
  id: string
  chunk: string
  embedding: number[]
  version: string
  lessonId: string
  source: string
}
