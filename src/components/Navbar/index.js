import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { getUserRoles } from '../../utils/token'
import NavDropdown from './navDropdown'
import { removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import './style.css'
import API from '../../utils/api'

const Navbar = ({ isAdmin, isLogedIn }) => {
  const navigate = useNavigate()
  const [unreadNewsCount, setUnreadNewsCount] = useState(0)

  const navDropdownAdminData = [
    { name: 'User Management', url: '/admin/user/list-view' },
    { name: 'Event Management', url: '/admin/event' },
  ]

  const productLineDropdown = [
    { name: 'Approved Tokuchu', url: '/admin/approved-tokuchus' },
    { name: 'Product Line', url: '/product-lines' },
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

  const getUnreadNewsCount = async () => {
    try {
      const response = await API.get('/news/unread_count')
      setUnreadNewsCount(response.data.message)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getUnreadNewsCount()
  }, [])

  return (
    <nav className="navbar navbar-expand-md justify-content-center px-0">
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
      <div
        className="collapse navbar-collapse justify-content-between align-items-center w-100"
        id="navbar"
      >
        <ul className="navbar-nav mx-auto text-md-center text-left">
          <li className="nav-item px-3">
            <a className="nav-link">Home</a>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link" to="/news">
              News
              {unreadNewsCount !== 0 && (
                <svg
                  className="ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="19.313"
                  height="19.313"
                  viewBox="0 0 19.313 19.313"
                >
                  <path
                    id="Icon_feather-message-circle"
                    data-name="Icon feather-message-circle"
                    d="M13.616,3.5h.5l.055,0a9.146,9.146,0,0,1,8.638,8.638q0,.028,0,.055v.481a9.18,9.18,0,0,1-9.175,9.175h-.021a9.11,9.11,0,0,1-3.7-.79l-5.1,1.7A1,1,0,0,1,3.551,21.5l1.7-5.1A9.179,9.179,0,0,1,13.616,3.5Zm.474,2h-.474a7.17,7.17,0,0,0-6.4,10.379,1,1,0,0,1,.056.767L6.081,20.231l3.585-1.195a1,1,0,0,1,.767.056,7.094,7.094,0,0,0,3.183.758h.018a7.184,7.184,0,0,0,7.178-7.173v-.455A7.148,7.148,0,0,0,14.09,5.5Z"
                    transform="translate(-3.5 -3.5)"
                    fill="#fff"
                  />
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={10}
                  >
                    {unreadNewsCount}
                  </text>
                </svg>
              )}
            </Link>
          </li>
          <li className="nav-item dropdown px-3">
            <a
              className="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Product Lines
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              {productLineDropdown.map((element, index) => (
                <Link to={element.url} key={index} className="dropdown-item font-6">
                  {element.name}
                </Link>
              ))}
            </div>
          </li>

          <li className="nav-item dropdown px-3">
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

          <li className="nav-item px-3">
            <a
              className="nav-link"
              onClick={() => {
                navigate('/event/all')
              }}
            >
              Training
            </a>
          </li>
          <li className="nav-item px-3">
            <a className="nav-link">Data History</a>
          </li>
          <li className="nav-item px-3">
            <Link className="nav-link" to="/profile">
              Profile Setting
            </Link>
          </li>
          {getUserRoles() === 'Technical Administrator' ||
          getUserRoles() === 'PMK Administrator' ? (
            <li className="nav-item dropdown px-3">
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
              <NavDropdown data={navDropdownAdminData} icon={true} />
            </li>
          ) : (
            ''
          )}
          {!(
            getUserRoles() === 'Technical Administrator' || getUserRoles() === 'PMK Administrator'
          ) && (
            <li>
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          )}
        </ul>
        {isLogedIn && (
          <ul className="nav navbar-nav flex-row justify-content-md-center justify-content-start flex-nowrap">
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
          </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar
