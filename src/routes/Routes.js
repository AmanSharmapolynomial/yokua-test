import React, { Children } from 'react'
import Header from '../components/Header'
import AdminScreen from '../screens/Admin Screens/User List View'
import AuthScreen from '../screens/Auth Screen'
import ProfileSettingScreen from '../screens/Profile Setting'
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom'
import { Navigate } from 'react-router'
import UserListView from '../screens/Admin Screens/User List View'
import UserApprovalScreen from '../screens/Admin Screens/User Approval Request'
import SignIn from '../components/Sign In'
import SignUp from '../components/Sign Up'
import InfoComponent from '../components/Info'
import AdminScreens from '../screens/Admin Screens'
import Forgot from '../components/Forgot Password/Forgot'
import ChnagePassword from '../components/Forgot Password/ChangePassword'
import { useStoreState } from 'easy-peasy'
import { useLocation } from 'react-router'
import HomeScreen from '../screens/Home Screen'
import PrivateRoute from './PrivateRoute'
import AuthLayout from '../layouts/AuthLayout'
const Rout = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navigate to="/auth/register" />
            </PrivateRoute>
          }
        />
        <Route path="/auth" element={<AuthScreen />}>
          <Route
            path="auth/login"
            element={
              <AuthScreen>
                <SignIn />
                <InfoComponent />
              </AuthScreen>
            }
          />
          <Route
            path="auth/register"
            element={
              <AuthScreen>
                <SignUp />
              </AuthScreen>
            }
          />
          <Route path="auth/forgot-password" element={<Forgot />} />
          <Route path="auth/reset-password" element={<ChnagePassword />} />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminScreens />
            </PrivateRoute>
          }
        >
          <Route path="user/list-view" element={<UserListView />} />
          <Route
            path="user/approval-request"
            element={
              <PrivateRoute>
                <UserApprovalScreen />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileSettingScreen />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default Routes
