 export type UserRole = 'admin' | 'premium_member' | 'client_premium'
export type ChartType = 'line' | 'area' | 'bar' | 'bar_horizontal' | 'donut'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at?: string
}

export interface DashboardFeed {
  id: number
  title: string
  category: 'news' | 'industry_data' | 'reca_letter'
  content: string
  chart_data?: ChartDataPoint[] | null
  chart_type?: ChartType | null
  drive_link?: string | null
  created_at?: string
}

export interface ChartDataPoint {
  label: string
  value: number
  secondary?: number
  category?: string
  unit?: string
  year?: number
  [key: string]: string | number | undefined
}

export interface GeneralResearch {
  id: number
  title: string
  description: string
  cover_image?: string | null
  drive_link_pdf?: string | null
  drive_link_ppt?: string | null
  created_at?: string
}

export interface PrivateReport {
  id: string
  client_id: string
  title: string
  description: string
  drive_link_pdf?: string | null
  drive_link_ppt?: string | null
  drive_link_csv?: string | null
  drive_link_md?: string | null
  youtube_link?: string | null
  artikel_link?: string | null
  created_at?: string
}

export interface ReportFileCard {
  type: 'pdf' | 'ppt' | 'csv' | 'md' | 'youtube' | 'artikel'
  label: string
  url: string
  reportTitle: string
  reportDescription: string
  reportId: string
}

export interface CourseModule {
  id: number
  title: string
  type: 'video' | 'book'
  description: string
  source_link: string
  cover_image?: string | null
  created_at?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}
