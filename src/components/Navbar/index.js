import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserRoles } from '../../utils/token'
import NavDropdown from './navDropdown'
import './style.css'

const Navbar = ({ isAdmin }) => {
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

  const searchNavRef = useRef()
  return (
    <nav className="navbar navbar-expand-md p-0">
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
          <li className="nav-item">
            <a>Home</a>
          </li>
          <li className="nav-item">
            <Link to="/news">News</Link>
          </li>
          <li className="nav-item border-left border-right">
            <li
              className="nav-item border-left dropdown"
              onClick={() => {
                setProductLineDropdown(!isProductLineDropdown)
              }}
              style={{
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <a>Product Line</a>
              <i className="fa-solid fa-caret-down " />
              <NavDropdown
                data={productLineDropdown}
                style={{ position: 'absolute' }}
                icon={true}
                renderDropdown={isProductLineDropdown}
              />
            </li>
            {/* <Link to="/admin/products">Product Lines</Link> */}
          </li>

          <li className="nav-item border-right">
            <a>RYG Information</a>
            <i className="fa-solid fa-caret-down " />
          </li>

          <li className="nav-item">
            <a>Training</a>
          </li>
          <li className="nav-item">
            <a>Data History</a>
          </li>
          <li className="nav-item">
            <Link to="/profile">Profile Setting</Link>
          </li>
          {getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator' ? (
            <li
              className="nav-item border-left border-right dropdown"
              onClick={() => {
                setRenderDropdown(!renderDropdown)
              }}
              style={{
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <a
                class="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Admin Management
              </a>
              <NavDropdown
                data={navDropdownAdminData}
                // style={{ position: 'absolute' }}
                icon={true}
                renderDropdown={renderDropdown}
              />
            </li>
          ) : (
            ''
          )}
        </ul>
      </div>
      <div className="col-auto">
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
      </div>
    </nav>
  )
}

export default Navbar
