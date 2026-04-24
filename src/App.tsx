import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UsersProvider } from './context/UsersContext'
import { LessonsProvider } from './context/LessonsContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { AdminAppLayout } from './components/AdminAppLayout/AdminAppLayout'
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage'
import { AdminProgressPage } from './pages/Admin/AdminProgressPage'
import { LoginPage } from './pages/Login/Login'
import { DashboardPage } from './pages/Dashboard/Dashboard'
import { LessonPage } from './pages/Lesson/Lesson'
import { NotFoundPage } from './pages/NotFound/NotFound'
import { PlaceholderPage } from './pages/Placeholder/Placeholder'
import { ProfilePage } from './pages/Profile/Profile'
import { UsersListPage } from './pages/Admin/UsersListPage'
import { NewUserPage } from './pages/Admin/NewUserPage'
import { UserDetailPage } from './pages/Admin/UserDetailPage'
import { CoursesListPage } from './pages/Admin/CoursesListPage'
import { CourseDetailPage } from './pages/Admin/CourseDetailPage'
import { EmployeeProgressPage } from './pages/Admin/EmployeeProgressPage'
import { useAuth } from './context/AuthContext'

function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <LoginPage />
}

export default function App() {
  return (
    <UsersProvider>
      <LessonsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route element={<PrivateRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/lesson/:id" element={<LessonPage />} />
                  <Route path="/courses" element={<PlaceholderPage title="Курсы" />} />
                  <Route path="/progress" element={<PlaceholderPage title="Прогресс" />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
                <Route element={<AdminRoute />}>
                  <Route element={<AdminAppLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<UsersListPage />} />
                    <Route path="/admin/users/new" element={<NewUserPage />} />
                    <Route path="/admin/users/:id" element={<UserDetailPage />} />
                    <Route path="/admin/courses" element={<CoursesListPage />} />
                    <Route path="/admin/courses/:id" element={<CourseDetailPage />} />
                    <Route path="/admin/progress" element={<AdminProgressPage />} />
                    <Route path="/admin/progress/:id" element={<EmployeeProgressPage />} />
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LessonsProvider>
    </UsersProvider>
  )
}
