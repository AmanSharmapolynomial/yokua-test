import React from 'react'
import { Outlet, useLocation } from 'react-router'
import { Navigate } from 'react-router'
import Header from '../../components/Header'

const AdminScreens = () => {
  const { pathname } = useLocation()
  if (pathname == '/admin') {
    return <Navigate to="/admin/login" replace />
  }
  return (
    <React.Fragment>
      <Header />
      <Outlet />
    </React.Fragment>
  )
}

export default AdminScreens
