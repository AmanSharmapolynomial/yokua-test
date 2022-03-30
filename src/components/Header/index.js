import { useStoreState } from 'easy-peasy'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Navigate } from 'react-router'
import { removeToken, removeUserRole } from '../../utils/token'
import Navbar from '../Navbar'
import PhoneNav from '../Navbar/PhoneNav'
import './style.css'
import Yokogawa from '../../assets/Yokogawa png.png'
import { toast } from 'react-toastify'
const Header = ({ isLogedIn, isAdmin }) => {
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)
  const width = window.outerWidth

  const navigate = useNavigate()
  const [renderPhoneNav, setrenderPhoneNav] = useState(false)

  return (
    <header
      className="header sticky-top mb-auto"
      style={
        {
          // height: isLogedIn ? (width < 820 ? '10vh' : '16vh') : '6vh',
          // maxHeight: '10rem',
          // minHeight: isLogedIn ? (width > 820 ? '9rem' : '5rem') : '5rem',
        }
      }
    >
      <div className="row mx-5">
        <div className="col">
          <div className="row header-container py-2">
            <div className="header__logo col-12 col-md-2">
              {/* Logo */}
              <img src={Yokogawa} alt="logo" />
              {/* <span className="logo__name">YOKOGAWA</span>
            <span className="logo__tagline">Co-innovating tommorow</span> */}
            </div>
            <div className="header__title col-12 col-md-8 mr-md-auto text-center my-2 my-md-0">
              FLOW CENTER PAGES
            </div>
            {/* {isLogedIn && (
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
          {isLogedIn && renderPhoneNav && <PhoneNav />} */}
            {isLogedIn && (
              <div className="col-auto">
                <button
                  className="logout-btn"
                  onClick={() => {
                    toast.success('Log out successfully')
                    removeToken()
                    removeUserRole()
                    navigate('/auth/login')
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
          {isLogedIn && (
            <div className="row">
              <div className="col p-0">
                <Navbar isAdmin={isAdmin} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
