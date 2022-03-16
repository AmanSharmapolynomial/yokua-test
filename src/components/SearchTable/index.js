import React, { useRef } from 'react'
import './style.css'

const SearchTable = () => {
  const searchListRef = useRef()
  return (
    <div className="user-list-search">
      <input
        ref={searchListRef}
        type="text"
        placeholder="Search Here..."
        className="search_list"
      ></input>
    </div>
  )
}

export default SearchTable
