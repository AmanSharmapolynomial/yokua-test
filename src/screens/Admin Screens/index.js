import React from 'react'
import { Outlet } from 'react-router'

const AdminScreens = () => {
  return (
    <>
      <h1> AdminScreens </h1>
      <Outlet />
    </>
  )
}

export default AdminScreens
