export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/projects': ['ADMIN', 'TE', 'TAE'],
  '/projects/new': ['ADMIN', 'TE'],
  '/requirements/upload': ['ADMIN', 'TE'],
  '/test-points': ['ADMIN', 'TE', 'TAE'],
  '/test-points/review': ['ADMIN', 'TE'],
  '/trace-matrix': ['ADMIN', 'TE', 'TAE'],
  '/register': ['ADMIN'],
  '/profile': ['ADMIN', 'TE', 'TAE'],
}

export const MENU_ITEMS = [
  {
    key: '/projects',
    icon: 'ProjectOutlined',
    label: '项目管理',
    roles: ['ADMIN', 'TE', 'TAE'],
  },
  {
    key: '/requirements',
    icon: 'FileTextOutlined',
    label: '需求分析',
    roles: ['ADMIN', 'TE'],
    children: [
      { key: '/requirements/upload', label: 'PRD上传', roles: ['ADMIN', 'TE'] },
      { key: '/test-points', label: '测试点列表', roles: ['ADMIN', 'TE', 'TAE'] },
      { key: '/test-points/review', label: '测试点审核', roles: ['ADMIN', 'TE'] },
      { key: '/trace-matrix', label: '追踪矩阵', roles: ['ADMIN', 'TE', 'TAE'] },
    ],
  },
  {
    key: '/register',
    icon: 'UserAddOutlined',
    label: '用户注册',
    roles: ['ADMIN'],
  },
]
