import React from 'react'
import { useState, useEffect, useRef } from 'react'
import './style.css'

const Dropdown = ({ submenus, dropdown, depthLevel }) => {
  depthLevel = depthLevel + 1
  const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : ''
  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? 'show' : ''}`}>
      {submenus.map((submenu, index) => (
        <MenuItems items={submenu} key={index} depthLevel={depthLevel} />
      ))}
    </ul>
  )
}

const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false)

  let ref = useRef()

  useEffect(() => {
    console.log(items)
    const handler = event => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [dropdown])

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true)
  }

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false)
  }

  return (
    <li className="menu-items" ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {items.company_divisions ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? 'true' : 'false'}
            onClick={() => setDropdown(prev => !prev)}
          >
            {items.company_name}{' '}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown} />
        </>
      ) : (
        <a>{items.company_name}</a>
      )}
    </li>
  )
}

const CustomDropdown = ({ categories }) => {
  return (
    <div class="container">
      <div class="yk-sign-up-dropdn">
        <div class="row">
          <div class="dropdown">
            <div class="btn-group">
              <button class="btn btn-secondary btn-main btn-sm" type="button">
                Choose your Product line
              </button>
              <button
                type="button"
                class="btn btn-sm btn-secondary btn-arrow dropdown-toggle dropdown-toggle-split"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <ul class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                <li class="dropdown-submenu">
                  <a class="dropdown-item" tabIndex="-1" href="#">
                    RAMC <i class="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-item">
                      <a tabIndex="-1" href="#">
                        RAMC - all
                      </a>
                    </li>
                    <li class="dropdown-submenu">
                      <ul class="dropdown-menu">
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                        <li class="dropdown-submenu">
                          <a class="dropdown-item" href="#">
                            another level
                          </a>
                          <ul class="dropdown-menu">
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">RAMC01</a>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">RAMC02</a>
                    </li>
                  </ul>
                </li>

                <li class="dropdown-submenu">
                  <a class="dropdown-item" tabindex="-1" href="#">
                    RAMC <i class="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-item">
                      <a tabindex="-1" href="#">
                        Second level
                      </a>
                    </li>
                    <li class="dropdown-submenu">
                      <ul class="dropdown-menu">
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                        <li class="dropdown-submenu">
                          <a class="dropdown-item" href="#">
                            another level
                          </a>
                          <ul class="dropdown-menu">
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">Second level</a>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">Second level</a>
                    </li>
                  </ul>
                </li>

                <li class="dropdown-submenu">
                  <a class="dropdown-item" tabIndex="-1" href="#">
                    RAMC <i class="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-item">
                      <a tabIndex="-1" href="#">
                        Second level
                      </a>
                    </li>
                    <li class="dropdown-submenu">
                      <ul class="dropdown-menu">
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                        <li class="dropdown-submenu">
                          <a class="dropdown-item" href="#">
                            another level
                          </a>
                          <ul class="dropdown-menu">
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">Second level</a>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">Second level</a>
                    </li>
                  </ul>
                </li>

                <li class="dropdown-submenu">
                  <a class="dropdown-item" tabIndex="-1" href="#">
                    RAMC<i class="fa fa-chevron-right mt-1" aria-hidden="true"></i>
                  </a>
                  <ul class="dropdown-menu">
                    <li class="dropdown-item">
                      <a tabIndex="-1" href="#">
                        Second level
                      </a>
                    </li>
                    <li class="dropdown-submenu">
                      <ul class="dropdown-menu">
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                        <li class="dropdown-submenu">
                          <a class="dropdown-item" href="#">
                            another level
                          </a>
                          <ul class="dropdown-menu">
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                            <li class="dropdown-item">
                              <a href="#">4th level</a>
                            </li>
                          </ul>
                        </li>
                        <li class="dropdown-item">
                          <a href="#">3rd level</a>
                        </li>
                      </ul>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">Second level</a>
                    </li>
                    <li class="dropdown-item">
                      <a href="#">Second level</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomDropdown
