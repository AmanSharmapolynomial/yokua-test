import React, { useEffect, useState } from 'react'
import { useDetectClickOutside } from 'react-detect-click-outside'
import { Link } from 'react-router-dom'
import './style.css'

const NavDropdown = ({ data }) => {
  return (
    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
      {data.map((element, index) => (
        <Link to={element.url} key={index} className="dropdown-item">
          {element.name}
        </Link>
      ))}
    </div>
  )
}

export default NavDropdown
