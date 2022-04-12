import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const Dropdown = ({ value, data, userData, addOrEditUser }) => {
  return (
    <div className="dropdown">
      <div
        className="d-flex justify-content-between pr-3"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        data-display="static"
        aria-hidden="true"
      >
        <a>{value}</a>
        <i className="fa fa-caret-down ml-2" aria-hidden="true"></i>
      </div>
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
