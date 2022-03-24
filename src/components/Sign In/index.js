import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Navigate } from 'react-router'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './style.css'
import { login } from './../../services/auth.service'
import { toast } from 'react-toastify'
import { getToken } from '../../utils/token'
const SignIn = () => {
  // states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)

  // navigate
  const navigate = useNavigate()

  // actions import
  const setUser = useStoreActions(actions => actions.setUser)

  // fill data from form
  const loginDetails = {
    email: email,
    password: password,
  }

  let location = useLocation()

  // use actions
  const SignIn = async e => {
    setLoading(true)
    e.preventDefault()
    if (loginDetails.email && loginDetails.password) {
      const logindata = await login(loginDetails)
      console.log(logindata)
      if (logindata) {
        setUser(logindata)
        toast.success('Login Successful')
        navigate('/profile')
      }
    }
    setLoading(false)
  }

  // if (userDetails[0]?.data) {
  //   navigate(location.state?.from?.pathname)
  // }

  const alertRef = useRef()
  // if (userDetails[0]?.error) {
  //   alertRef.current.style.display = 'block'

  //   setTimeout(() => {
  //     alertRef.current.style.display = 'none'
  //   }, 3000)
  // }

  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading mt-4">Sign In with E-mail</h3>
        <form className="forum" type="submit" onSubmit={SignIn}>
          <input
            type="email"
            required={true}
            onChange={e => setEmail(e.target.value)}
            className="input-field input-field__email"
            placeholder="E-Mail"
          />

          <input
            type={passwordVisible ? 'text' : 'password'}
            name="Password"
            className="input-field input-field__password"
            onChange={e => setPassword(e.target.value)}
            required={true}
            placeholder="Password"
          />

          <i
            className={passwordVisible ? 'fa-eye fa-solid first' : 'fa-eye-slash fa-solid first'}
            onClick={() => setPasswordVisible(!passwordVisible)}
          ></i>

          <span className="alert-under-input" ref={alertRef} style={{ display: 'none' }}>
            Incorrect Password
          </span>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
          <Link to="/auth/forgot-password" className="forgot-link">
            Forgot your password?
          </Link>
        </form>
      </div>
    </>
  )
}

export default SignIn
