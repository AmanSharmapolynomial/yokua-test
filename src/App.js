import React from 'react'
import Header from './components/Header'
import AdminScreen from './screens/Admin Screen'
import AuthScreen from './screens/Auth Screen'
import ProfileSettingScreen from './screens/Profile Setting'

function App() {
  return (
    <div className="App">
      <Header />
      <div className="non_header_content">
        <AuthScreen />
        {/* <AdminScreen /> */}
        {/* <ProfileSettingScreen /> */}
      </div>
    </div>
  )
}

export default App
