import React from 'react'
import Header from './components/Header'
import AdminScreen from './screens/Admin Screens/User List View'
import AuthScreen from './screens/Auth Screen'
import ProfileSettingScreen from './screens/Profile Setting'
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom'
import RequireAuth from './screens/Auth Screen/requireAuth'
import { Navigate } from 'react-router'
import UserListView from './screens/Admin Screens/User List View'
import UserApprovalScreen from './screens/Admin Screens/User Approval Request'
import SignIn from './components/Sign In'
import SignUp from './components/Sign Up'
import InfoComponent from './components/Info'
import AdminScreens from './screens/Admin Screens'
import Forgot from './components/Forgot Password/Forgot'
import ChnagePassword from './components/Forgot Password/ChangePassword'
import { useStoreState } from 'easy-peasy'
import { useLocation } from 'react-router'

function App() {
  const RequireAuth = () => {
    const userDetails = useStoreState(state => state.userDetails)
    let location = useLocation()

    if (!userDetails[0]) {
      return <Navigate to="/auth/login" state={{ from: location }} replace />
    }

    return <></>
  }

  // fetch state
  const userDetails = useStoreState(state => state.userDetails)
  let loggedIn = userDetails[0]?.data

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="non_header_content relative">
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <p>You're logged In</p>
                </RequireAuth>
              }
            />
            <Route path="/auth" element={<AuthScreen />}>
              <Route
                path="login"
                element={
                  <>
                    <SignIn />
                    <InfoComponent />
                  </>
                }
              />
              <Route path="register" element={<SignUp />} />
              <Route path="forgot" element={<Forgot />} />
              <Route path="reset" element={<ChnagePassword />} />
            </Route>
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminScreens />
                </RequireAuth>
              }
            >
              <Route
                path="user/list-view"
                element={
                  <RequireAuth>
                    <UserListView />
                  </RequireAuth>
                }
              />
              <Route
                path="user/approval-request"
                element={
                  <RequireAuth>
                    <UserApprovalScreen />
                  </RequireAuth>
                }
              />
            </Route>
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfileSettingScreen />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
