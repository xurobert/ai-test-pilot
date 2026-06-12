export enum UserRole {
  ADMIN = 'admin',
  TESTER = 'tester',
  VIEWER = 'viewer',
}

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  avatar?: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'archived' | 'draft'
  createdAt: string
  updatedAt: string
  ownerId: string
}

export interface PrdDocument {
  id: string
  projectId: string
  filename: string
  fileType: 'pdf' | 'word' | 'markdown'
  uploadStatus: 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  uploadedAt: string
}

export type TestPointPriority = 'high' | 'medium' | 'low'
export type TestPointStatus = 'pending' | 'confirmed' | 'rejected' | 'modified'

export interface TestPoint {
  id: string
  projectId: string
  prdId: string
  requirementId: string
  requirementTitle: string
  content: string
  priority: TestPointPriority
  confidence: number
  status: TestPointStatus
  suggestedCases: number
  modifiedContent?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
}

export interface TraceLink {
  requirementId: string
  requirementTitle: string
  testPointIds: string[]
  testCaseIds: string[]
  coverage: number
}

export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

export interface RegisterForm {
  username: string
  password: string
  email: string
  role: UserRole
}
