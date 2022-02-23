import React, { useEffect, useRef, useState } from 'react'
import '../style.css'

const UserDetailsModal = ({ change, data, saveAndExit }) => {
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
  let alertRef = useRef()

  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [lastName, setLastName] = useState('')
  const [role, setRole] = useState('')
  const [contact, setContact] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  useEffect(() => {
    if (data && change == 'Edit') {
      emailRef.current.value = data.email
      firstNameRef.current.value = data.first_name
      lastNameRef.current.value = data.last_name
      roleRef.current.value = data.role
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setEmail(data.email)
      setRole(data.role)
    }
    setRole('User')
  }, [])

  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <i
          className="fa-solid fa-floppy-disk save-icon"
          style={{
            marginRight: '3rem',
          }}
          onClick={() => {
            if (email != '' && email && firstName && lastName) {
              const saveData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                role: role,
              }
              console.log(saveData)
              saveAndExit(saveData)
            } else {
              alertRef.current.style.display = 'block'
              setTimeout(() => {
                alertRef.current.style.display = 'none'
              }, 3000)
            }
          }}
        />
        <i
          className="fa-solid fa-remove save-icon"
          onClick={() => {
            saveAndExit()
          }}
        />
        <h3 className="modal-heading">{change} User Details</h3>
        <div className="modal-content">
          <div className="user-img">
            <img src="/logo512.png" />
          </div>
          <div className="user-details-form">
            <div className="input-field-container">
              <label className="input-label">First Name</label>
              <input
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
                className="input-text"
                type="text"
                ref={lastNameRef}
                onChange={e => {
                  setLastName(e.target.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label">E-mail id</label>
              <input
                className="input-text"
                type="email"
                ref={emailRef}
                onChange={e => {
                  setEmail(e.target.value)
                }}
              />
            </div>

            <div className="input-field-container">
              <label className="input-label">Role</label>
              <select
                className="input-text"
                ref={roleRef}
                onChange={e => {
                  setRole(e.target.value)
                }}
              >
                <option>User</option>
                <option>Content Manager</option>
                <option>PMK Administrator</option>
              </select>
            </div>
            <div className="input-field-container">
              <label className="input-label">Contact No</label>
              <input
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
                  className="input-text"
                  type="text"
                  ref={address1Ref}
                  onChange={e => {
                    setAddress1(e.target.value)
                  }}
                />
                <input
                  className="input-text"
                  type="text"
                  ref={address2Ref}
                  onChange={e => {
                    setAddress2(e.target.value)
                  }}
                />
                <div className="state-and-code">
                  <input
                    className="input-text"
                    type="text"
                    placeholder="State"
                    ref={stateRef}
                    onChange={e => {
                      setState(e.target.value)
                    }}
                  />
                  <input
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
            </div>
            <span className="alert-under-input" ref={alertRef} style={{ display: 'none' }}>
              Check Details
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal
