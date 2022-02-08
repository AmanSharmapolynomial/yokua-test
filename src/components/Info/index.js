import React from 'react'
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
          <a href="#" className="register-link">
            register on the right.
          </a>
        </p>
      </div>
    </>
  )
}

export default InfoComponent
