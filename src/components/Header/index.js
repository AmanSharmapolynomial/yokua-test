import React from 'react'
import { useNavigate, useLocation } from 'react-router'
import Navbar from '../Navbar'
import './style.css'
import Yokogawa from '../../assets/Yokogawa png.png'
import PhoneNav from '../Navbar/PhoneNav'

const Header = ({ isLogedIn, isAdmin }) => {
  const navigate = useNavigate()
  const loc = useLocation()
  const [isMd, setIsMd] = React.useState(false)

  function updateWindowDimensions() {
    if (window.innerWidth >= 768) setIsMd(true)
    else setIsMd(false)
  }

  React.useEffect(() => {
    document.getElementById('main').style.position = 'relative'
    document.getElementById('main').style.left = '0rem'
  }, [loc.pathname])

  React.useLayoutEffect(() => {
    updateWindowDimensions()
    window.addEventListener('resize', updateWindowDimensions)
    return () => window.removeEventListener('resize', updateWindowDimensions)
  }, [])

  return (
    <header className="header sticky-top mb-auto">
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col">
          <div className="row header-container py-md-2">
            <div className="header__logo col-6 col-md-4">
              <img
                src={Yokogawa}
                alt="logo"
                role={'button'}
                onClick={() => {
                  navigate('/')
                }}
              />
            </div>
            <button
              onClick={() => {
                if (document.getElementById('navbar-sm').classList.contains('show')) {
                  document.getElementById('main').style.position = 'relative'
                  document.getElementById('main').style.left = '0rem'
                } else {
                  document.getElementById('main').style.position = 'relative'
                  document.getElementById('main').style.left = '-16rem'
                }
              }}
              className="navbar-toggler w-auto d-block d-md-none"
              type="button"
              data-toggle="collapse"
              aria-expanded="false"
              data-target="#navbar-sm"
              aria-controls="#navbar-sm"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">
                <i className="fas fa-bars" style={{ color: '#fff' }} />
              </span>
            </button>
            <div className="header__title col-12 col-md-4 me-md-auto text-center my-2 my-md-0">
              FLOW CENTER PAGES
            </div>
            <div className="col-4 d-none d-md-block">
              {isLogedIn && (
                <form
                  className="w-auto float-right"
                  onSubmit={e => {
                    e.preventDefault()
                    navigate(`/search/${e.target.search.value}`)
                  }}
                >
                  <div className="input-group search px-3">
                    <span className="input-group-addon">
                      <i className="fa-solid fa-magnifying-glass" style={{ color: 'white' }} />
                    </span>
                    <input
                      name="search"
                      type="text"
                      placeholder="What are you looking for?"
                      className="search_input ms-3"
                      autoComplete="false"
                    />
                  </div>
                </form>
              )}
            </div>
          </div>
          {isLogedIn && (
            <div className="row">
              <div className="col">
                {!isMd ? (
                  <PhoneNav
                    isAdmin={isAdmin}
                    isLogedIn={isLogedIn}
                    hideNavbar={() => {
                      // document.getElementById('main').style.position = 'relative'
                      // document.getElementById('main').style.left = '0rem'
                      document.getElementById('navbar-sm').classList.remove('show')
                    }}
                  />
                ) : (
                  <Navbar isAdmin={isAdmin} isLogedIn={isLogedIn} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
