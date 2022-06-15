import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'

const CreateNewDomain = ({ saveAndExit, addDomain, show }) => {
  const [domain, setDomain] = useState('')
  return (
    <Modal centered show={show} className="modal-background">
      <Modal.Body>
        <div className="modal-wrapper">
          <p
            className="modal-heading text-bold h5"
            style={{
              marginBottom: 0,
            }}
          >
            Add new whitelist domain
          </p>
          <div
            className="modal-content domain-modal"
            style={{
              border: '0',
              margin: 0,
            }}
          >
            <div className="info-text w-100 mt-3">
              <input
                type="text"
                className="domain-input w-100 py-2 font-8"
                placeholder="Name"
                onChange={e => {
                  setDomain(e.target.value)
                }}
              />
            </div>
            <div className="domain-modal-cta mt-3">
              <button
                className="btn cancel-domain font-8"
                onClick={() => {
                  saveAndExit()
                }}
              >
                Cancel
              </button>
              <button
                className="btn font-8"
                onClick={() => {
                  if (domain) {
                    if (domain.includes('.')) {
                      addDomain(domain)
                      saveAndExit()
                    } else {
                      toast.error('Please enter a valid domain, e.g. yourdomain.xyz')
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
