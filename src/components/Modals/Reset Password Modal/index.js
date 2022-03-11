import React, { useRef } from 'react'
import '../style.css'

const ResetPasswordModal = ({ change, data, saveAndExit }) => {
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
          className="fa-solid fa-circle-xmark"
          onClick={() => {
            saveAndExit()
          }}
        />
        <h3 className="modal-heading">{change}</h3>
        <div className="modal-content">
          <div className="info-text">
            <p>Please check your E-Mail</p>
          </div>
          <a className="action-link">Resend Link</a>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordModal
