import React, { useState, useRef } from 'react'
import { Modal } from 'react-bootstrap'

const AcceptRejectModal = ({
  title,
  change,
  saveAndExit,
  rejectionData,
  rejectSingleRequest,
  acceptSingleRequest,
  acceptData,
  show,
}) => {
  const [msg, setMsg] = useState(null)
  const inputRef = useRef(null)
  return (
    <Modal centered show={show} className="modal-background" dialogClassName="max-width-40">
      <Modal.Body>
        <div className="modal-wrapper">
          <h3
            className="modal-heading"
            style={{
              marginBottom: 0,
            }}
          >
            {change == 'Rejected'
              ? 'Request Denied'
              : title === 'New User Registration'
              ? 'Confirm user registration request'
              : 'Confirm E-mail change request'}
          </h3>
          <div
            className="modal-content domain-modal"
            style={{
              border: '0',
              margin: 0,
            }}
          >
            {change == 'Rejected' ? (
              <div className="info-text w-100">
                <input
                  ref={inputRef}
                  type="text"
                  className="domain-input w-100 my-3"
                  placeholder="maximun 255 character support"
                  onChange={e => setMsg(e.target.value)}
                />
              </div>
            ) : (
              <span
                style={{
                  padding: '1rem',
                }}
              >
                {title === 'New User Registration'
                  ? 'On confirmation new user will be registered'
                  : 'On confirmation E-mail of the user will be changed'}
              </span>
            )}
            {change == 'Rejected' ? (
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
                    rejectSingleRequest(rejectionData, inputRef.current.value)
                    saveAndExit()
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : (
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
                    acceptSingleRequest(acceptData)
                    saveAndExit()
                    document.body.style.overflow = 'auto'
                  }}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AcceptRejectModal
