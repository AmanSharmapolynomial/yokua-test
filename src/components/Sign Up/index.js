import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './style.css'
import { registerUser } from './../../services/auth.service'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Dropdown, InputGroup, FormControl, Button, Modal, Image } from 'react-bootstrap'

import API from '../../utils/api'

import validator from 'validator'

const SignUp = () => {
  // navigate
  const navigate = useNavigate()

  const [category, setCategory] = useState([])
  const [isTopicAdd, setIsTopicAdd] = useState(false)
  const [topicName, setTopicName] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Company')
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)
  // const registeredUser = useStoreState(state => state.registeredUser)
  // const config = {
  //   Authorization: `Bearer ${userDetails[0]?.data?.access_token}`,
  // }

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

  // actions import
  // const fetchRegister = useStoreActions(actions => actions.fetchRegister)
  const alertRef = useRef()
  const tncRef = useRef()

  // if () {
  //   alertRef.current.style.opacity = 1
  //   setTimeout(() => {
  //     alertRef.current.style.opacity = 0
  //   }, 5000)
  // }

  // console.log(registeredUser[registeredUser.length - 1])

  // fill data from form

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

  const AddNewCompany = () => {
    if (selectedTopic.length < 2) {
      toast.error('Please enter valid company name')
      setTopicName('')
      return
    }

    API.post('auth/add_company', {
      parent_company: topicName,
      child_company: '',
    })
      .then(data => {
        getCompanyList()
        setTopicName('')
      })
      .catch(error => {
        console.log(error)
      })
  }

  const handleSelectTopic = cat => {
    setCompany(cat.company_name)
    setSelectedTopic(cat.company_name)
  }

  const register = async e => {
    // setLoading(true)
    e.preventDefault()
    debugger
    if (selectedTopic.length < 2 || selectedTopic.toLowerCase() == 'company') {
      toast.error('Please select the company')
      return
    }
    if (tncRef.current.checked) {
      if (validator.isEmail(companyEmail)) {
        if (validator.isAlpha(firstName) && validator.isAlpha(lastName)) {
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
                } else {
                  // toast.error(a.data?.password1[0])

                  console.log(a.data)
                }
              })
              setLoading(false)
            }
          }
        } else {
          toast.error(
            'First name and last name should be atleast 5 letters and must not contain any special characters'
          )
        }
      } else {
        toast.error('Please enter a valid E-Mail e.g. abc@xyz.com')
      }
    } else {
      toast.error('Please accept terms and conditions to proceed')
    }
  }

  return (
    <div className="signIn-container mx-auto col-4">
      <div className="container-head">
        <h3 className="container__heading col w-100 text-align-center text-center">
          <i
            className="fa-solid fa-arrow-left back-arrow-btn float-left"
            onClick={() => {
              navigate('/auth/login')
            }}
          />
          Create a New Account
        </h3>
      </div>
      <form className="forum" type="submit" onSubmit={register}>
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
          className="input-field input-field__password"
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
        <input
          type={passwordVisible ? 'text' : 'password'}
          name="Password"
          className="input-field input-field__password"
          onChange={e => setPassword(e.target.value)}
          required={true}
          placeholder="Password"
        />

        <i
          className={
            passwordVisible ? 'fa-eye fa-solid first-signin' : 'fa-eye-slash fa-solid first-signin'
          }
          onClick={() => setPasswordVisible(!passwordVisible)}
        ></i>

        <input
          type={confirmPasswordVisible ? 'text' : 'password'}
          required={true}
          className="input-field input-field__password"
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />

        <i
          className={confirmPasswordVisible ? 'fa-solid fa-eye two' : 'fa-solid fa-eye-slash two'}
          onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        ></i>

        <span className="alert-under-input" ref={alertRef} style={{ display: 'none' }}>
          {actionLabel}
        </span>

        <Dropdown
          size="sm"
          autoClose={'outside'}
          className="yk-dropdown-holder input-field"
          style={{
            overflow: 'visible',
          }}
        >
          <Dropdown.Toggle
            size={'sm'}
            className="yg-custom-dropdown"
            color="red"
            id="dropdown-basic"
          >
            {selectedTopic}
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{ width: '80%', marginLeft: '124px', maxHeight: '14rem', overflowY: 'scroll' }}
          >
            {category.map((cat, index) => (
              <Dropdown.Item
                key={index}
                className="yg-font-size-r"
                onClick={() => handleSelectTopic(cat)}
              >
                {cat.company_name}
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            {!isTopicAdd && (
              <Dropdown.Item
                className="yg-font-size-r"
                onClick={() => {
                  setIsTopicAdd(true)
                }}
              >
                Others
              </Dropdown.Item>
            )}
            {isTopicAdd && (
              <InputGroup className="yg-font-size-registrtion p-1 ">
                <FormControl
                  className="yg-font-size"
                  placeholder="Company"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  value={topicName}
                  onChange={e => setTopicName(e.target.value)}
                />
                <Button
                  onClick={() => {
                    setIsTopicAdd(false)
                    AddNewCompany()
                  }}
                  variant="outline-secondary"
                  className="saveBtn"
                  id="button-addon2"
                >
                  Save
                </Button>
              </InputGroup>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <div className="checkbox">
          <input type="checkbox" id="checkTermandCondtions" ref={tncRef} />
          <span className="checkbox-text">Accept the term and conditions</span>
        </div>

        <button type="submit" className="submit-btn px-4">
          {isLoading ? 'Loading...' : 'Register'}
        </button>
      </form>
      <div className="terms">
        {'By signing up, you agree with the '}
        <Link to="/auth/terms-privacy" className="terms-link">
          Terms of Service and Privacy Policy
        </Link>
      </div>
    </div>
  )
}

export default SignUp
