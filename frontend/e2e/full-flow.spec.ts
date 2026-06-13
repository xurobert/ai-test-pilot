import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3001'
const API_URL = 'http://localhost:8002'

// 健康检查
test.describe('Health Check', () => {
  test('frontend is running', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page).toHaveTitle(/AI测试平台/)
  })

  test('backend API is running', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`)
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.status).toBe('ok')
  })
})

// 认证流程
test.describe('Authentication Flow', () => {
  test('login with valid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    
    // 填写登录表单
    await page.fill('input[placeholder="用户名"]', 'admin')
    await page.fill('input[placeholder="密码"]', 'admin123')
    await page.click('button:has-text("登录")')
    
    // 验证登录成功 - 跳转到项目管理页
    await page.waitForURL(`${BASE_URL}/projects`)
    await expect(page.locator('text=项目管理')).toBeVisible()
  })

  test('login with invalid credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    
    await page.fill('input[placeholder="用户名"]', 'wrong')
    await page.fill('input[placeholder="密码"]', 'wrong')
    await page.click('button:has-text("登录")')
    
    // 应该还在登录页
    await page.waitForTimeout(1000)
    expect(page.url()).toContain('/login')
  })

  test('register new user', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    
    // 点击注册链接
    await page.click('text=立即注册')
    await page.waitForURL(`${BASE_URL}/register`)
    
    // 填写注册表单
    const timestamp = Date.now()
    await page.fill('input[placeholder="用户名"]', `testuser${timestamp}`)
    await page.fill('input[placeholder="邮箱"]', `test${timestamp}@test.com`)
    await page.fill('input[placeholder="密码"]', 'password123')
    await page.click('button:has-text("注册")')
    
    // 注册成功后跳转到项目页
    await page.waitForURL(`${BASE_URL}/projects`, { timeout: 5000 })
    await expect(page.locator('text=项目管理')).toBeVisible()
  })
})

// 项目管理
test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    // 登录
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[placeholder="用户名"]', 'admin')
    await page.fill('input[placeholder="密码"]', 'admin123')
    await page.click('button:has-text("登录")')
    await page.waitForURL(`${BASE_URL}/projects`)
  })

  test('view project list', async ({ page }) => {
    await expect(page.locator('text=项目管理')).toBeVisible()
    await expect(page.locator('table')).toBeVisible()
  })

  test('create new project', async ({ page }) => {
    await page.click('button:has-text("新建项目")')
    
    // 填写项目表单
    await page.fill('input[placeholder="项目名称"]', `Test Project ${Date.now()}`)
    await page.fill('textarea[placeholder="项目描述"]', 'This is a test project')
    await page.click('button:has-text("创建")')
    
    // 验证创建成功
    await page.waitForTimeout(1000)
    await expect(page.locator('text=创建成功')).toBeVisible()
  })
})

// 需求分析
test.describe('Requirements Analysis', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[placeholder="用户名"]', 'admin')
    await page.fill('input[placeholder="密码"]', 'admin123')
    await page.click('button:has-text("登录")')
    await page.waitForURL(`${BASE_URL}/projects`)
  })

  test('navigate to PRD upload', async ({ page }) => {
    await page.click('text=PRD上传')
    await page.waitForTimeout(1000)
    await expect(page.locator('text=上传PRD文档')).toBeVisible()
  })

  test('navigate to test point list', async ({ page }) => {
    await page.click('text=测试点列表')
    await page.waitForTimeout(1000)
    await expect(page.locator('text=测试点列表')).toBeVisible()
  })

  test('navigate to test point review', async ({ page }) => {
    await page.click('text=测试点审核')
    await page.waitForTimeout(1000)
    await expect(page.locator('text=测试点审核')).toBeVisible()
  })

  test('navigate to trace matrix', async ({ page }) => {
    await page.click('text=追踪矩阵')
    await page.waitForTimeout(1000)
    await expect(page.locator('text=需求-测试追踪矩阵')).toBeVisible()
    
    // 验证表格数据
    await expect(page.locator('table')).toBeVisible()
    await expect(page.locator('text=REQ-001')).toBeVisible()
  })
})

// 用户注册（admin）
test.describe('User Registration (Admin)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[placeholder="用户名"]', 'admin')
    await page.fill('input[placeholder="密码"]', 'admin123')
    await page.click('button:has-text("登录")')
    await page.waitForURL(`${BASE_URL}/projects`)
  })

  test('admin can access register page', async ({ page }) => {
    await page.click('text=用户注册')
    await page.waitForTimeout(1000)
    await expect(page.locator('text=注册新用户')).toBeVisible()
  })
})

// 个人中心
test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[placeholder="用户名"]', 'admin')
    await page.fill('input[placeholder="密码"]', 'admin123')
    await page.click('button:has-text("登录")')
    await page.waitForURL(`${BASE_URL}/projects`)
  })

  test('navigate to profile', async ({ page }) => {
    // 点击用户头像/名称
    await page.click('.ant-avatar, .ant-dropdown-trigger') 
    await page.waitForTimeout(500)
    
    // 尝试访问 profile 页面
    await page.goto(`${BASE_URL}/profile`)
    await page.waitForTimeout(1000)
    await expect(page.locator('text=个人信息')).toBeVisible()
  })
})

// 异常流程
test.describe('Error Handling', () => {
  test('404 page', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page`)
    await page.waitForTimeout(1000)
    await expect(page.locator('text=404')).toBeVisible()
  })

  test('unauthorized access redirect', async ({ page }) => {
    // 未登录访问需要认证的路由
    await page.goto(`${BASE_URL}/projects`)
    await page.waitForTimeout(1000)
    // 应该被重定向到登录页
    expect(page.url()).toContain('/login')
  })
})
