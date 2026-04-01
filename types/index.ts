export type UserMode = 'student'

export interface Profile {
  id: string
  full_name: string | null
  university: string | null
  year_of_study: number | null
  country: string
  created_at: string
}

export interface LearningPath {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  specialty: string
  order_index: number
  created_at: string
}

export interface Module {
  id: string
  path_id: string
  title: string
  description: string
  content_md: string
  order_index: number
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  module_id: string
  path_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  completed_at: string | null
}

export interface ChatSession {
  id: string
  user_id: string
  module_id: string | null
  title: string
  created_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  sources: TavilySource[] | null
  created_at: string
}

export interface TavilySource {
  url: string
  title: string
  content: string
  score?: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  module_id: string
  questions: QuizQuestion[]
  answers: number[]
  score: number
  total: number
  passed: boolean
  created_at: string
}

export interface ActivityEvent {
  id: string
  user_id: string
  event_type: 'module_viewed' | 'quiz_completed' | 'path_started' | 'message_sent'
  entity_id: string | null
  entity_type: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface PathWithProgress extends LearningPath {
  modules: ModuleWithProgress[]
  completedCount: number
}

export interface ModuleWithProgress extends Module {
  progress: UserProgress | null
}
