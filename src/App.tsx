import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/Login/Login'
import { DashboardPage } from './pages/Dashboard/Dashboard'
import { LessonPage } from './pages/Lesson/Lesson'
import { AdminPage } from './pages/Admin/Admin'
import { NotFoundPage } from './pages/NotFound/NotFound'
import { PlaceholderPage } from './pages/Placeholder/Placeholder'
import { useAuth } from './context/AuthContext'

function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <LoginPage />
}

export default function App() {
  return (
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
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
