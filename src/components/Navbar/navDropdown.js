import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const NavDropdown = ({ data, icon, renderDropdown }) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)

  useEffect(() => {
    setShowRoleDropdown(renderDropdown)
  }, [renderDropdown])

  return (
    <div className="role-dropdown">
      <div
        className="role-dropdown dropdown"
        style={{
          display: showRoleDropdown ? 'flex' : 'none',
        }}
      >
        {renderDropdown &&
          data.map((element, index) => (
            <Link to={element.url} key={index}>
              <span className="dropdown-element">{element.name}</span>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default NavDropdown
