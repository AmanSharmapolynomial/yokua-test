import React from 'react'
import './style.css'
import { Link } from 'react-router-dom'

/**
 *
 * @param currentPage
 * @param previousPages
 * @returns {JSX.Element}
 * @constructor
 *
 * @description Required current Page Name in Plain String and PreviousPages as an Array of {link, name}
 */
const Breadcrumb = ({ currentPage, previousPages = [] }) => {
  return (
    <div className="row font-Noto Sans">
      <div className="col-6">
        <div className="mt-4 border-div">
          <div className="d-flex justify-content-start">
            <p className="my-auto small-font">Previous Page</p>
            <p className="my-auto mx-auto small-font">
              {previousPages.map((item, index) => (
                <>
                  <Link to={`${item.link}`} className={'link-color'}>
                    {`${item.name}`}
                  </Link>{' '}
                  &gt
                </>
              ))}
              {currentPage}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Breadcrumb
