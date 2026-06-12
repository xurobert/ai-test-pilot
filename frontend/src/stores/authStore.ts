import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  hasRole: (role: UserRole) => boolean
  hasAnyRole: (roles: UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setToken: (token) => set({ token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setLoading: (loading) => set({ isLoading: loading }),
      hasRole: (role) => get().user?.role === role ?? false,
      hasAnyRole: (roles) =>
        get().user ? roles.includes(get().user!.role) : false,
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
