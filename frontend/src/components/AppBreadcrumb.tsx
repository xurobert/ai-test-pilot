import React from 'react'
import { Breadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'

const routeNameMap: Record<string, string> = {
  '/projects': '项目管理',
  '/projects/new': '新建项目',
  '/requirements': '需求分析',
  '/requirements/upload': 'PRD上传',
  '/test-points': '测试点列表',
  '/test-points/review': '测试点审核',
  '/trace-matrix': '追踪矩阵',
  '/profile': '个人中心',
  '/register': '用户注册',
}

export default function AppBreadcrumb() {
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)

  const items = [
    {
      title: (
        <Link to="/projects">
          <HomeOutlined />
        </Link>
      ),
    },
  ]

  let currentPath = ''
  pathSnippets.forEach((snippet) => {
    currentPath += `/${snippet}`
    const name = routeNameMap[currentPath] || snippet
    items.push({
      title: currentPath === location.pathname ? <span>{name}</span> : <Link to={currentPath}>{name}</Link>,
    })
  })

  return <Breadcrumb items={items} style={{ marginBottom: 8 }} />
}
