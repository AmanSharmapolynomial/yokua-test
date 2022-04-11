import React from 'react'

const DeleteDomainModal = ({ saveAndExit, deleteDomain, data }) => {
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3
          className="modal-heading mt-4"
          style={{
            marginBottom: 0,
          }}
        >
          Delete whitelisted.com{data.domain}
        </h3>
        <div
          className="modal-content domain-modal"
          style={{
            border: '0',
            margin: 0,
          }}
        >
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
            The domain will deleted permanently from the whitelisted section.<br></br> Remaining
            user data will moved into UNK
          </div>
          <div className="domain-modal-cta mt-3">
            <button
              className="btn cancel-domain mr-4"
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
