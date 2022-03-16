import { useStoreState } from 'easy-peasy'
import React from 'react'
import { Outlet, useLocation } from 'react-router'
import { Navigate } from 'react-router'
import Header from '../../components/Header'

const AdminScreens = () => {
  const { pathname } = useLocation()
  if (pathname == '/admin') {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <React.Fragment>
      <Header isLogedIn={true} isAdmin={true} />
      <Outlet />
    </React.Fragment>
  )
}

export default AdminScreens
