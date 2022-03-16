import React from 'react'
import { BrowserRouter as Router, Route, Routes, Redirect, Navigate } from 'react-router-dom'
import { getToken } from '../utils/token'
const PrivateRoute = ({ children }) => {
  if (!getToken()) {
    return <Navigate to="/auth/login" replace />
  }
  // later check if user is there is easy peasy and then if usr not there fetch user details and store in easy peasy
  return children
}

export default PrivateRoute
