import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, List, Button, Tag, Space, Radio, message, Input, Modal } from 'antd'
import { testPointApi } from '../../api'
import { TestPoint } from '../../types'

const TestPointReview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [points, setPoints] = useState<TestPoint[]>([])
  const [selected, setSelected] = useState<TestPoint | null>(null)
  const [status, setStatus] = useState('confirmed')
  const [reason, setReason] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => { if (id) loadPoints() }, [id])

  const loadPoints = async () => {
    try { const res = await testPointApi.list(id!) as any; if (res.code === 0) setPoints(res.data || []) } catch (err) {}
  }

  const handleReview = async () => {
    if (!selected) return
    try {
      const res = await testPointApi.review(selected.id, { status, modifiedContent: status === 'modified' ? reason : undefined, rejectReason: status === 'rejected' ? reason : undefined }) as any
      if (res.code === 0) { message.success('审核完成'); setModalOpen(false); loadPoints() }
    } catch (err) { message.error('审核失败') }
  }

  const getPriorityColor = (p: string) => p === 'P0' ? 'red' : p === 'P1' ? 'orange' : 'green'

  return (
    <Card title="测试点审核">
      <List dataSource={points.filter(p => p.status === 'pending')} renderItem={(item: TestPoint) => (
        <List.Item actions={[
          <Button type="primary" onClick={() => { setSelected(item); setModalOpen(true) }}>审核</Button>
        ]}>
          <List.Item.Meta
            title={<Space><Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag><span>{item.content}</span></Space>}
            description={`置信度: ${item.confidence} | 来源: ${item.requirementTitle}`}
          />
        </List.Item>
      )} />
      <Modal title="审核测试点" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleReview}>
        {selected && <div style={{ marginBottom: 16 }}><p><strong>内容：</strong>{selected.content}</p></div>}
        <Radio.Group value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginBottom: 16 }}>
          <Radio value="confirmed">通过</Radio>
          <Radio value="modified">修改</Radio>
          <Radio value="rejected">驳回</Radio>
        </Radio.Group>
        {(status === 'modified' || status === 'rejected') && (
          <Input.TextArea placeholder={status === 'rejected' ? '请输入驳回原因' : '请输入修改内容'} value={reason} onChange={(e) => setReason(e.target.value)} />
        )}
      </Modal>
    </Card>
  )
}

export default TestPointReview
