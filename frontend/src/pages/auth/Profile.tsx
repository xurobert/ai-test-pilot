import { useState } from 'react'
import { Card, Form, Input, Button, Descriptions, message, Avatar, Space, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/stores/authStore'
import { changePassword } from '@/api/auth'

const { Title } = Typography

export default function Profile() {
  const { user } = useAuthStore()
  const [pwdLoading, setPwdLoading] = useState(false)
  const [form] = Form.useForm()

  const handleChangePassword = async (values: { oldPassword: string; newPassword: string }) => {
    setPwdLoading(true)
    try {
      await changePassword(values.oldPassword, values.newPassword)
      message.success('密码修改成功')
      form.resetFields()
    } catch (e) {
      // 错误由拦截器处理
    } finally {
      setPwdLoading(false)
    }
  }

  return (
    <div className="flex gap-16" style={{ flexWrap: 'wrap' }}>
      <Card title="个人信息" style={{ flex: 1, minWidth: 320 }}>
        <Space direction="vertical" size="large" className="w-full">
          <div className="text-center">
            <Avatar size={80} icon={<UserOutlined />} />
            <Title level={4} style={{ marginTop: 12 }}>{user?.username}</Title>
          </div>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
            <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
            <Descriptions.Item label="角色">{user?.role}</Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>

      <Card title="修改密码" style={{ flex: 1, minWidth: 320 }}>
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="oldPassword"
            label="当前密码"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }, { min: 6, message: '至少6个字符' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={pwdLoading}>
              修改密码
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
