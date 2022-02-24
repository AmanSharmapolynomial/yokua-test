import React, { useState } from 'react'

const CreateNewDomain = ({ saveAndExit, addDomain }) => {
  const [domain, setDomain] = useState()
  return (
    <div className="modal-background">
      <div className="modal-wrapper">
        <i
          className="fa-solid fa-circle-xmark"
          onClick={() => {
            saveAndExit()
          }}
        />
        <h3 className="modal-heading">Add New Domnai</h3>
        <div className="modal-content">
          <div className="info-text">
            <input
              type="text"
              onChange={e => {
                setDomain(e.target.value)
              }}
            />
          </div>
          <button
            className="action-link"
            onClick={() => {
              if (domain) {
                addDomain(domain)

                saveAndExit()
              }
            }}
          >
            Add Domain
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateNewDomain
