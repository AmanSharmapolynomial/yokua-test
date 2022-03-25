import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../../utils/api'
import { useLocation, useParams } from 'react-router'

export default () => {
  const { state } = useLocation()
  const { uid, token } = useParams()
  console.log(uid, token)
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

  useEffect(() => {
    if (uid && token) {
      _verifyEmail()
    }
  }, [])

  const _verifyEmail = () => {
    API.post('auth/email-verify', {
      uid: uid,
      token: token,
    })
      .then(data => {
        navigate('/auth/login')
        toast.success(data.data?.message)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <div
      className="signIn-container mx-auto col-4 text-center"
      // style={{
      //   position: 'relative',
      //   width: '40rem',
      //   height: '12rem',
      //   maxWidth: '60rem',
      //   minWidth: '10rem',
      //   minHeight: '10rem',
      // }}
    >
      <div
        className="container-head "
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!uid ? (
          <>
            <div
              className="container__heading privacy-heading mb-3 h5"
              style={{
                fontWeight: 500,
              }}
            >
              Verification e-mail has been sent
            </div>
            <div className="container__heading  mb-3 h6">Please check your e-Mail</div>
            <a
              onClick={() => _resendVerificationEmail()}
              className="terms-link"
              style={{ fontSize: '18px', textDecorationLine: 'none' }}
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
          </>
        ) : (
          <>
            <h3 className="container__heading privacy-heading mb-4">
              Verification E-Mail has been sent
            </h3>
            <a
              onClick={() => navigate('/auth/login')}
              className="terms-link"
              style={{ fontSize: '18px' }}
            >
              Go to Login
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
          </>
        )}
      </div>
    </div>
  )
}
