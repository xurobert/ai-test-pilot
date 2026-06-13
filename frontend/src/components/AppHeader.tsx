import { Layout, Button, Dropdown, Space, Avatar, Typography } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { useConfigStore } from '@/stores/configStore'
import { Link, useNavigate } from 'react-router-dom'

const { Header } = Layout
const { Text } = Typography

export default function AppHeader() {
  const { user, logout } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useConfigStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    {
      key: 'profile',
      label: <Link to="/profile">个人中心</Link>,
      icon: <UserOutlined />,
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          style={{ marginRight: 16 }}
        />
        <Text strong style={{ fontSize: 18 }}>AI Test Pilot</Text>
      </div>
      <Space>
        <Text type="secondary">{user?.username}</Text>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} />
        </Dropdown>
      </Space>
    </Header>
  )
}
