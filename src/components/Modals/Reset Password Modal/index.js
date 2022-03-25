import React, { useRef, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import API from '../../../utils/api'

const ResetPasswordModal = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  useEffect(() => {}, [])
  const _resendPasswordLink = async () => {
    const forgotPassPayload1 = {
      email: state,
    }
    const data = await API.post('/auth/password/reset/', forgotPassPayload1)
    toast.success(data.data.detail)
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
        <>
          <div
            className="container__heading privacy-heading mb-3 h5"
            style={{
              fontWeight: 500,
            }}
          >
            Reset password link has been sent
          </div>
          <div className="container__heading  mb-3 h6">Please check your e-mail</div>
          <a
            onClick={() => _resendPasswordLink()}
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
      </div>
    </div>
  )
}

export default ResetPasswordModal
