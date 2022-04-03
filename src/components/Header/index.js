import { useStoreState } from 'easy-peasy'
import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import './style.css'
import Yokogawa from '../../assets/Yokogawa png.png'
const Header = ({ isLogedIn, isAdmin }) => {
  return (
    <header className="header sticky-top mb-auto">
      <div className="row mx-2 mx-md-5 h-100">
        <div className="col">
          <div className="row header-container py-2">
            <div className="header__logo col-12 col-md-4">
              <img src={Yokogawa} alt="logo" />
            </div>
            <div className="header__title col-12 col-md-4 mr-md-auto text-center my-2 my-md-0">
              FLOW CENTER PAGES
            </div>
            <div className="col-4 d-none d-md-block">
              <div className="input-group search float-right px-3">
                <span className="input-group-addon">
                  <i className="fa-solid fa-magnifying-glass" style={{ color: 'white' }} />
                </span>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="search_input ml-3"
                  autoComplete={false}
                ></input>
              </div>
            </div>
          </div>
          {isLogedIn && (
            <div className="row">
              <div className="col">
                <Navbar isAdmin={isAdmin} isLogedIn={isLogedIn} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
