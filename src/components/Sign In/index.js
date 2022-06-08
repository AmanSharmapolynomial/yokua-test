import { useStoreActions } from 'easy-peasy'
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import './style.css'
import { login } from './../../services/auth.service'
import { toast } from 'react-toastify'
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

  // use actions
  const SignIn = async e => {
    setLoading(true)
    e.preventDefault()
    if (loginDetails.email && loginDetails.password) {
      const logindata = await login(loginDetails)
      if (logindata) {
        setUser(logindata)
        toast.success('Login Successful')
        navigate('/home')
      }
    }
    setLoading(false)
  }

  const alertRef = useRef()

  return (
    <div className="signIn-container mx-auto my-5 col-10 col-lg-6 order-1 order-lg-12">
      <h3 className="container__heading mt-4">Sign in with E-mail</h3>
      <form className="col" type="submit" onSubmit={SignIn}>
        <div className="row d-flex justify-content-center px-3 px-lg-5">
          <input
            type="email"
            required={true}
            onChange={e => setEmail(e.target.value)}
            className="input-field input-field__email"
            placeholder="E-Mail"
          />
          <div className="d-flex align-items-center input-field mx-auto">
            <span className="flex-fill">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="Password"
                className="input-field__password w-100"
                onChange={e => setPassword(e.target.value)}
                required={true}
                placeholder="Password"
              />
            </span>
            <span>
              <i
                className={passwordVisible ? 'fa-eye fa-solid' : 'fa-eye-slash fa-solid'}
                onClick={() => setPasswordVisible(!passwordVisible)}
              />
            </span>
          </div>
          <span className="alert-under-input" ref={alertRef} style={{ display: 'none' }}>
            Incorrect Password
          </span>
          <div className="col">
            <div className="col-12 justify-content-center d-flex">
              <button type="submit" className="submit-btn px-4" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Sign in'}
              </button>
            </div>
            <div className="col-12 justify-content-center d-flex">
              <Link to="/auth/forgot-password" className="forgot-link">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignIn
