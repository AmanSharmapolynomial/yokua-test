import React from 'react'
import { Outlet } from 'react-router'
import Header from '../../components/Header'

const AdminScreens = () => {
  return (
    <React.Fragment>
      <Header />
      <div className="non_header_content relative">
        <Outlet />
      </div>
    </React.Fragment>
  )
}

export default AdminScreens
