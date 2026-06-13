import { useState } from 'react'
import { Form, Input, Select, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { register } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { UserRole } from '@/types'
import type { RegisterForm } from '@/types'

const { Title } = Typography
const { Option } = Select

export default function Register() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()

  const handleSubmit = async (values: RegisterForm) => {
    setLoading(true)
    try {
      const res = await register(values)
      setToken(res.token)
      setUser(res.user)
      message.success('注册成功')
      navigate('/projects')
    } catch (e) {
      // 错误由拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ width: 480, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div className="text-center" style={{ marginBottom: 24 }}>
        <Title level={3}>注册新用户</Title>
        <Typography.Text type="secondary">ADMIN 权限可见</Typography.Text>
      </div>
      <Form
        name="register"
        onFinish={handleSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }, { min: 3, message: '至少3个字符' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}
        >
          <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少6个字符' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
        </Form.Item>

        <Form.Item
          label="角色"
          name="role"
          rules={[{ required: true, message: '请选择角色' }]}
          initialValue={UserRole.TESTER}
        >
          <Select size="large">
            <Option value={UserRole.ADMIN}>管理员</Option>
            <Option value={UserRole.TESTER}>测试工程师</Option>
            <Option value={UserRole.VIEWER}>只读用户</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            注册
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
