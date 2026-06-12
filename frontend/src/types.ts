export interface User {
  id: string
  username: string
  displayName: string
  email: string
  role: 'te' | 'tae' | 'tm' | 'pm' | 'dev' | 'admin'
  tenantId: string
  isActive: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  ownerId: string
  status: 'active' | 'archived'
  createdAt: string
}

export interface Requirement {
  id: string
  projectId: string
  title: string
  content: string
  contentType: 'markdown' | 'pdf' | 'word'
  version: number
  status: 'pending' | 'analyzed' | 'confirmed'
  parsedChunks: number
  createdAt: string
}

export interface TestPoint {
  id: string
  requirementId: string
  content: string
  priority: 'P0' | 'P1' | 'P2'
  confidenceScore: number
  sourceChunk: string
  aiReasoning: string
  status: 'draft' | 'confirmed' | 'modified' | 'rejected'
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
    costMs?: number
  }
}

export interface LoginForm {
  username: string
  password: string
}

export interface RegisterForm {
  username: string
  password: string
  email: string
  displayName: string
  role: string
}
