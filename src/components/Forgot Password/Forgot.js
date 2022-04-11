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
  console.log(isLoading)
  const forgotApi = async email => {
    setIsLoading(prevState => true)
    if (validator.isEmail(email)) {
      const forgotPassPayload1 = {
        email,
      }
      try {
        const data = await API.post('/auth/reset-password-token-gen', forgotPassPayload1)
        setIsLoading(prevState => false)
        toast.success(data.data.detail)
        navigate('/auth/reset-password', { state: email })
      } catch (error) {
        setIsLoading(prevState => false)
      }
    } else {
      setIsLoading(prevState => false)
      toast.error('Email is not in proper format - abc@xyz.com')
    }
  }

  return (
    <>
      <div className="signIn-container mx-auto col-10 col-md-4">
        <div className="container-head">
          <span className="position-absolute float-left">
            <i
              className="fa-solid fa-arrow-left back-arrow-btn mr-2"
              onClick={() => {
                navigate('/auth/login')
              }}
            />
          </span>
          <div className="container__heading text-center">Forgot Your Password?</div>
        </div>
        <form
          className="mt-2"
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

          <button type="submit" className="submit-btn px-4" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Send Link'}
          </button>
        </form>
      </div>
    </>
  )
}

export default Forgot
