import { useStoreState } from 'easy-peasy'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Navigate } from 'react-router'
import { removeToken, removeUserRole } from '../../utils/token'
import Navbar from '../Navbar'
import PhoneNav from '../Navbar/PhoneNav'
import './style.css'
import Yokogawa from '../../assets/Yokogawa png.png'
const Header = ({ isLogedIn, isAdmin }) => {
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)
  const width = window.outerWidth

  const navigate = useNavigate()
  const [renderPhoneNav, setrenderPhoneNav] = useState(false)

  return (
    <div
      className="header sticky-top"
      style={
        {
          // height: isLogedIn ? (width < 820 ? '10vh' : '16vh') : '6vh',
          // maxHeight: '10rem',
          // minHeight: isLogedIn ? (width > 820 ? '9rem' : '5rem') : '5rem',
        }
      }
    >
      <div className="col">
        <div className="header-container px-4">
          <div className="header__logo">
            {/* Logo */}
            <img src={Yokogawa} alt="logo" />
            {/* <span className="logo__name">YOKOGAWA</span>
            <span className="logo__tagline">Co-innovating tommorow</span> */}
          </div>
          <div className="header__title">FLOW CENTER PAGES</div>
          {isLogedIn && (
            <i
              className="fa-solid fa-bars"
              style={{
                color: 'white',
                zIndex: '100000',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => {
                setrenderPhoneNav(!renderPhoneNav)
              }}
            />
          )}
          {isLogedIn && renderPhoneNav && <PhoneNav />}
          {isLogedIn && (
            <button
              className="logout-btn"
              style={{
                padding: '0.2rem 0.5rem',
                cursor: 'pointer',
                zIndex: '1000',
              }}
              onClick={() => {
                removeToken()
                removeUserRole()
                navigate('/auth/login')
              }}
            >
              Log out
            </button>
          )}
        </div>
        {isLogedIn && <Navbar isAdmin={isAdmin} />}
      </div>
    </div>
  )
}

export default Header
