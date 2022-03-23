import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserRoles } from '../../utils/token'
import Dropdown from '../Dropdown'
import NavDropdown from './navDropdown'
import './style.css'

const Navbar = ({ isAdmin }) => {
  const [renderDropdown, setRenderDropdown] = useState(false)

  const navDropdownAdminData = [
    { name: 'User Management', url: '/admin/user/list-view' },
    { name: 'Event Management', url: '/admin/user/list-view' },
  ]

  if (getUserRoles() == 'PMK Administrator' || getUserRoles() == 'Technical Administrator') {
    navDropdownAdminData.push({ name: 'User Request', url: '/admin/user/approval-request' })
    navDropdownAdminData.push({ name: 'Company Names', url: '/admin/user/company-names' })
  } else {
    navDropdownAdminData.push({ name: 'Company Names', url: '/admin/user/company-names' })
  }

  const searchNavRef = useRef()
  return (
    <div className="navbar">
      <ul>
        <li>
          <a>Home</a>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li className="border-left border-right">
          <a>Product Lines</a>
          <i className="fa-solid fa-caret-down " />
        </li>

        <li className="border-right">
          <a>RYG Information</a>
          <i className="fa-solid fa-caret-down " />
        </li>

        <li>
          <a>Training</a>
        </li>
        <li>
          <a>Data History</a>
        </li>
        <li>
          <Link to="/profile">Profile Setting</Link>
        </li>
        {getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator' ? (
          <li
            className="border-left border-right"
            onClick={() => {
              setRenderDropdown(!renderDropdown)
            }}
            style={{
              position: 'relative',
              cursor: 'pointer',
            }}
          >
            <a>Admin Management</a>
            <i className="fa-solid fa-caret-down " />
            <NavDropdown
              data={navDropdownAdminData}
              style={{ position: 'absolute' }}
              icon={true}
              renderDropdown={renderDropdown}
            />
          </li>
        ) : (
          ''
        )}
      </ul>
      <div className="searchBar">
        <i className="fa-solid fa-magnifying-glass" />
        <input
          ref={searchNavRef}
          type="text"
          placeholder="What are you looking for?"
          className="search_input"
          autoComplete={false}
        ></input>
      </div>
    </div>
  )
}

export default Navbar
