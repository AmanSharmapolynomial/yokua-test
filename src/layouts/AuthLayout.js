import React from 'react'
import Header from '../components/Header'

const AuthLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Header />
      {children}
    </React.Fragment>
  )
}

export default AuthLayout
