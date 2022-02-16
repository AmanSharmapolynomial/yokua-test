import React, { useRef } from 'react'
import './style.css'

const Navbar = () => {
  const searchNavRef = useRef()
  return (
    <>
      <div className="nav">
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>News</a>
          </li>
          <li className="border-left border-right">
            <a>Product Lines</a>
            <i class="fa-solid fa-caret-down " />
          </li>

          <li className="border-right">
            <a>RYG Information</a>
            <i className="fa-solid fa-caret-down " />
          </li>

          <li>
            <a>Training</a>
          </li>
          <li>
            <a>Data History</a>
          </li>
          <li>
            <a>Contact</a>
          </li>
          <li className="border-left border-right">
            <a>Admin Management</a>
            <i class="fa-solid fa-caret-down " />
          </li>
        </ul>
        <div className="searchBar">
          <i class="fa-solid fa-magnifying-glass" />
          <input
            ref={searchNavRef}
            type="text"
            placeholder="What are you lookin for?"
            className="search_input"
          ></input>
        </div>
      </div>
    </>
  )
}

export default Navbar
