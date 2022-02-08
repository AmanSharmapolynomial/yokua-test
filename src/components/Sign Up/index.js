import React, { useRef } from 'react'
import './style.css'

const SignUp = () => {
  const firstNameRef = useRef()
  const lastNameRef = useRef()
  const companyEmailRef = useRef()
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  const companyRef = useRef()
  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Create a New Account</h3>
        <form type="submit">
          <input
            type="text"
            className="input-field input-field__email"
            name="first-name"
            ref={firstNameRef}
            placeholder="First Name"
          />
          <input
            type="text"
            className="input-field input-field__password"
            name="last-name"
            ref={lastNameRef}
            placeholder="Last Name"
          />
          <input
            type="text"
            className="input-field input-field__email"
            name="company-email"
            ref={companyEmailRef}
            placeholder="Company Email"
          />
          <input
            type="text"
            className="input-field input-field__password"
            name="password"
            ref={passwordRef}
            placeholder="Password"
          />
          <input
            type="text"
            className="input-field input-field__password"
            name="confirm-password"
            ref={confirmPasswordRef}
            placeholder="Confirm Password"
          />
          <input
            type="text"
            className="input-field input-field__email"
            name="company"
            ref={companyRef}
            placeholder="Company(representative of yokogawa)"
          />
          <div className="checkbox">
            <input type="checkbox" id="checkTermandCondtions" />
            <span className="checkbox-text">Accept the term and conditions</span>
          </div>

          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
        <div className="terms">
          By signing up, you agree with the
          <a href="#" className="terms-link">
            Terms of Service and Privacy Policy
          </a>
        </div>
      </div>
    </>
  )
}

export default SignUp
