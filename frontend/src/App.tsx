import { useAuthStore } from '@/stores/authStore'
import { useConfigStore } from '@/stores/configStore'
import { ConfigProvider, theme } from 'antd'
import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import GlobalErrorBoundary from '@/components/GlobalErrorBoundary'
import zhCN from 'antd/locale/zh_CN'

export default function App() {
  const { themeColor } = useConfigStore()
  const { isLoading } = useAuthStore()

  return (
    <GlobalErrorBoundary>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: { colorPrimary: themeColor },
          algorithm: theme.defaultAlgorithm,
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </GlobalErrorBoundary>
  )
}
