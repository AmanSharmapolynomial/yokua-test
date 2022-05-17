import React from 'react'
import './style.css'

const PrimaryHeading = ({ heading, title, backgroundImage }) => {
  return (
    <div className={`heading-container ${backgroundImage ? backgroundImage : ''} d-none d-md-flex`}>
      <h1
        style={{
          color: 'var(--textColor5)',
          border: '1px solid black',
          width: 'max-content',
          padding: '0.5rem 1rem',
          marginLeft: '2rem',
          fontSize: '1.0rem',
          marginBottom: '3rem',
          borderRadius: '4px',
          backgroundColor: '#004F9B',
        }}
      >
        {title ? title : 'Admin user view list'}
      </h1>
    </div>
  )
}

export default PrimaryHeading
