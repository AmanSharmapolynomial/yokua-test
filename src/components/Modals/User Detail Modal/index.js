import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import '../style.css'
import validator from 'validator'
import placeholder from '../../News Components/placeholder.png'

import Select from 'react-select'

import close from '../../../assets/close_black.png'

const options = [
  { value: 'User', label: 'User' },
  { value: 'PMK Content Manager', label: 'PMK Content Manager' },
  { value: 'PMK Administrator', label: 'PMK Administrator' },
]

const UserDetailsModal = ({ change, data, saveAndExit, title }) => {
  const imageFileInputRef = useRef()
  const [imageFile, SetImageFile] = useState(data?.avatar_link ? data?.avatar_link : placeholder)

  const [profilePicture, setProfilePicture] = useState(
    data?.avatar_link ? data?.avatar_link : placeholder
  )
  // refs
  let emailRef = useRef()
  let firstNameRef = useRef()
  let lastNameRef = useRef()

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
  const [selectedOption, setSelectedOption] = useState({
    value: data?.role ? data.role : 'User',
    label: data?.role ? data.role : 'User',
  })

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
      setCompany(data.company_name)
      setProfilePicture(() => data.avatar_link)
    }
  }, [])

  const _setImage = () => {
    if (imageFile && imageFile != '') {
      if (typeof imageFile == 'string') {
        setProfilePicture(imageFile)
      } else {
        setProfilePicture(window.URL.createObjectURL(imageFile))
      }
    }
  }

  useEffect(() => {
    _setImage()
  }, [imageFile])

  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        {change == 'View' && (
          <img
            className="save-icon"
            src={close}
            onClick={() => {
              saveAndExit()
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
            <input
              type="file"
              accept="image/png, image/gif, image/jpeg"
              id="imageFile"
              ref={imageFileInputRef}
              className="inputfile yk-icon-hover"
              onChange={e => {
                console.log(e.target.files[0])
                SetImageFile(e.target.files[0])
              }}
            />
            <img
              key={data?.id}
              style={{
                cursor: !disabledInput ? 'pointer' : 'default',
              }}
              onClick={() => {
                !disabledInput && imageFileInputRef.current.click()
              }}
              src={profilePicture}
              onError={() => setProfilePicture(placeholder)}
            />
          </div>
          <div className="user-details-form">
            <div className="input-field-container">
              <label className="input-label font-weight-bold">First Name</label>
              <input
                autoCapitalize="words"
                disabled={disabledInput}
                className="input-text"
                type="text"
                style={{
                  textTransform: 'capitalize',
                }}
                ref={firstNameRef}
                onChange={e => {
                  setFirstName(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label font-weight-bold">Last Name</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="text"
                style={{
                  textTransform: 'capitalize',
                }}
                ref={lastNameRef}
                onChange={e => {
                  setLastName(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label font-weight-bold">Permission Level</label>
              {!disabledInput ? (
                <Select
                  defaultValue={selectedOption}
                  onChange={setSelectedOption}
                  options={options}
                  style={{ width: '100px' }}
                  className="yg-custom-dropdowns"
                />
              ) : (
                <input
                  disabled={disabledInput}
                  className="input-text"
                  type="text"
                  defaultValue={selectedOption?.value}
                />
              )}
            </div>

            <div className="input-field-container">
              <label className="input-label font-weight-bold">E-Mail</label>
              <input
                disabled={disabledInput}
                className="input-text"
                type="email"
                style={{
                  textTransform: 'lowercase',
                }}
                ref={emailRef}
                onChange={e => {
                  setEmail(e.target.value.toLocaleLowerCase())
                }}
              />
            </div>
            {title !== 'View user detail' && (
              <div className="input-field-container yk-password-container">
                <label className="input-label font-weight-bold">Password</label>
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
                />
              </div>
            )}

            <div className="input-field-container">
              <label className="input-label font-weight-bold">Company</label>
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
          </div>
        </div>
        {change !== 'View' && (
          <div className="domain-modal-cta">
            <button
              className="cancel-domain btn col-6 text-center"
              onClick={() => {
                saveAndExit()
              }}
            >
              Cancel
            </button>
            <button
              className="btn col-6 text-center"
              onClick={() => {
                if (selectedOption == null || selectedOption.value == null) {
                  toast.error('Please select the permission')
                  return
                }
                if (email !== '' && email && firstName && lastName) {
                  const saveData = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    role: selectedOption.value,
                    company_name: company,
                    imageFile: imageFile !== placeholder ? imageFile : null,
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
