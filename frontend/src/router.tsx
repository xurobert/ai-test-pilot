import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Direct imports (no lazy for MVP — avoids React Suspense error #426)
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/auth/Profile'
import ProjectList from './pages/projects/ProjectList'
import ProjectDetail from './pages/projects/ProjectDetail'
import PrdUpload from './pages/requirements/PrdUpload'
import TestPointList from './pages/testpoints/TestPointList'
import TestPointReview from './pages/testpoints/TestPointReview'
import TraceMatrix from './pages/trace/TraceMatrix'
import Forbidden from './pages/Forbidden'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout><Login /></AuthLayout>,
  },
  {
    path: '/login',
    element: <AuthLayout><Login /></AuthLayout>,
  },
  {
    path: '/register',
    element: <MainLayout><Register /></MainLayout>,
  },
  {
    path: '/profile',
    element: <MainLayout><Profile /></MainLayout>,
  },
  {
    path: '/projects',
    element: <MainLayout><ProjectList /></MainLayout>,
  },
  {
    path: '/projects/:id',
    element: <MainLayout><ProjectDetail /></MainLayout>,
  },
  {
    path: '/projects/:id/upload',
    element: <MainLayout><PrdUpload /></MainLayout>,
  },
  {
    path: '/requirements/upload',
    element: <MainLayout><PrdUpload /></MainLayout>,
  },
  {
    path: '/projects/:id/testpoints',
    element: <MainLayout><TestPointList /></MainLayout>,
  },
  {
    path: '/test-points',
    element: <MainLayout><TestPointList /></MainLayout>,
  },
  {
    path: '/projects/:id/review',
    element: <MainLayout><TestPointReview /></MainLayout>,
  },
  {
    path: '/test-points/review',
    element: <MainLayout><TestPointReview /></MainLayout>,
  },
  {
    path: '/projects/:id/trace',
    element: <MainLayout><TraceMatrix /></MainLayout>,
  },
  {
    path: '/trace-matrix',
    element: <MainLayout><TraceMatrix /></MainLayout>,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
