import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const Dropdown = ({ value, data, userData, addOrEditUser }) => {
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
        {data.map((element, index) => (
          <span
            key={index}
            className="dropdown-element"
            onClick={() => {
              const payload = {
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                role: element,
              }
              addOrEditUser(payload)
              setShowRoleDropdown(false)
            }}
          >
            {showRoleDropdown ? element : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
