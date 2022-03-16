import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../../utils/api'
import { useLocation } from 'react-router'

export default () => {
  const { state } = useLocation()
  const [email, setEmail] = useState(state)
  const navigate = useNavigate()

  const _resendVerificationEmail = () => {
    API.post('auth/resend_email_verification/', { email: email })
      .then(data => {
        toast.success('Mail Sent Successfully')
      })
      .catch(error => {
        toast.error("Can't send email please contact Admin")
      })
  }

  return (
    <>
      <div
        className="signIn-container "
        style={{
          position: 'relative',
          width: '40rem',
          height: '12rem',
          maxWidth: '60rem',
          minWidth: '10rem',
          minHeight: '10rem',
        }}
      >
        <div
          className="container-head "
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 className="container__heading privacy-heading mb-4">
            Verification E-Mail has been sent
          </h3>
          <h6 className="container__heading  mb-3">Please check your E-Mail</h6>
          <a
            onClick={() => _resendVerificationEmail()}
            className="terms-link"
            style={{ fontSize: '18px' }}
          >
            Resend Link
          </a>
          <i
            className="fa-solid fa-circle-xmark"
            style={{
              position: 'absolute',
              top: 20,
              right: 10,
            }}
            onClick={() => {
              navigate('/auth/login')
            }}
          />
        </div>
      </div>
    </>
  )
}
