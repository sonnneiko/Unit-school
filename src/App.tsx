import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UsersProvider } from './context/UsersContext'
import { LessonsProvider } from './context/LessonsContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { AdminLayout } from './pages/Admin/AdminLayout'
import { LoginPage } from './pages/Login/Login'
import { DashboardPage } from './pages/Dashboard/Dashboard'
import { LessonPage } from './pages/Lesson/Lesson'
import { NotFoundPage } from './pages/NotFound/NotFound'
import { PlaceholderPage } from './pages/Placeholder/Placeholder'
import { UsersListPage } from './pages/Admin/UsersListPage'
import { NewUserPage } from './pages/Admin/NewUserPage'
import { UserDetailPage } from './pages/Admin/UserDetailPage'
import { CoursesListPage } from './pages/Admin/CoursesListPage'
import { CourseDetailPage } from './pages/Admin/CourseDetailPage'
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
                  <Route path="/profile" element={<PlaceholderPage title="Профиль" />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/users" replace />} />
                      <Route path="users" element={<UsersListPage />} />
                      <Route path="users/new" element={<NewUserPage />} />
                      <Route path="users/:id" element={<UserDetailPage />} />
                      <Route path="courses" element={<CoursesListPage />} />
                      <Route path="courses/:id" element={<CourseDetailPage />} />
                    </Route>
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
