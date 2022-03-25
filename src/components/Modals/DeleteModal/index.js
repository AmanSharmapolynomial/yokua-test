import React from 'react'

const DeleteModal = ({ deleteConfirm, deleteCancel, deleteMessage, deleteTitle }) => {
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3 className="modal-heading">{deleteTitle}</h3>
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
            {deleteMessage}
          </div>
          <div className="domain-modal-cta">
            <button className="btn cancel-domain" onClick={deleteCancel}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={deleteConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
