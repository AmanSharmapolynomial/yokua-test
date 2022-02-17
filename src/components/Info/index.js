import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const InfoComponent = () => {
  return (
    <>
      <div className="info-container">
        <p className="info__text">
          Our Flow Center Page are designed for Yokogawa Employees and Yokogawa Representative. It
          contains up-to-date information for pre- and after sales support.
        </p>
        <p className="info__text">To access our Flow Center Pages, please sign in.</p>

        <p className="info__text">
          If you do not have an account yet, please <br />
          <Link to="/auth/register" className="register-link">
            register on the right.
          </Link>
        </p>
      </div>
    </>
  )
}

export default InfoComponent
