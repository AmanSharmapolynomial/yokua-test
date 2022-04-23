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
    <Modal centered show={show} className="modal-background">
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
              : title
              ? title
              : 'Approval E-Mail change request'}
          </h3>
          <div
            className="modal-content domain-modal"
            style={{
              border: '0',
              margin: 0,
            }}
          >
            {change == 'Rejected' ? (
              <div className="info-text">
                <input
                  ref={inputRef}
                  type="text"
                  className="domain-input"
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
                {title ? title : 'The user will be change the E-Mail'}
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
