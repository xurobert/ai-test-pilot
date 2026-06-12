import { Layout, Menu, Avatar, Dropdown, Button } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
  HomeOutlined,
  ProjectOutlined,
  FileTextOutlined,
  BugOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'

const { Header, Sider, Content } = Layout

const MainLayout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const menuItems = [
    { key: '/projects', icon: <ProjectOutlined />, label: '项目管理' },
    { key: '/trace', icon: <FileTextOutlined />, label: '追踪矩阵' },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心', onClick: () => navigate('/profile') },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: logout },
  ]

  const selectedKeys = [location.pathname]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>AI测试平台</div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar icon={<UserOutlined />} />
            <span>{user?.displayName || user?.username || '用户'}</span>
          </div>
        </Dropdown>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content style={{ padding: 24, background: '#f5f5f5', overflow: 'auto' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
