import { useState } from 'react'
import { Form, Input, Button, Checkbox, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import type { LoginForm } from '@/types'

const { Title } = Typography

export default function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken, setUser } = useAuthStore()

  const from = (location.state as { from?: string })?.from || '/projects'

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true)
    try {
      const res = await login(values)
      setToken(res.token)
      setUser(res.user)
      message.success('登录成功')
      navigate(from, { replace: true })
    } catch (e) {
      // 错误已由 http 拦截器处理
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div className="text-center" style={{ marginBottom: 24 }}>
        <Title level={3}>AI Test Pilot</Title>
        <Typography.Text type="secondary">智能测试管理平台</Typography.Text>
      </div>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
        </Form.Item>

        <Form.Item>
          <div className="flex" style={{ justifyContent: 'space-between' }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a href="#" onClick={(e) => e.preventDefault()}>忘记密码？</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} size="large" block>
            登录
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
