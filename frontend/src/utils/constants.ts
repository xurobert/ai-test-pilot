export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/projects': ['admin', 'tester', 'viewer'],
  '/projects/new': ['admin', 'tester'],
  '/requirements/upload': ['admin', 'tester'],
  '/test-points': ['admin', 'tester', 'viewer'],
  '/test-points/review': ['admin', 'tester'],
  '/trace-matrix': ['admin', 'tester', 'viewer'],
  '/register': ['admin'],
  '/profile': ['admin', 'tester', 'viewer'],
}

export const MENU_ITEMS = [
  {
    key: '/projects',
    icon: 'ProjectOutlined',
    label: '项目管理',
    roles: ['admin', 'tester', 'viewer'],
  },
  {
    key: '/requirements',
    icon: 'FileTextOutlined',
    label: '需求分析',
    roles: ['admin', 'tester'],
    children: [
      { key: '/requirements/upload', label: 'PRD上传', roles: ['admin', 'tester'] },
      { key: '/test-points', label: '测试点列表', roles: ['admin', 'tester', 'viewer'] },
      { key: '/test-points/review', label: '测试点审核', roles: ['admin', 'tester'] },
      { key: '/trace-matrix', label: '追踪矩阵', roles: ['admin', 'tester', 'viewer'] },
    ],
  },
  {
    key: '/register',
    icon: 'UserAddOutlined',
    label: '用户注册',
    roles: ['admin'],
  },
]
