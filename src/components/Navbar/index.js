import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { getUserRoles } from '../../utils/token'
import NavDropdown from './navDropdown'
import { removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import './style.css'

const Navbar = ({ isAdmin, isLogedIn }) => {
  const navigate = useNavigate()
  const [renderDropdown, setRenderDropdown] = useState(false)
  const [isProductLineDropdown, setProductLineDropdown] = useState(false)

  const navDropdownAdminData = [
    { name: 'User Management', url: '/admin/user/list-view' },
    { name: 'Event Management', url: '/admin/user/list-view' },
  ]

  const productLineDropdown = [
    { name: 'Approved Tokachu', url: '/admin/approved-tokuchus' },
    { name: 'Product Line', url: '/admin/user/list-view' },
  ]

  if (getUserRoles() == 'PMK Administrator' || getUserRoles() == 'Technical Administrator') {
    navDropdownAdminData.push({
      name: 'User Request',
      url: '/admin/user/approval-request',
    })
    navDropdownAdminData.push({
      name: 'Company Names',
      url: '/admin/user/company-names',
    })
  } else {
    navDropdownAdminData.push({
      name: 'Company Names',
      url: '/admin/user/company-names',
    })
  }

  return (
    <div className="row d-flex justify-content-center">
      <nav className="navbar navbar-expand-md">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar"
          aria-controls="#navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="fas fa-bars" style={{ color: '#fff' }} />
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav">
            <li className="nav-item px-md-3">
              <a className="nav-link">Home</a>
            </li>
            <li className="nav-item px-md-3">
              <Link className="nav-link" to="/news">
                News
              </Link>
            </li>
            <li className="nav-item dropdown px-md-3">
              <Link
                to="/product-lines"
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Product Lines
              </Link>
            </li>

            <li className="nav-item dropdown px-md-3">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                RYG Information
              </a>
            </li>

            <li className="nav-item px-md-3">
              <a className="nav-link">Training</a>
            </li>
            <li className="nav-item px-md-3">
              <a className="nav-link">Data History</a>
            </li>
            <li className="nav-item px-md-3">
              <Link className="nav-link" to="/profile">
                Profile Setting
              </Link>
            </li>
            {getUserRoles() == 'Technical Administrator' ||
            getUserRoles() == 'PMK Administrator' ? (
              <li className="nav-item dropdown px-md-3">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-display="static"
                >
                  Admin Management
                </a>
                <NavDropdown
                  data={navDropdownAdminData}
                  // style={{ position: 'absolute' }}
                  icon={true}
                />
              </li>
            ) : (
              ''
            )}
          </ul>
        </div>
        {/* <div className="col-auto">
        <div className="input-group search">
          <span className="input-group-addon">
            <i className="fa-solid fa-magnifying-glass" />
          </span>
          <input
            ref={searchNavRef}
            type="text"
            placeholder="What are you looking for?"
            className="search_input"
            autoComplete={false}
          ></input>
        </div>
      </div> */}
      </nav>
      {/* {isLogedIn && (
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
      )} */}
    </div>
  )
}

export default Navbar
