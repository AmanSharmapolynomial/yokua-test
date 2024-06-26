import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const NavDropdown = ({ data }) => {
  return (
    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
      {data.map((element, index) => (
        <Link to={element.url} key={index} className="dropdown-item font-6">
          {element.name}
        </Link>
      ))}
    </div>
  )
}

export default NavDropdown
