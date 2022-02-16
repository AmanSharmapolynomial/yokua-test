import React from 'react'
import Header from './components/Header'
import AdminScreen from './screens/Admin Screens/User List View'
import AuthScreen from './screens/Auth Screen'
import ProfileSettingScreen from './screens/Profile Setting'
import { BrowserRouter as Router, Route, Routes, Redirect } from 'react-router-dom'
import RequireAuth from './screens/Auth Screen/requireAuth'
import { Navigate } from 'react-router'
import UserListView from './screens/Admin Screens/User List View'

function App() {
  const auth = true
  return (
    <div className="App">
      <Header />
      <div className="non_header_content relative">
        <UserListView />
        {/* <AuthScreen /> */}
        {/* <ProfileSettingScreen /> */}
      </div>
    </div>
  )
}

export default App
