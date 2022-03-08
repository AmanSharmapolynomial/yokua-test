import React, { Children, useEffect, useState } from 'react'
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
import Header from '../components/Header'
import TermsPolicy from '../components/Terms Privacy/TermsPolicy'
import { getToken, getUserRoles } from '../utils/token'
import NewsScreen from '../screens/News Screen/NewsScreen'

const Routing = () => {
  // get User Login Info

  return (
    <React.Fragment>
      <Header isLogedIn={getToken()} isAdmin={true} />
      <div className="non_header_content relative">
        <Routes>
          <Route
            path="/auth"
            element={
              <React.Fragment>
                <Header />
                <AuthLayout />
              </React.Fragment>
            }
          >
            <Route
              path="login"
              element={
                <React.Fragment>
                  <InfoComponent />
                  <SignIn />
                </React.Fragment>
              }
            />
            <Route path="register" element={<SignUp />} />
            <Route path="forgot-password" element={<Forgot />} />
            <Route path="reset-password" element={<ChnagePassword />} />
            <Route path="terms-privacy" element={<TermsPolicy />} />
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
                <React.Fragment>
                  {/* {getUserRoles() == 'PMK Administrator' ? (
                    <UserApprovalScreen />
                  ) : (
                    <Navigate to="/admin/user/list-view" />
                  )} */}
                  <UserApprovalScreen />
                </React.Fragment>
              }
            />
            {/* <Route path="*" element={<Navigate to="/profile" />} /> */}
          </Route>
          <Route path="news" element={<NewsScreen />} />
          <Route path="profile" element={<ProfileSettingScreen />} />
          {/* <Route path="*" element={<Navigate to="/profile" />} /> */}

          {/* {(getUserRoles() == 'Technical Administrator') |
          (getUserRoles() == 'PMK Administrator') ? (
            <Route path="*" element={<Navigate to="/user/list-view" />} />
          ) : (
            <Route path="*" element={<Navigate to="/profile" />} />
          )} */}
        </Routes>
      </div>
    </React.Fragment>
  )
}

export default Routing
