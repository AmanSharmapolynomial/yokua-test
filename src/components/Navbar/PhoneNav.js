import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Navigate } from 'react-router'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { removeToken, removeUserRole } from '../../utils/token'
import './style.css'

const PhoneNav = () => {
  const [renderDropdown, setRenderDropdown] = useState(false)

  const dropDownData1 = [
    {
      name: 'User Management',
      url: '/admin/user/list-view',
    },
    {
      name: 'Event Management',
      url: '/admin/user/list-view',
    },
    {
      name: 'User Request',
      url: '/admin/user/approval-request',
    },
  ]

  const navigate = useNavigate()

  return (
    <div className="phone-name-dropdown">
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '200px',
          alignItems: 'start',
          justifyContent: 'space-between',
          margin: 0,
          padding: 0,
          border: '1px solid white',
          borderRadius: '5px',
          overflow: 'hidden',
          boxShadow: '0px 2px 5px -1px rgba(122,122,122,1)',
        }}
      >
        <li className="phone-nav-item">
          <a>Home</a>
        </li>

        <li className="phone-nav-item">
          <Link to="/news">News</Link>
        </li>

        <li className="phone-nav-item">
          <a>Home</a>
        </li>
        <li className="phone-nav-item">
          <a>
            Product Lines <i className="fa-solid fa-caret-down" />
          </a>
        </li>
        <li className="phone-nav-item">
          <a>
            RYG Information <i className="fa-solid fa-caret-down" />
          </a>
        </li>
        <li className="phone-nav-item">
          <a>Training</a>
        </li>
        <li className="phone-nav-item">
          <a>Data History</a>
        </li>
        <li className="phone-nav-item">
          <Link to="/profile">Profile Settings</Link>
        </li>
        <li
          className="phone-nav-item"
          onClick={() => {
            setRenderDropdown(!renderDropdown)
          }}
          style={{
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <a>
            Admin Management <i className="fa-solid fa-caret-down" />
          </a>
        </li>
        {renderDropdown && (
          <React.Fragment>
            <li
              className="phone-nav-item dropdown-item-phone"
              style={{
                cursor: 'pointer',
              }}
            >
              <Link to="/admin/user/list-view">User Management</Link>
            </li>
            <li
              className="phone-nav-item dropdown-item-phone"
              style={{
                cursor: 'pointer',
              }}
            >
              <Link to="/admin/user/list-view">Event Management</Link>
            </li>
            <li
              className="phone-nav-item dropdown-item-phone"
              style={{
                cursor: 'pointer',
              }}
            >
              <Link to="/admin/user/approval-request">User Approval</Link>
            </li>
          </React.Fragment>
        )}
        <li
          className="phone-nav-item"
          onClick={() => {
            removeToken()
            removeUserRole()
            navigate('/auth/login')
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          <a onClick={() => toast.success('Log out Successfully')}>Logout</a>
        </li>
      </ul>
    </div>
  )
}

export default PhoneNav
