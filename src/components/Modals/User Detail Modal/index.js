import React, { useRef } from 'react'
import '../style.css'

const UserDetailsModal = ({ change, data, saveAndExit }) => {
  // refs
  const nameRef = useRef()
  const emailRef = useRef()
  const roleRef = useRef()
  const contactRef = useRef()
  const address1Ref = useRef()
  const address2Ref = useRef()
  const stateRef = useRef()
  const pincodeRef = useRef()

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
              <input className="input-text" type="text" ref={nameRef} />
            </div>
            <div className="input-field-container">
              <label className="input-label">E-mail id</label>
              <input className="input-text" type="email" ref={emailRef} />
            </div>
            <div className="input-field-container">
              <label className="input-label">Role</label>
              <select className="input-text" ref={roleRef}>
                <option>User</option>
                <option>Content Manager</option>
                <option>PMK Administrator</option>
              </select>
            </div>
            <div className="input-field-container">
              <label className="input-label">Contact No</label>
              <input className="input-text" type="tel" ref={contactRef} />
            </div>
            <div className="input-field-container">
              <label className="input-label address">Address</label>
              <div className="address-inputs">
                <input className="input-text" type="text" ref={address1Ref} />
                <input className="input-text" type="text" ref={address2Ref} />
                <div className="state-and-code">
                  <input className="input-text" type="text" placeholder="State" ref={stateRef} />
                  <input
                    className="input-text"
                    type="text"
                    placeholder="PIN Code"
                    ref={pincodeRef}
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
