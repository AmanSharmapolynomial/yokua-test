import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const Dropdown = ({ value, data, userData, addOrEditUser }) => {
  return (
    <div className="dropdown">
      <a
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style={{ width: '14px', height: '14px' }}
        className="dropdown-toggle"
      >
        {value}
      </a>

      <div className="dropdown-menu">
        {data.map((element, index) => (
          <span
            key={index}
            className="dropdown-item filter-item"
            onClick={() => {
              const payload = {
                email: userData.email,
                firstName: userData.first_name,
                lastName: userData.last_name,
                role: element,
              }
              addOrEditUser(payload)
            }}
          >
            {element}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
