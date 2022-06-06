import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './style.css'
import { registerUser } from './../../services/auth.service'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import CustomDropdown from './CustomDropdown'

import API from '../../utils/api'

import validator from 'validator'

const SignUp = () => {
  // navigate
  const navigate = useNavigate()

  const [category, setCategory] = useState([])
  const [topicName, setTopicName] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Company')

  // states
  const [companyEmail, setCompanyEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [company, setCompany] = useState(0)

  const [actionLabel, setActionLabel] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)

  const alertRef = useRef()
  const tncRef = useRef()

  useEffect(() => {
    getCompanyList()
  }, [])

  const registerDetails = {
    first_name: firstName,
    last_name: lastName,
    email: companyEmail,
    password1: password,
    password2: confirmPassword,
    company_name: company,
  }

  const getCompanyList = () => {
    API.get('auth/view_company').then(data => {
      setCategory(data.data)
    })
  }
  // use actions

  const handleSelectTopic = cat => {
    setCompany(cat)
    setSelectedTopic(cat)
  }

  const register = async e => {
    e.preventDefault()
    if (selectedTopic.length < 2 || selectedTopic.toLowerCase() == 'company') {
      toast.error('Please select the company')
      return
    }
    if (tncRef.current.checked) {
      if (validator.isEmail(companyEmail)) {
        if (!validator.isEmpty(firstName) && !validator.isEmpty(lastName)) {
          if (password.length < 8) {
            setActionLabel('Password must contain 8-16 characters, one special and numeric value')
            setTimeout(() => {
              alertRef.current.style.display = 'none'
            }, 3000)
            alertRef.current.style.display = 'block'
          } else {
            if (password != confirmPassword) {
              toast.error('Password and Confirm Password should be same')
            } else {
              registerUser(registerDetails).then(a => {
                if (a.status == 200) {
                  navigate('/auth/verification-email', { state: companyEmail })
                }
              })
              setLoading(false)
            }
          }
        } else {
          toast.error(
            'First name and last name should be at least 5 letters and must not contain any special characters'
          )
        }
      } else {
        toast.error('Please enter a valid E-Mail e.g. abc@xyz.com')
      }
    } else {
      toast.error('Please accept terms and conditions to proceed')
    }
  }

  const getSelectedCompany = name => {
    handleSelectTopic(name)
  }

  return (
    <div className="signIn-container mx-auto col-10 col-md-4 my-5">
      <div className="container-head px-2">
        <span className="position-absolute float-left">
          <i
            className="fa-solid fa-arrow-left back-arrow-btn"
            onClick={() => {
              navigate('/auth/login')
            }}
          />
        </span>
        <div className="container__heading text-center">Create a new account</div>
      </div>
      <form className="forum mt-2" type="submit" onSubmit={register}>
        <div className="col">
          <input
            type="text"
            required={true}
            onChange={e => setFirstName(e.target.value)}
            className="input-field"
            placeholder="First Name"
          />
          <input
            type="text"
            required={true}
            className="input-field input-field__password w-100"
            onChange={e => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            name="Email"
            required={true}
            style={{
              textTransform: 'lowercase',
            }}
            className="input-field input-field__email"
            onChange={e => setCompanyEmail(e.target.value)}
            placeholder="Company E-Mail"
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
          <div className="d-flex align-items-center input-field mx-auto">
            <span className="flex-fill">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                required={true}
                className="input-field__password w-100"
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
            </span>
            <span>
              <i
                className={confirmPasswordVisible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'}
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              />
            </span>
          </div>
          <span className="alert-under-input" ref={alertRef} style={{ display: 'none' }}>
            {actionLabel}
          </span>
          <CustomDropdown
            categories={category}
            getCompanyList={getCompanyList}
            getSelectedCompany={getSelectedCompany}
            setTopicName={setTopicName}
            key={'registration'}
          />
          <div className="col-12 p-0 mt-2">
            <div className="form-group d-flex">
              <input
                type="checkbox"
                id="checkTermandCondtions"
                ref={tncRef}
                className="w-auto my-auto"
              />
              <span className="checkbox-text me-auto ms-2">
                Accept the Terms of Service and Privacy Policies
              </span>
            </div>
          </div>

          <div className="col">
            <div className="col-12 justify-content-center d-flex">
              <button type="submit" className="submit-btn px-4" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Register'}{' '}
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="col terms">
        {'By signing up, you agree with the '}
        <Link to="/auth/terms-privacy" className="terms-link" target="_blank">
          Terms of Service and Privacy Policies
        </Link>
      </div>
    </div>
  )
}

export default SignUp
