import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './style.css'

const SignUp = () => {
  // navigate
  const navigate = useNavigate()

  // fetch state
  const userDetails = useStoreState(state => state.userDetails)
  const config = {
    Authorization: `Bearer ${userDetails[0]?.data?.access_token}`,
  }

  // states
  const [companyEmail, setCompanyEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState('')

  // actions import
  const fetchRegister = useStoreActions(actions => actions.fetchRegister)

  // fill data from form
  const registerDetails = {
    first_name: firstName,
    last_name: lastName,
    email: companyEmail,
    password1: password,
    password2: confirmPassword,
  }

  // use actions
  const register = e => {
    e.preventDefault()
    if (password.includes('.') && password.length > 8 && password == confirmPassword) {
      fetchRegister(registerDetails, config)
    } else {
      console.log('error in password')
    }
  }

  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Create a New Account</h3>
        <form type="submit" onSubmit={register}>
          <input
            type="text"
            required={true}
            onChange={e => setFirstName(e.target.value)}
            className="input-field input-field__email"
            placeholder="First Name"
          />
          <input
            type="text"
            className="input-field input-field__password"
            onChange={e => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            required={true}
            className="input-field input-field__email"
            onChange={e => setCompanyEmail(e.target.value)}
            placeholder="Company Email"
          />
          <input
            type="password"
            className="input-field input-field__password"
            onChange={e => setPassword(e.target.value)}
            required={true}
            placeholder="Password"
          />
          <input
            type="password"
            className="input-field input-field__password"
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
          <input
            type="text"
            className="input-field input-field__email"
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
