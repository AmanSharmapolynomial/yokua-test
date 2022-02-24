import React from 'react'
import Header from '../components/Header'
import { Outlet, Navigate, useLocation } from 'react-router'
import { getToken } from '../utils/token'

const AuthLayout = ({ children }) => {
  if (getToken()) {
    return <Navigate to="/admin/user/list-view" replace />
  }
  const { pathname } = useLocation()
  if (pathname == '/auth') {
    return <Navigate to="/auth/login" />
  }
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

export default AuthLayout
