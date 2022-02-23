import React, { Children } from 'react'
import AdminScreen from '../screens/Admin Screens/User List View'
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
const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route
            path="login"
            element={
              <React.Fragment>
                <SignIn />
                <InfoComponent />
              </React.Fragment>
            }
          />
          <Route
            path="register"
            element={
              <AuthLayout>
                <SignUp />
              </AuthLayout>
            }
          />
          <Route path="forgot-password" element={<Forgot />} />
          <Route path="reset-password" element={<ChnagePassword />} />
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
          <Route path="user/approval-request" element={<UserApprovalScreen />} />
          <Route path="profile" element={<ProfileSettingScreen />} />
        </Route>
        <Route
          element={
            <PrivateRoute>
              <Navigate to="/auth/login" />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default Routing
