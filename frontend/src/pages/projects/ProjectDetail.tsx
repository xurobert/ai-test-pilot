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
      <Tabs defaultActiveKey="requirements" items={[
        { key: 'requirements', label: '需求', children: <div>需求列表占位</div> },
        { key: 'testpoints', label: '测试点', children: <div>测试点列表占位</div> },
        { key: 'testcases', label: '用例', children: <div>用例列表占位</div> },
      ]} />
    </Card>
  )
}

export default ProjectDetail
