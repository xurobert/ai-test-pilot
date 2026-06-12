import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Table, Card, Tag, Button, Space, Badge, message } from 'antd'
import { testPointApi } from '../../api'
import { TestPoint } from '../../types'

const TestPointList = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [points, setPoints] = useState<TestPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (id) loadPoints() }, [id])

  const loadPoints = async () => {
    setLoading(true)
    try { const res = await testPointApi.list(id!) as any; if (res.code === 0) setPoints(res.data || []) }
    catch (err) { message.error('加载失败') } finally { setLoading(false) }
  }

  const getPriorityColor = (p: string) => p === 'P0' ? 'red' : p === 'P1' ? 'orange' : 'green'
  const getStatusColor = (s: string) => s === 'confirmed' ? 'green' : s === 'rejected' ? 'red' : 'blue'

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '测试点', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: string) => <Tag color={getPriorityColor(p)}>{p}</Tag> },
    { title: '置信度', dataIndex: 'confidenceScore', key: 'confidenceScore', render: (s: number) => <Badge count={s} style={{ backgroundColor: s > 0.8 ? '#52c41a' : s > 0.5 ? '#faad14' : '#f5222d' }} /> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={getStatusColor(s)}>{s}</Tag> },
    { title: '操作', key: 'action', render: (_: any, record: TestPoint) => (
      <Space>
        <Button type="link" onClick={() => navigate(`/projects/${id}/review`)}>审核</Button>
      </Space>
    )}
  ]

  return (
    <Card title="测试点列表" extra={<Button type="primary" onClick={() => navigate(`/projects/${id}/review`)}>批量审核</Button>}>
      <Table dataSource={points} columns={columns} rowKey="id" loading={loading} />
    </Card>
  )
}

export default TestPointList
