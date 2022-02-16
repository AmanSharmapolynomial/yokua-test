import React, { useState } from 'react'
import './style.css'

const Dropdown = ({ value, data }) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  return (
    <div className="role-dropdown">
      <div className="has-dropdown" onClick={() => setShowRoleDropdown(!showRoleDropdown)}>
        {value} <i className="fa-solid fa-sort-down " />
      </div>

      <div
        className="role-dropdown dropdown"
        style={{
          display: showRoleDropdown ? 'flex' : 'none',
        }}
      >
        {data.map(element => (
          <span className="dropdown-element">{element}</span>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
