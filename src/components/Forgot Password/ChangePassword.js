import React, { useRef, useState } from 'react'
import API from '../../utils/api'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

// import './style.css'

const ChnagePassword = () => {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)

  const _resetPassword = () => {
    if (password && password.length > 8 && password.includes())
      API.post('auth/password-change/', {
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

  const _resetPasswordUsingUidandToken = () => {
    if (password != confirmPassword) {
      toast.error('Password and Confirm Password should be matched')
      return
    }
    if (password && password.length > 8) {
      if (uid && token) {
        API.post('auth/reset-password-verify', {
          uid: uid,
          token: token,
          new_password1: password,
          new_password2: confirmPassword,
        })
          .then(data => {
            navigate('/auth/login')
            toast.success(data.data?.message)
          })
          .catch(error => {
            console.log(error)
          })
      }
    } else {
      toast.error('Password must be 8 characters')
    }
  }

  return (
    <>
      <div className="signIn-container mx-auto col-10 col-md-4 my-5">
        <h3 className="container__heading mt-4">Change Your Password?</h3>
        <form
          style={{
            position: 'relative',
          }}
        >
          <div className="row align-items-center input-field mx-auto">
            <input
              type={passwordVisible ? 'text' : 'password'}
              className="input-field__password flex-fill"
              name="password"
              value={password}
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
            <i
              className={passwordVisible ? 'fa-eye fa-solid ' : 'fa-eye-slash fa-solid '}
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>

          <div className="row align-items-center input-field mx-auto">
            <input
              type={confirmVisible ? 'text' : 'password'}
              className="input-field__password flex-fill"
              name="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <i
              className={confirmVisible ? 'fa-eye fa-solid' : 'fa-eye-slash fa-solid'}
              onClick={() => setConfirmVisible(!confirmVisible)}
            />
          </div>
          <button
            onClick={e => {
              if (uid && token) {
                _resetPasswordUsingUidandToken(e)
              } else {
                _resetPassword(e)
              }
            }}
            type="button"
            className="submit-btn px-4"
          >
            Save
          </button>
        </form>
      </div>
    </>
  )
}

export default ChnagePassword
