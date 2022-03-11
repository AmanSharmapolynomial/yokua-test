import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import API from '../../utils/api'
// import './style.css'
import validator from 'validator'

const Forgot = () => {
  const emailRef = useRef()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const forgotApi = async email => {
    setIsLoading(true)

    if (validator.isEmail(email)) {
      const forgotPassPayload1 = {
        email,
      }
      const data = await API.post('/auth/password/reset/', forgotPassPayload1)
      toast.success(data.data.detail)
      setIsLoading(false)
      navigate('/auth/login')
    } else {
      toast.error('Email is not in proper format - abc@xyz.com')
    }
  }

  return (
    <>
      <div className="signIn-container">
        <div className="container-head">
          <i
            className="fa-solid fa-arrow-left back-arrow-btn"
            onClick={() => {
              navigate('/auth/login')
            }}
          />
          <h3 className="container__heading">Forgot Your Password?</h3>
        </div>
        <form
          type="submit"
          onSubmit={e => {
            e.preventDefault()
            forgotApi(emailRef.current?.value)
          }}
        >
          <input
            type="text"
            className="input-field input-field__email"
            name="email"
            ref={emailRef}
            placeholder="E-Mail"
          />

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Send Link'}
          </button>
        </form>
      </div>
    </>
  )
}

export default Forgot
