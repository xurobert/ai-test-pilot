import { Outlet } from 'react-router-dom'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <div style={{ width: 400 }}>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
