import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { showError } from '@/utils/helpers'

const http: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const { data } = response
    if (data.code !== 0 && data.code !== 200) {
      showError(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        showError('登录已过期，请重新登录')
      } else if (status === 403) {
        showError('没有权限执行此操作')
      } else if (status >= 500) {
        showError('服务器错误，请稍后重试')
      } else {
        showError(error.message || '请求失败')
      }
    } else if (error.request) {
      showError('网络错误，请检查网络连接')
    } else {
      showError(error.message || '请求失败')
    }
    return Promise.reject(error)
  }
)

export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.get(url, config)
  return res.data.data
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.post(url, data, config)
  return res.data.data
}

export async function put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.put(url, data, config)
  return res.data.data
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.delete(url, config)
  return res.data.data
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await http.patch(url, data, config)
  return res.data.data
}

export default http
