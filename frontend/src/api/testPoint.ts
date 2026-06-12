import { get, post, put, patch } from './http'
import type { TestPoint, PrdDocument, TraceLink, PaginatedResponse } from '@/types'

export async function getTestPoints(params?: { page?: number; pageSize?: number; projectId?: string; status?: string }): Promise<PaginatedResponse<TestPoint>> {
  return get('/test-points', { params })
}

export async function getTestPoint(id: string): Promise<TestPoint> {
  return get(`/test-points/${id}`)
}

export async function confirmTestPoint(id: string): Promise<TestPoint> {
  return put(`/test-points/${id}/confirm`)
}

export async function rejectTestPoint(id: string, reason: string): Promise<TestPoint> {
  return put(`/test-points/${id}/reject`, { reason })
}

export async function modifyTestPoint(id: string, content: string): Promise<TestPoint> {
  return patch(`/test-points/${id}`, { modifiedContent: content })
}

export async function batchConfirm(ids: string[]): Promise<void> {
  return post('/test-points/batch-confirm', { ids })
}

export async function batchReject(ids: string[], reason: string): Promise<void> {
  return post('/test-points/batch-reject', { ids, reason })
}

export async function uploadPrd(projectId: string, file: File, onProgress?: (percent: number) => void): Promise<PrdDocument> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('projectId', projectId)
  return post('/prd/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
}

export async function getPrdList(projectId: string): Promise<PrdDocument[]> {
  return get('/prd', { params: { projectId } })
}

export async function getTraceMatrix(projectId: string): Promise<TraceLink[]> {
  return get(`/trace-matrix/${projectId}`)
}

export async function generateTestPoints(prdId: string): Promise<{ jobId: string }> {
  return post('/test-points/generate', { prdId })
}

export async function getGenerationStatus(jobId: string): Promise<{ status: string; progress: number }> {
  return get(`/test-points/generate-status/${jobId}`)
}
