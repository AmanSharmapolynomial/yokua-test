import React, { useState } from 'react'

const CreateNewDomain = ({ saveAndExit, addDomain }) => {
  const [domain, setDomain] = useState()
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <h3 className="modal-heading">Create New Domain</h3>
        <div className="modal-content domain-modal">
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
          <div className="domain-modal-cta">
            <button
              className="btn "
              onClick={() => {
                if (domain) {
                  addDomain(domain)

                  saveAndExit()
                }
              }}
            >
              Confirm
            </button>
            <button
              className="btn cancel-domain"
              onClick={() => {
                saveAndExit()
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateNewDomain
