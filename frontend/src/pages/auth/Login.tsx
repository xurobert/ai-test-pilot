import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { authApi } from '../../api'
import { useAuthStore } from '../../stores/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const res = await authApi.login(values) as any
      if (res.code === 0) {
        setAuth(res.data.access_token, res.data.user)
        message.success('登录成功')
        navigate('/projects')
      } else {
        message.error(res.message || '登录失败')
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="AI测试平台 - 登录" style={{ width: 400 }}>
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>登录</Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <a onClick={() => navigate('/register')}>注册新账号</a>
        </div>
      </Form>
    </Card>
  )
}

export default Login
