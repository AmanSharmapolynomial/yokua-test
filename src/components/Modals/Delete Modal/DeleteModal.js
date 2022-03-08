import React from 'react'

const DeleteModal = ({ req, saveAndExit, runDelete, title, data }) => {
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3 className="modal-heading">Delete {req} </h3>
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
            {title}
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
                runDelete(data)
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

export default DeleteModal