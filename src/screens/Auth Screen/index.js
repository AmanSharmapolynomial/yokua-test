import React from 'react'
import './style.css'
import Header from '../../components/Header'
import InfoComponent from '../../components/Info'
import SignIn from '../../components/Sign In'
import SignUp from '../../components/Sign Up'
import Forgot from '../../components/Forgot Password/Forgot'
import ChangePassword from '../../components/Forgot Password/ChangePassword'
import { Route } from 'react-router'
import { Routes } from 'react-router'
import { Outlet } from 'react-router'
import { useLocation, Navigate } from 'react-router'

const AuthScreen = () => {
  console.log(navigate)
  // const { path } = useLocation()
  // if (path == '/auth') {
  //   return <Navigate to="/auth/login" replace />
  // }

  return (
    <>
      <Header isLogedIn={getToken()} isAdmin={true} />
      <div className="container forgot">
        <Outlet />
      </div>
    </>
  )
}

export default AuthScreen
