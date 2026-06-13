import { GuestGuard } from '@/router/guards'
import { Outlet } from 'react-router-dom'

export default function AuthLayout({ children }: { children?: React.ReactNode }) {
  return (
    <GuestGuard>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        {children ?? <Outlet />}
      </div>
    </GuestGuard>
  )
}
