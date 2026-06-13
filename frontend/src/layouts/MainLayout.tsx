import { AuthGuard, RoutePermissionGuard } from '@/router/guards'
import { Outlet } from 'react-router-dom'
import AppSider from '@/components/AppSider'
import AppHeader from '@/components/AppHeader'
import AppBreadcrumb from '@/components/AppBreadcrumb'
import { Layout } from 'antd'
import { useConfigStore } from '@/stores/configStore'

const { Content } = Layout

export default function MainLayout({ children }: { children?: React.ReactNode }) {
  const { sidebarCollapsed } = useConfigStore()

  return (
    <AuthGuard>
      <RoutePermissionGuard>
        <Layout style={{ minHeight: '100vh' }}>
          <AppHeader />
          <Layout>
            <AppSider />
            <Layout
              style={{
                marginLeft: sidebarCollapsed ? 80 : 200,
                transition: 'margin-left 0.2s',
              }}
            >
              <Content style={{ margin: '16px 24px', minHeight: 280 }}>
                <AppBreadcrumb />
                <div style={{ marginTop: 16 }}>
                  {children ?? <Outlet />}
                </div>
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </RoutePermissionGuard>
    </AuthGuard>
  )
}
