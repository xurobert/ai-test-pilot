import { useParams } from 'react-router-dom'
import { Card, Tabs } from 'antd'
import { useState, useEffect } from 'react'
import { projectApi } from '../../api'

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    if (id) loadProject()
  }, [id])

  const loadProject = async () => {
    try { const res = await projectApi.get(id!) as any; if (res.code === 0) setProject(res.data) } catch (err) {}
  }

  return (
    <Card title={project?.name || '项目详情'}>
      <p>{project?.description}</p>
      <Tabs defaultActiveKey="requirements">
        <Tabs.TabPane tab="需求" key="requirements">需求列表占位</Tabs.TabPane>
        <Tabs.TabPane tab="测试点" key="testpoints">测试点列表占位</Tabs.TabPane>
        <Tabs.TabPane tab="用例" key="testcases">用例列表占位</Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default ProjectDetail
