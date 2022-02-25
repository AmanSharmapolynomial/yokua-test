import React from 'react'
import { useNavigate } from 'react-router'
import './style.css'

const TermsPolicy = () => {
  const navigate = useNavigate()
  return (
    <div className="signIn-container terms-privacy-container">
      <div className="container-head ">
        <h3 className="container__heading privacy-heading">Term of service and privacy policies</h3>
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => {
            navigate('/auth/login')
          }}
        />
      </div>
    </div>
  )
}

export default TermsPolicy
