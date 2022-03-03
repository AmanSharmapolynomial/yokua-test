import React from 'react'
import './style.css'

const PrimaryHeading = ({ heading, title }) => {
  return (
    <div className="heading-container">
      <h1
        style={{
          color: 'var(--textColor5)',
        }}
      >
        {title ? title : 'Admin user view list'}
      </h1>
    </div>
  )
}

export default PrimaryHeading
