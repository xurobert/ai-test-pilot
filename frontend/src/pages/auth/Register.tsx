import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Select, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { authApi } from '../../api'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const res = await authApi.register(values) as any
      if (res.code === 0) {
        message.success('注册成功，请登录')
        navigate('/login')
      } else {
        message.error(res.message || '注册失败')
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card title="AI测试平台 - 注册" style={{ width: 400 }}>
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="密码（至少6位）" />
        </Form.Item>
        <Form.Item name="email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<MailOutlined />} placeholder="邮箱" />
        </Form.Item>
        <Form.Item name="displayName" rules={[{ required: true }]}>
          <Input placeholder="显示名称" />
        </Form.Item>
        <Form.Item name="role" initialValue="te">
          <Select placeholder="选择角色">
            <Select.Option value="te">测试工程师</Select.Option>
            <Select.Option value="tae">自动化工程师</Select.Option>
            <Select.Option value="tm">测试经理</Select.Option>
            <Select.Option value="pm">产品经理</Select.Option>
            <Select.Option value="dev">开发工程师</Select.Option>
            <Select.Option value="admin">管理员</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>注册</Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          <a onClick={() => navigate('/login')}>已有账号？去登录</a>
        </div>
      </Form>
    </Card>
  )
}

export default Register
