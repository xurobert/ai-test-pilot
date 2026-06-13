import { Layout, Menu } from 'antd'
import {
  ProjectOutlined,
  FileTextOutlined,
  UserAddOutlined,
  BarsOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useConfigStore } from '@/stores/configStore'
import { useAuthStore } from '@/stores/authStore'
import { UserRole } from '@/types'

const { Sider } = Layout

const iconMap: Record<string, React.ReactNode> = {
  ProjectOutlined: <ProjectOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  UserAddOutlined: <UserAddOutlined />,
  BarsOutlined: <BarsOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  LinkOutlined: <LinkOutlined />,
  CloudUploadOutlined: <CloudUploadOutlined />,
}

const menuItems = [
  {
    key: '/projects',
    icon: <ProjectOutlined />,
    label: '项目管理',
  },
  {
    key: 'requirements',
    icon: <FileTextOutlined />,
    label: '需求分析',
    children: [
      { key: '/requirements/upload', icon: <CloudUploadOutlined />, label: 'PRD上传' },
      { key: '/test-points', icon: <BarsOutlined />, label: '测试点列表' },
      { key: '/test-points/review', icon: <CheckCircleOutlined />, label: '测试点审核' },
      { key: '/trace-matrix', icon: <LinkOutlined />, label: '追踪矩阵' },
    ],
  },
  {
    key: '/register',
    icon: <UserAddOutlined />,
    label: '用户注册',
  },
]

export default function AppSider() {
  const { sidebarCollapsed } = useConfigStore()
  const { user, hasRole } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const filteredItems = menuItems
    .filter((item) => {
      if (item.key === '/register') return hasRole(UserRole.ADMIN)
      return true
    })
    .map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children,
        }
      }
      return item
    })

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={sidebarCollapsed}
      style={{
        position: 'fixed',
        left: 0,
        top: 64,
        bottom: 0,
        zIndex: 50,
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={['requirements']}
        items={filteredItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  )
}
