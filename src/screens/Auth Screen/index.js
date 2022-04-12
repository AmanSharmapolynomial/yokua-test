import React from 'react'
import './style.css'
import { Outlet } from 'react-router'

const AuthScreen = () => {
  return (
    <>
      <div className="container forgot">
        <Outlet />
      </div>
    </>
  )
}

export default AuthScreen
