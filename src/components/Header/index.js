import { useStoreState } from 'easy-peasy'
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './style.css'
const Header = ({ isLogedIn, isAdmin }) => {
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)
  const width = window.outerWidth

  return (
    <div
      className="header"
      style={{
        height: isLogedIn ? (width < 820 ? '10vh' : '16vh') : '10vh',
        maxHeight: '10rem',
        minHeight: width > 820 ? '9rem' : '5rem',
      }}
    >
      <div className="header_max-width">
        <div className="header-container">
          <div className="header__logo">
            {/* Logo */}
            <span className="logo__name">YOKOGAWA</span>
            <span className="logo__tagline">Co-innovating tommorow</span>
          </div>
          <div className="header__title">FLOW CENTER PAGES</div>
          <i
            className="fa-solid fa-bars"
            style={{
              color: 'white',
            }}
          />
        </div>
        {isLogedIn && <Navbar isAdmin={isAdmin} />}
      </div>
    </div>
  )
}

export default Header
