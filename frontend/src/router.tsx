import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import LoadingFallback from './components/LoadingFallback'

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const Profile = lazy(() => import('./pages/auth/Profile'))
const ProjectList = lazy(() => import('./pages/projects/ProjectList'))
const ProjectDetail = lazy(() => import('./pages/projects/ProjectDetail'))
const PrdUpload = lazy(() => import('./pages/requirements/PrdUpload'))
const TestPointList = lazy(() => import('./pages/testpoints/TestPointList'))
const TestPointReview = lazy(() => import('./pages/testpoints/TestPointReview'))
const TraceMatrix = lazy(() => import('./pages/trace/TraceMatrix'))
const Forbidden = lazy(() => import('./pages/Forbidden'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
    element: <AuthLayout><Register /></AuthLayout>,
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
    path: '/projects/:id/testpoints',
    element: <MainLayout><TestPointList /></MainLayout>,
  },
  {
    path: '/projects/:id/review',
    element: <MainLayout><TestPointReview /></MainLayout>,
  },
  {
    path: '/projects/:id/trace',
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
