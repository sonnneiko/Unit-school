import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { AuthProvider } from '../context/AuthContext'
import { PrivateRoute } from '../components/PrivateRoute'
import { AdminRoute } from '../components/AdminRoute'

function wrap(ui: React.ReactElement, initialPath = '/') {
  return render(
    <UsersProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
      </AuthProvider>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('PrivateRoute', () => {
  it('redirects unauthenticated user to /login', () => {
    wrap(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    localStorage.setItem('unit_school_user', JSON.stringify({
      id: 'u1', name: 'Test', email: 'user@unitpay.ru', role: 'user', progress: {}
    }))
    wrap(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})

describe('AdminRoute', () => {
  it('redirects non-admin user to /', () => {
    localStorage.setItem('unit_school_user', JSON.stringify({
      id: 'u1', name: 'Test', email: 'user@unitpay.ru', role: 'user', progress: {}
    }))
    wrap(
      <Routes>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>
        </Route>
      </Routes>,
      '/admin'
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('renders admin page for admin user', () => {
    localStorage.setItem('unit_school_user', JSON.stringify({
      id: 'a1', name: 'Admin', email: 'admin@unitpay.ru', role: 'admin', progress: {}
    }))
    wrap(
      <Routes>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>
        </Route>
      </Routes>,
      '/admin'
    )
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
