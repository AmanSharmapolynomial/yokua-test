import React from 'react'
import { Navigate } from 'react-router'
import { Outlet } from 'react-router'

const HomeScreen = () => {
  return (
    <div>
      <Navigate to="/auth/login" />
    </div>
  )
}

export default HomeScreen
