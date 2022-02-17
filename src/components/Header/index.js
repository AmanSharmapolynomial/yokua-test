import { useStoreState } from 'easy-peasy'
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './style.css'
const Header = () => {
  // fetch state
  const userDetails = useStoreState(state => state.userDetails)
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    console.log(userDetails)
  }, [])
  return (
    <div className="header">
      <div className="header_max-width">
        <div className="header-container">
          <div className="header__logo">
            {/* Logo */}
            <span className="logo__name">YOKOGAWA</span>
            <span className="logo__tagline">Co-innovating tommorow</span>
          </div>
          <div className="header__title">FLOW CENTER PAGES</div>
        </div>
        {loggedIn && <Navbar />}
      </div>
    </div>
  )
}

export default Header
