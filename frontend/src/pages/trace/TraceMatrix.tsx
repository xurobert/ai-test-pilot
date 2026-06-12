import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Table, Tag, Button, Progress, message, Space } from 'antd'

const TraceMatrix = () => {
  const { id } = useParams()
  const [data] = useState([
    { reqId: 'REQ-001', reqTitle: '用户登录', testPoints: 5, testcases: 12, status: 'completed' as const, coverage: 100 },
    { reqId: 'REQ-002', reqTitle: '权限管理', testPoints: 3, testcases: 8, status: 'in_progress' as const, coverage: 75 },
    { reqId: 'REQ-003', reqTitle: 'PRD上传', testPoints: 2, testcases: 4, status: 'pending' as const, coverage: 0 },
  ])

  const total = data.length
  const completed = data.filter(d => d.status === 'completed').length
  const avgCoverage = Math.round(data.reduce((a, b) => a + b.coverage, 0) / total)

  const columns = [
    { title: '需求ID', dataIndex: 'reqId', key: 'reqId' },
    { title: '需求标题', dataIndex: 'reqTitle', key: 'reqTitle' },
    { title: '测试点', dataIndex: 'testPoints', key: 'testPoints' },
    { title: '用例', dataIndex: 'testcases', key: 'testcases' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'completed' ? 'green' : s === 'in_progress' ? 'orange' : 'blue'}>{s === 'completed' ? '完成' : s === 'in_progress' ? '进行中' : '待处理'}</Tag> },
    { title: '覆盖率', dataIndex: 'coverage', key: 'coverage', render: (c: number) => <Progress percent={c} size="small" /> },
  ]

  return (
    <Card title="需求-测试追踪矩阵" extra={
      <Space>
        <span>总需求: {total} | 完成: {completed} | 平均覆盖率: {avgCoverage}%</span>
        <Button onClick={() => message.info('导出功能开发中')}>导出CSV</Button>
      </Space>
    }>
      <Table dataSource={data} columns={columns} rowKey="reqId" />
    </Card>
  )
}

export default TraceMatrix
