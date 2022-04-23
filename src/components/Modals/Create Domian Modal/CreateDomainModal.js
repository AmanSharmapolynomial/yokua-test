import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'

const CreateNewDomain = ({ saveAndExit, addDomain, show }) => {
  const [domain, setDomain] = useState('')
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
            Add new whitelist domain
          </h3>
          <div
            className="modal-content domain-modal"
            style={{
              border: '0',
              margin: 0,
            }}
          >
            <div className="info-text">
              <input
                type="text"
                className="domain-input"
                placeholder="Name"
                onChange={e => {
                  setDomain(e.target.value)
                }}
              />
            </div>
            <div className="domain-modal-cta mt-3">
              <button
                className="btn cancel-domain"
                onClick={() => {
                  saveAndExit()
                }}
              >
                Cancel
              </button>
              <button
                className="btn mr-4"
                onClick={() => {
                  if (domain) {
                    if (domain.includes('.')) {
                      addDomain(domain)
                      saveAndExit()
                    } else {
                      toast.error('Enter Domain in format - yourdomain.xyz')
                    }
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CreateNewDomain
