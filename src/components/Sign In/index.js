import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Navigate } from 'react-router'
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
        navigate('/admin/user/list-view')
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
        <h3 className="container__heading">Sign In with E-mail</h3>
        <form type="submit" onSubmit={SignIn}>
          <input
            type="email"
            name="email"
            onChange={e => setEmail(e.target.value)}
            className="input-field input-field__email"
            placeholder="Email"
          />

          <input
            name="password"
            type="password"
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
