import React from 'react'
import Header from '../components/Header'
import { Outlet, Navigate } from 'react-router'
import { getToken } from '../utils/token'

const AuthLayout = ({ children }) => {
  if (getToken()) {
    return <Navigate to="/admin/user/list-view" replace />
  }
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}

export default AuthLayout
