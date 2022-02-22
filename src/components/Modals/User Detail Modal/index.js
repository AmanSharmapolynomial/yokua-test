import React, { useEffect, useRef, useState } from 'react'
import '../style.css'

const UserDetailsModal = ({ change, data, saveAndExit }) => {
  // refs
  let emailRef = useRef()
  let nameRef = useRef()
  let roleRef = useRef()
  let contactRef = useRef()
  let address1Ref = useRef()
  let address2Ref = useRef()
  let stateRef = useRef()
  let pincodeRef = useRef()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [contact, setContact] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')

  console.log(data)
  useEffect(() => {
    if (data) {
      emailRef.current.value = data.email
      roleRef.current.value = data.role
      nameRef.current.value = data.first_name + ' ' + data.last_name
    }
    // contactRef.current.value = data.contact
    // emailRef.current.value = data.email
    // emailRef.current.value = data.email
    // stateRef.current.value = data.state
    // emailRef.current.value = data.email
    // emailRef.current.value = data.email
    // emailRef.current.value = data.email
    // setName(data.first_name + ' ' + data.last_name)
    // setEmail(data.email)
  }, [])

  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <i
          className="fa-solid fa-floppy-disk save-icon"
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
              <label className="input-label">Name</label>
              <input
                className="input-text"
                type="text"
                ref={nameRef}
                onChange={e => {
                  setName(e.value)
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
                  setEmail(e.value)
                }}
              />
            </div>
            <div className="input-field-container">
              <label className="input-label">Role</label>
              <select
                className="input-text"
                ref={roleRef}
                onChange={e => {
                  setRole(e.value)
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
                  setContact(e.value)
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
                    setAddress1(e.value)
                  }}
                />
                <input
                  className="input-text"
                  type="text"
                  ref={address2Ref}
                  onChange={e => {
                    setAddress2(e.value)
                  }}
                />
                <div className="state-and-code">
                  <input
                    className="input-text"
                    type="text"
                    placeholder="State"
                    ref={stateRef}
                    onChange={e => {
                      setState(e.value)
                    }}
                  />
                  <input
                    className="input-text"
                    type="text"
                    placeholder="PIN Code"
                    ref={pincodeRef}
                    onChange={e => {
                      setPincode(e.value)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal
