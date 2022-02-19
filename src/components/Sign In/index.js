import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Navigate } from 'react-router'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './style.css'

const SignIn = () => {
  // states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // navigate
  const navigate = useNavigate()

  // fetch state
  const userDetails = useStoreState(state => state.userDetails)

  // actions import
  const fetchLogin = useStoreActions(actions => actions.fetchLogin)

  // fill data from form
  const loginDetails = {
    email: email,
    password: password,
  }

  let location = useLocation()

  // use actions
  const login = e => {
    e.preventDefault()
    if (loginDetails.email && loginDetails.password) {
      fetchLogin(loginDetails)
    }
  }

  if (userDetails[0]?.data) {
    navigate(location.state?.from?.pathname)
  }

  const alertRef = useRef()
  if (userDetails[0]?.error) {
    alertRef.current.style.display = 'block'

    setTimeout(() => {
      alertRef.current.style.display = 'none'
    }, 3000)
  }

  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Sign In with E-mail</h3>
        <form type="submit" onSubmit={login}>
          <input
            type="email"
            onChange={e => setEmail(e.target.value)}
            className="input-field input-field__email"
            placeholder="Email"
          />

          <input
            type="text"
            onChange={e => setPassword(e.target.value)}
            className="input-field input-field__password"
            placeholder="Password"
          />
          <span className="alert-under-input" ref={alertRef} style={{ display: 'none' }}>
            Incorrect Password
          </span>
          <button type="submit" className="submit-btn">
            Sign In
          </button>
          <Link to="/auth/forgot" className="forgot-link">
            Forgot your password?
          </Link>
        </form>
      </div>
    </>
  )
}

export default SignIn
