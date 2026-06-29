import { Route, Routes } from 'react-router-dom'

import MainLayout from '../../shared/layouts/mainLayout/MainLayout'
import Home from '../pages/home/Home'
import Users from '../pages/users/Users'
import ExamsPage from '../pages/exams/ExamsPage'
import Documents from '../pages/documents/Documents'

import ProtectedRoutes from './ProtectedRoutes'
import Login from '../auth/login/Login'
import Register from '../auth/register/Register'
import Profile from '../auth/profile/Profile'

import ErrorPage from '../pages/error/ErrorPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<MainLayout />}>

        {/* auth */}
        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* protected */}
        <Route element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="exams" element={<ExamsPage />} />
          <Route path="documents" element={<Documents />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Error Route */}
        <Route path='*' element={<ErrorPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes