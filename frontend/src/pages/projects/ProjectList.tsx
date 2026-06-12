import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Card, Space, Tag, message, Modal, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { projectApi } from '../../api'
import { Project } from '../../types'

const ProjectList = () => {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    setLoading(true)
    try {
      const res = await projectApi.list() as any
      if (res.code === 0) setProjects(res.data?.items || [])
    } catch (err) { message.error('加载项目失败') }
    finally { setLoading(false) }
  }

  const handleCreate = async (values: any) => {
    try {
      const res = await projectApi.create(values) as any
      if (res.code === 0) { message.success('创建成功'); setModalVisible(false); form.resetFields(); loadProjects() }
      else message.error(res.message)
    } catch (err) { message.error('创建失败') }
  }

  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'green' : 'default'}>{s === 'active' ? '活跃' : '归档'}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '操作', key: 'action', render: (_: any, record: Project) => (
      <Space>
        <Button type="link" onClick={() => navigate(`/projects/${record.id}`)}>查看</Button>
        <Button type="link" onClick={() => navigate(`/projects/${record.id}/upload`)}>上传PRD</Button>
      </Space>
    )}
  ]

  return (
    <Card title="项目管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>新建项目</Button>}>
      <Table dataSource={projects} columns={columns} rowKey="id" loading={loading} />
      <Modal title="新建项目" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <Form form={form} onFinish={handleCreate}>
          <Form.Item name="name" rules={[{ required: true }]}><Input placeholder="项目名称" /></Form.Item>
          <Form.Item name="description"><Input.TextArea placeholder="项目描述" /></Form.Item>
          <Form.Item><Button type="primary" htmlType="submit" block>创建</Button></Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default ProjectList
