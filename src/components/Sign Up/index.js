import { useStoreActions, useStoreState } from 'easy-peasy'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import './style.css'
import { registerUser } from './../../services/auth.service'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { Dropdown, InputGroup, FormControl, Button, Modal, Image } from 'react-bootstrap'

import CustomDropdown from './CustomDropdown'

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
    setCompany(cat)
    setSelectedTopic(cat)
  }

  const register = async e => {
    // setLoading(true)
    e.preventDefault()
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

  const getSelectedCompany = name => {
    handleSelectTopic(name)
  }

  return (
    <div className="signIn-container mx-auto col-10 col-md-4 my-5">
      <div className="container-head">
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
        <div className="row">
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
          <div className="row align-items-center input-field mx-auto">
            <span className="flex-fill">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="Password"
                className="input-field__password"
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
          <div className="row align-items-center input-field mx-auto">
            <span className="flex-fill">
              <input
                type={confirmPasswordVisible ? 'text' : 'password'}
                required={true}
                className="input-field__password"
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
          {/* <Dropdown
            size="sm"
            autoClose={'outside'}
            className="yk-dropdown-holder input-field"
            style={{
              flexDirection: 'row',
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

            <Dropdown.Menu style={{ width: '80%', maxHeight: '14rem', overflowY: 'scroll' }}>
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
          <div className="col-12">
            <div className="row text-center d-flex justify-content-center align-items-center">
              <span>
                <input type="checkbox" id="checkTermandCondtions" ref={tncRef} />
              </span>
              <span className="checkbox-text mr-auto ml-2">Accept the term and conditions</span>
            </div>
          </Dropdown> */}
          <div className="col-12 p-0">
            <div className="form-group">
              <input type="checkbox" id="checkTermandCondtions" ref={tncRef} className="w-auto" />
              <span className="checkbox-text mr-auto ml-2">
                Accept the Terms of Service and Privacy Policies
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn px-4 mx-auto">
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </div>
      </form>
      <div className="terms">
        {'By signing up, you agree with the '}
        <Link to="/auth/terms-privacy" className="terms-link" target="_blank">
          Terms of Service and Privacy Policies
        </Link>
      </div>
    </div>
  )
}

export default SignUp
