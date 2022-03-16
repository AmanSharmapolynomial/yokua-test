import React, { useEffect, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { Link } from 'react-router-dom'
import './style.css'

const NavDropdown = ({ data, icon, renderDropdown }) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const closeDropdown = () => {
    setShowRoleDropdown(false)
  }

  const ref = useDetectClickOutside({ onTriggered: closeDropdown })

  useEffect(() => {
    setShowRoleDropdown(renderDropdown)
  }, [renderDropdown])

  return (
    <div className="role-dropdown" ref={ref}>
      <div
        className="role-dropdown dropdown"
        style={{
          display: showRoleDropdown ? 'flex' : 'none',
          lineHeight: '20px',
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
