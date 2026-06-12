import { get, post, put, del } from './http'
import type { Project, PaginatedResponse } from '@/types'

export async function getProjects(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<PaginatedResponse<Project>> {
  return get('/projects', { params })
}

export async function getProject(id: string): Promise<Project> {
  return get(`/projects/${id}`)
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  return post('/projects', data)
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  return put(`/projects/${id}`, data)
}

export async function deleteProject(id: string): Promise<void> {
  return del(`/projects/${id}`)
}
