import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useRef } from 'react'
import './style.css'

const SignIn = () => {
  // refs
  const emailRef = useRef()
  const passwordRef = useRef()

  // fetch state
  const userDetails = useStoreState(state => state.userDetails)
  console.log(userDetails)

  // actions import
  const fetchLogin = useStoreActions(actions => actions.fetchLogin)

  // fill data from form
  const loginDetails = {
    email: 'admin@email.com',
    password: 'Password.01',
  }

  // use actions
  const login = e => {
    e.preventDefault()
    fetchLogin(loginDetails)
  }

  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Sign In with E-mail</h3>
        <form type="submit" onSubmit={login}>
          <input
            type="text"
            className="input-field input-field__email"
            name="email"
            ref={emailRef}
            placeholder="Email"
          />
          <input
            type="text"
            className="input-field input-field__password"
            name="password"
            ref={passwordRef}
            placeholder="Password"
          />

          <button type="submit" className="submit-btn">
            Sign In
          </button>
          <a href="#" className="forgot-link">
            Forgot your password?
          </a>
        </form>
      </div>
    </>
  )
}

export default SignIn
