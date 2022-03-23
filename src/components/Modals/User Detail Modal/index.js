import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import '../style.css'
import validator from 'validator'
import placeholder from '../../News Components/placeholder.png'

import Select from 'react-select'
const options = [
  { value: 'User', label: 'User' },
  { value: 'PMK Content Manager', label: 'PMK Content Manager' },
  { value: 'PMK Administrator', label: 'PMK Administrator' },
]

const UserDetailsModal = ({ change, data, saveAndExit, title }) => {
  const [profilePicture, setProfilePicture] = useState(
    data?.avatar_link ? data?.avatar_link : placeholder
  )
  // refs
  let emailRef = useRef()
  let firstNameRef = useRef()
  let lastNameRef = useRef()
  let roleRef = useRef()
  let contactRef = useRef()
  let address1Ref = useRef()
  let address2Ref = useRef()
  let stateRef = useRef()
  let pincodeRef = useRef()

  let companyRef = useRef()
  let passwordRef = useRef()

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [password, setPassword] = useState('')
  const [disabledInput, setDisabledInput] = useState(false)

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    if (change == 'View') {
      setDisabledInput(true)
    } else {
      setDisabledInput(false)
    }
    setRole('User')
    if ((data && change == 'Edit') || change == 'View') {
      emailRef.current.value = data.email
      firstNameRef.current.value = data.first_name
      lastNameRef.current.value = data.last_name
      // roleRef.current.value = data.role
      companyRef.current.value = data.company_name
      setEmail(data.email)
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setRole(data.role)
      setSelectedOption({
        value: data?.role ? data.role : 'User',
        label: data?.role ? data.role : 'User',
      })
      setCompany(data.company_name)
    }
  }, [])

  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        {change == 'View' && (
          <i
            className="fa-solid fa-remove save-icon"
            onClick={() => {
              saveAndExit()
              document.body.style.overflow = 'scroll'
            }}
          />
        )}
        <h3 className="modal-heading">{title}</h3>
        <div
          className="modal-content flex-row"
          style={{
            border: '0',
          }}
        >
          <div className="user-img">
            <img
              // className="profile-setting__info_img"
              // style={{
              //   cursor: 'pointer',
              // }}
              src={profilePicture}
              onError={() => setProfilePicture(placeholder)}
            />
          </div>
          <div className="user-details-form">
            <div className="input-field-container">
              <label className="input-label">First Name</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="text"
                ref={firstNameRef}
                onChange={e => {
                  setFirstName(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label">Last Name</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="text"
                ref={lastNameRef}
                onChange={e => {
                  setLastName(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label">Permission Level</label>

              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                style={{ width: '100px' }}
                className="yg-custom-dropdowns"
              />
            </div>

            <div className="input-field-container">
              <label className="input-label">E-Mail id</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="email"
                ref={emailRef}
                onChange={e => {
                  setEmail(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container yk-password-container">
              <label className="input-label">Password</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type={passwordVisible ? 'text' : 'password'}
                ref={passwordRef}
                onChange={e => {
                  setPassword(e.target.value)
                }}
              />

              <i
                className={
                  passwordVisible
                    ? 'fa-eye fa-solid yk-eye-icon '
                    : 'fa-eye-slash fa-solid yk-eye-icon '
                }
                onClick={() => setPasswordVisible(!passwordVisible)}
              ></i>
            </div>

            <div className="input-field-container">
              <label className="input-label">Company</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="text"
                ref={companyRef}
                onChange={e => {
                  setCompany(e.target.value)
                }}
              />
            </div>

            {/* <div className="input-field-container">
              <label className="input-label">Contact No</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="tel"
                ref={contactRef}
                onChange={e => {
                  setContact(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label address">Address</label>
              <div className="address-inputs">
                <input
                  disabled={disabledInput}
                  className="input-text"
                  type="text"
                  ref={address1Ref}
                  onChange={e => {
                    setAddress1(e.target.value)
                  }}
                />
                <input
                  disabled={disabledInput}
                  className="input-text"
                  type="text"
                  ref={address2Ref}
                  onChange={e => {
                    setAddress2(e.target.value)
                  }}
                />
                <div className="state-and-code">
                  <input
                    disabled={disabledInput}
                    className="input-text"
                    type="text"
                    placeholder="State"
                    ref={stateRef}
                    onChange={e => {
                      setState(e.target.value)
                    }}
                  />
                  <input
                    disabled={disabledInput}
                    className="input-text"
                    type="text"
                    placeholder="PIN Code"
                    ref={pincodeRef}
                    onChange={e => {
                      setPincode(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {change != 'View' && (
          <div className="domain-modal-cta">
            <button
              className="cancel-domain btn"
              onClick={() => {
                saveAndExit()
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={() => {
                if (selectedOption == null || selectedOption.value == null) {
                  toast.error('Please select the permission')
                  return
                }
                if (email != '' && email && firstName && lastName) {
                  const saveData = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    role: selectedOption.value,
                    company_name: company,
                  }
                  if (password && password.length > 1) {
                    saveData['password'] = password
                  }
                  if (saveData.firstName.length >= 4 && saveData.lastName.length >= 4) {
                    if (validator.isAlpha(firstName) && validator.isAlpha(lastName)) {
                      if (validator.isEmail(saveData.email)) {
                        saveAndExit(saveData)
                      } else toast.warning('Improper Email Format')
                    } else {
                      toast.error('First & Last Name should only contain letters')
                    }
                  } else {
                    toast.error('First & Last Name should be 5-50 chars')
                  }
                } else {
                  toast.error('Fill all Mandatory Fields')

                  if (!lastNameRef.current.value) {
                    lastNameRef.current.style.borderColor = 'red'
                  }
                  if (!firstNameRef.current.value) {
                    firstNameRef.current.style.borderColor = 'red'
                  }
                  if (!emailRef.current.value) {
                    emailRef.current.style.borderColor = 'red'
                  }
                  if (!passwordRef.current.value) {
                    passwordRef.current.style.borderColor = 'red'
                  }
                  if (!companyRef.current.value) {
                    companyRef.current.style.borderColor = 'red'
                  }

                  setTimeout(() => {
                    lastNameRef.current.style.borderColor = 'black'

                    firstNameRef.current.style.borderColor = 'black'

                    emailRef.current.style.borderColor = 'black'

                    passwordRef.current.style.borderColor = 'black'

                    companyRef.current.style.borderColor = 'black'
                  }, 5000)
                }
              }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDetailsModal
