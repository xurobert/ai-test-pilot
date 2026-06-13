import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  register: (data: { username: string; password: string; email: string; displayName: string; role: string }) =>
    api.post('/auth/register', data),
  refresh: (data: { refreshToken: string }) => api.post('/auth/refresh', data),
  logout: () => api.post('/auth/logout', {}),
  me: () => api.get('/auth/me'),
}

export const projectApi = {
  list: () => api.get('/projects'),
  create: (data: { name: string; description: string }) => api.post('/projects', data),
  get: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, data: Partial<{ name: string; description: string }>) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

export const requirementApi = {
  upload: (projectId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('project_id', projectId)
    return api.post('/requirements/upload', formData, {
      // Don't manually set Content-Type - axios will set it with proper boundary
      headers: { 'Content-Type': undefined },
    })
  },
  analyze: (id: string, data: { analysisDepth: string; focusAreas: string[] }) =>
    api.post(`/requirements/${id}/analyze`, data),
  getTestPoints: (id: string) => api.get(`/requirements/${id}/test-points`),
}

export const testPointApi = {
  list: (projectId: string) => api.get(`/projects/${projectId}/test-points`),
  review: (id: string, data: { status: string; modifiedContent?: string; rejectReason?: string }) =>
    api.patch(`/test-points/${id}/status`, data),
  regenerate: (id: string) => api.post(`/requirements/${id}/regenerate`, {}),
}
