import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { getUserRoles } from '../../utils/token'
import NavDropdown from './navDropdown'
import { removeToken, removeUserRole } from '../../utils/token'
import { toast } from 'react-toastify'
import './style.css'
import API from '../../utils/api'

const OffCanvasDropDownItems = props => {
  const navigate = useNavigate()
  const isRyg = props.isRyg
  return (
    <div
      className="collapse navbar-collapse justify-content-between align-items-center"
      id={props.id}
    >
      {props.isLogedIn && (
        <form
          className="w-100 pt-3 d-block d-md-none"
          onSubmit={e => {
            e.preventDefault()
            navigate(`/search/${e.target.search.value}`)
          }}
        >
          <div className="input-group search px-3">
            <span className="input-group-addon">
              <i className="fa-solid fa-magnifying-glass" style={{ color: 'black' }} />
            </span>
            <input
              name="search"
              type="text"
              placeholder="What are you looking for?"
              className="search_input ms-3"
              autoComplete="false"
            />
          </div>
        </form>
      )}
      <div
        className="icon-container w-auto h-auto mt-3 d-flex align-items-center px-2"
        onClick={() => {
          try {
            props.onBack()
          } catch (error) {}
        }}
      >
        <i className="fa-solid fa-angle-left col-auto p-0" />
        <div className="col">Menu</div>
      </div>
      <div className="px-2">
        <hr></hr>
      </div>
      <div className="px-2">
        <div className="theme">{props?.header}</div>
        {props.items.map((element, index) =>
          isRyg ? (
            <div
              role={'button'}
              onClick={() => {
                if (element?.event) navigate('/event/all')
                else navigate('/ryg-information/details', { state: element })
              }}
              key={index}
              className="dropdown-item font-6"
            >
              {element.page_title}
            </div>
          ) : (
            <Link to={element.url} key={index} className="dropdown-item font-6 px-2">
              {element.name}
            </Link>
          )
        )}
      </div>
    </div>
  )
}
export default OffCanvasDropDownItems
