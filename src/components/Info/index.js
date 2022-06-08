import React from 'react'
import { Link } from 'react-router-dom'
import './style.css'

const InfoComponent = () => {
  return (
    <div className="info-container mx-auto my-5 col-10 col-lg-6 order-12 order-lg-1 py-3">
      <p className="info__text">
        Our Flow Center Pages are designed for Yokogawa Employees and Yokogawa Representative. It
        contains up-to-date information for pre- and after sales support.
      </p>
      <p className="info__text">To access our Flow Center Pages, please sign in.</p>

      <p className="info__text">
        If you do not have an account yet, please <br />
        <Link to="/auth/register" className="register-link">
          Click here to register.
        </Link>
      </p>
    </div>
  )
}

export default InfoComponent
