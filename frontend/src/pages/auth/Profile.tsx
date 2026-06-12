import { Card, Descriptions } from 'antd'
import { useAuthStore } from '../../stores/authStore'

const Profile = () => {
  const { user } = useAuthStore()

  if (!user) return <div>未登录</div>

  return (
    <Card title="个人中心">
      <Descriptions bordered column={1}>
        <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
        <Descriptions.Item label="显示名称">{user.displayName}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
        <Descriptions.Item label="角色">{user.role}</Descriptions.Item>
        <Descriptions.Item label="租户ID">{user.tenantId}</Descriptions.Item>
      </Descriptions>
    </Card>
  )
}

export default Profile
