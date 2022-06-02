import React, { useState } from 'react'
import API from '../../utils/api'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

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
          <div className="d-flex align-items-center input-field mx-auto">
            <span className="flex-fill">
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="input-field__password w-100"
                name="password"
                value={password}
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />
            </span>
            <i
              className={passwordVisible ? 'fa-eye fa-solid ' : 'fa-eye-slash fa-solid '}
              onClick={() => setPasswordVisible(!passwordVisible)}
            />
          </div>

          <div className="d-flex align-items-center input-field mx-auto">
            <span className="flex-fill">
              <input
                type={confirmVisible ? 'text' : 'password'}
                className="input-field__password w-100"
                name="confirm-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </span>
            <i
              className={confirmVisible ? 'fa-eye fa-solid' : 'fa-eye-slash fa-solid'}
              onClick={() => setConfirmVisible(!confirmVisible)}
            />
          </div>
          <div>
            <button
              ref={element => {
                if (element) {
                  element.style.setProperty('background-color', 'transparent', 'important')
                  element.style.setProperty('color', 'var(--bgColor2)', 'important')
                }
              }}
              onClick={e => {
                navigate('/')
              }}
              type="button"
              className="submit-btn px-4 me-2"
            >
              Cancel
            </button>
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
          </div>
        </form>
      </div>
    </>
  )
}

export default ChnagePassword
