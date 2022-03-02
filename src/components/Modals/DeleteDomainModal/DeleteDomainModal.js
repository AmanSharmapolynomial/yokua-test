import React from 'react'

const DeleteDomainModal = ({ saveAndExit, deleteDomain, data }) => {
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3 className="modal-heading">Delete {data.domain}</h3>
        <div className="modal-content domain-modal">
          <div
            className="info-text"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              margin: '2rem 0',
              color: 'var(--textColor2)',
              textAlign: 'center',
            }}
          >
            The domain will delete permanent & user data will move into Nonwhitelisted.com
          </div>
          <div className="domain-modal-cta">
            <button
              className="btn cancel-domain"
              onClick={() => {
                saveAndExit()
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={() => {
                const payload = {
                  id: data.id,
                  associated_users: 'true',
                }
                deleteDomain(payload)
                saveAndExit()
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteDomainModal
