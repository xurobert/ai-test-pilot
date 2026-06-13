import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTE_PERMISSIONS } from '@/utils/constants'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location.pathname } })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  if (isLoading) return null
  if (!isAuthenticated) return null

  return <>{children}</>
}

export function RoleGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user && !allowedRoles.includes(user.role as string)) {
      navigate('/403', { replace: true })
    }
  }, [isAuthenticated, user, allowedRoles, navigate])

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role as string)) {
    return null
  }

  return <>{children}</>
}

export function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) return
    const pathname = location.pathname
    const requiredRoles = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
      pathname.startsWith(route)
    )?.[1]

    if (requiredRoles && user && !requiredRoles.includes(user.role as string)) {
      navigate('/403', { replace: true })
    }
  }, [location, user, isAuthenticated, navigate])

  return <>{children}</>
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) return null
  return <>{children}</>
}
