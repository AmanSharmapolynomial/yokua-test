import React, { useState } from 'react'

const AcceptRejectModal = ({
  change,
  saveAndExit,
  setRejectMsg,
  rejectionData,
  rejectSingleRequest,
  acceptSingleRequest,
  acceptData,
}) => {
  const [msg, setMsg] = useState(null)

  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3
          className="modal-heading"
          style={{
            marginBottom: 0,
          }}
        >
          {change == 'Rejected' ? 'Request Denied' : 'Approval E-Mail change request'}
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
              The user will be change the E-Mail
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
                  setRejectMsg(msg)
                  rejectSingleRequest(rejectionData)
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
                  // document.body.style.overflow = 'scroll'
                }}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AcceptRejectModal
