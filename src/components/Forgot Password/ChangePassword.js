import React, { useRef, useState } from 'react'
import API from '../../utils/api'
// import './style.css'

const ChnagePassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const _resetPassword = () => {
    if (password && password.length > 8 && password.includes())
      API.post('auth/password/change/', {
        new_password1: password,
        new_password2: confirmPassword,
      })
        .then(data => {
          console.log(data)
        })
        .catch(error => {
          console.log(error)
        })
  }

  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading mt-4">Change Your Password?</h3>
        <form
          type="submit"
          style={{
            position: 'relative',
          }}
        >
          <input
            type={passwordVisible ? 'text' : 'password'}
            className="input-field input-field__password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <i
            className={passwordVisible ? 'fa-eye fa-solid ' : 'fa-eye-slash fa-solid '}
            style={{
              position: 'absolute',
              left: '250px',
              top: '12px',
            }}
            onClick={() => setPasswordVisible(!passwordVisible)}
          ></i>

          <input
            type={confirmVisible ? 'text' : 'password'}
            className="input-field input-field__password"
            name="confirm-password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />

          <i
            className={confirmVisible ? 'fa-eye fa-solid first' : 'fa-eye-slash fa-solid first'}
            onClick={() => setConfirmVisible(!confirmVisible)}
          ></i>

          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  )
}

export default ChnagePassword
