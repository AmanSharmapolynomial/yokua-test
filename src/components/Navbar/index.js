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
  const [productList, setProductList] = useState([])

  const navDropdownAdminData = [
    { name: 'User Management', url: '/admin/user/list-view' },
    { name: 'Event Management', url: '/admin/event' },
  ]

  const productLineDropdown = [
    { name: 'Approved Tokuchus', url: '/admin/approved-tokuchus' },
    { name: 'Product Lines', url: '/product-lines' },
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

  const getProductList = () => {
    API.get('/ryg_info/list_view')
      .then(res => {
        if (res.status === 200 && res.data !== undefined) {
          setProductList(res.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getUnreadNewsCount()
    productList.length === 0 && getProductList()
  }, [])

  return (
    <nav className="navbar navbar-expand-md justify-content-center px-0">
      <div
        className="collapse navbar-collapse justify-content-between align-items-center"
        id="navbar"
      >
        {isLogedIn && (
          <form
            className="w-100 pt-3 d-block d-md-none"
            onSubmit={e => {
              e.preventDefault()
              navigate(`/search/${e.target.search.value}`)
            }}
          >
            <div className="input-group search px-3">
              <span className="input-group-addon">
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'black' }} />
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
        <ul className="navbar-nav mx-auto text-md-center text-left p-3 p-md-0">
          <li className="nav-item px-xl-3">
            <Link className="nav-link" to={'/home'}>
              Home
            </Link>
          </li>
          <li className="nav-item px-xl-3">
            <Link className="nav-link" to="/news">
              News
              {unreadNewsCount !== 0 && (
                <svg
                  className="ms-2"
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
          <li className="nav-item dropdown px-xl-3">
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

          <li className="nav-item dropdown px-xl-3 btn-group">
            <Link
              className="nav-link pe-1"
              // id="navbarDropdown"
              // role="button"
              // data-toggle="dropdown"
              // aria-haspopup="true"
              // aria-expanded="false"
              to={'/ryg-information'}
            >
              RYG Information
            </Link>
            <div
              role={'button'}
              type="button"
              className="dropdown-toggle dropdown-toggle-split ps-1"
              data-toggle="dropdown"
              aria-expanded="false"
              aria-haspopup="true"
              style={{
                display: 'flex',
                color: 'white',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span className="sr-only">Toggle Dropdown</span>
            </div>
            {productList.length > 0 && (
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {productList.map((element, index) => (
                  <div
                    role={'button'}
                    onClick={() => {
                      if (element?.event) navigate('/event/all')
                      else navigate('/ryg-information/details', { state: element })
                    }}
                    key={index}
                    className="dropdown-item font-6"
                  >
                    {element.page_title}
                  </div>
                ))}
              </div>
            )}
          </li>

          <li className="nav-item px-xl-3">
            <a
              className="nav-link"
              onClick={() => {
                navigate('/event/details')
              }}
            >
              Training Material
            </a>
          </li>
          <li className="nav-item px-xl-3">
            <a className="nav-link">Archive</a>
          </li>
          <li className="nav-item px-xl-3">
            <Link className="nav-link" to="/profile">
              Profile Settings
            </Link>
          </li>
          <li className="nav-item px-xl-3">
            <Link className="nav-link" to="/contact">
              Contact
            </Link>
          </li>
          {getUserRoles() === 'Technical Administrator' ||
          getUserRoles() === 'PMK Administrator' ? (
            <li className="nav-item dropdown px-xl-3 d-none d-md-block">
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
          {isLogedIn && (
            <li className="nav-item px-xl-3 d-block d-md-none">
              <span
                className="nav-link"
                onClick={() => {
                  toast.success('Log out successfully')
                  removeToken()
                  removeUserRole()
                  navigate('/auth/login')
                }}
              >
                Log out
              </span>
            </li>
          )}
        </ul>
        {isLogedIn && (
          <ul className="nav navbar-nav flex-row justify-content-md-center justify-content-start flex-nowrap d-none d-md-block">
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
