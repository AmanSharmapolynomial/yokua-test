import React, { useState } from 'react'

const AcceptRejectModal = ({
  change,
  saveAndExit,
  setRejectMsg,
  rejectionData,
  rejectSingleRequest,
}) => {
  const [msg, setMsg] = useState(null)
  if (change == 'Accepted') {
    setTimeout(() => {
      saveAndExit()
    }, 3000)
  }
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3 className="modal-heading">Request {change}</h3>
        <div className="modal-content">
          {change == 'Rejected' && (
            <div className="info-text">
              <input
                type="text"
                placeholder="Reason to reject"
                onChange={e => setMsg(e.target.value)}
              />
            </div>
          )}
          {change == 'Rejected' ? (
            <div className="cta-links">
              <button
                className="action-link btn"
                onClick={() => {
                  saveAndExit()
                }}
              >
                Cancel
              </button>
              <button
                className="action-link btn"
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
            <i
              className="fa-solid fa-check"
              style={{
                fontSize: '3rem',
                backgroundColor: 'green',
                borderRadius: '100%',
                color: 'white',
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AcceptRejectModal
