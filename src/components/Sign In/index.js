import React, { useRef } from 'react'
import './style.css'

const SignIn = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Sign In with E-mail</h3>
        <form type="submit">
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
