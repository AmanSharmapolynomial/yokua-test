import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import API from '../../../utils/api'
import { useLocation, useParams } from 'react-router'

export default () => {
  const { state } = useLocation()
  const { uid, token } = useParams()
  const [email, setEmail] = useState(state)
  const navigate = useNavigate()

  const _resendVerificationEmail = () => {
    API.post('auth/resend_email_verification/', { email: email })
      .then(data => {
        toast.success('E-mail has been sent successfully')
      })
      .catch(error => {
        toast.error('E-mail could not be sent. Please contact the Admin.')
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
    <div className="signIn-container mx-auto col-4 text-center">
      <div
        className="container-head "
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!uid ? (
          <>
            <div className="container__heading privacy-heading mb-3 clamp-2v">
              Verification E-mail has been sent
            </div>
            <div className="container__heading  mb-3 h6 clamp-1v">Please check your E-mail</div>
            <a
              onClick={() => _resendVerificationEmail()}
              className="terms-link clamp-1v"
              style={{ textDecorationLine: 'none' }}
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
            <h3 className="container__heading privacy-heading mb-4 clamp-2v">
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
