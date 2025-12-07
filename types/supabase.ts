export interface Profile {
  id: string
  username?: string | null
  email?: string | null
  fullname?: string | null
  avatar_url?: string | null
  role?: string | null
  last_active?: string | null
  is_blocked?: boolean | null
  [key: string]: unknown
}

export interface Quiz {
  id: string
  title: string
  category: string | null
  questions: unknown[] | null
  is_hidden: boolean | null
  is_public: boolean | null
  created_at: string | null
  language: string | null
  creator?: {
    email: string | null
    fullname: string | null
    avatar_url: string | null
  } | null
}

export interface Report {
  id: string
  report_type: string | null
  reported_content_type: string | null
  reported_content_id: string | null
  reporter_id: string | null
  reported_user_id: string | null
  status: string | null
  priority?: string | null
  created_at: string | null
  updated_at?: string | null
  title: string | null
  description: string | null
  admin_notes?: string | null
  evidence_url?: string | null
  resolved_at?: string | null
  resolved_by?: string | null
  reporter?: {
    id: string
    username: string | null
    email: string | null
    fullname: string | null
    avatar_url?: string | null
  } | null
  reported_user?: {
    id: string
    username: string | null
    fullname?: string | null
  } | null
  quiz?: {
    id: string
    title: string | null
  } | null
}

