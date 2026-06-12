import { post, get } from './http'
import type { User, LoginForm, RegisterForm } from '@/types'

export async function login(data: LoginForm): Promise<{ token: string; user: User }> {
  return post('/auth/login', data)
}

export async function register(data: RegisterForm): Promise<{ token: string; user: User }> {
  return post('/auth/register', data)
}

export async function getCurrentUser(): Promise<User> {
  return get('/auth/me')
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  return post('/auth/change-password', { oldPassword, newPassword })
}
