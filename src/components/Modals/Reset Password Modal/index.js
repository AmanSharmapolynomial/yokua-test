import React, { useEffect } from 'react'
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
    const data = await API.post('/auth/reset-password-token-gen', forgotPassPayload1)
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
          <div className="container__heading privacy-heading mb-3 clamp-2v">
            Reset password link has been sent
          </div>
          <div className="container__heading mb-3 h6 clamp-1v">Please check your e-mail</div>
          <a
            onClick={() => _resendPasswordLink()}
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
              color: '#CD2727',
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
