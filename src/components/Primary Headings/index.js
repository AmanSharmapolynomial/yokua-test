import React from 'react'
import './style.css'

const PrimaryHeading = ({ heading, title }) => {
  return (
    <div className="heading-container">
      <h1
        style={{
          color: 'var(--textColor5)',
          border: '1px solid black',
          width: 'max-content',
          padding: '0.5rem 1rem',
          marginLeft: '2rem',
          fontSize: '1.5rem',
          marginBottom: '3rem',
          borderRadius: '4px',
        }}
      >
        {title ? title : 'Admin user view list'}
      </h1>
    </div>
  )
}

export default PrimaryHeading
