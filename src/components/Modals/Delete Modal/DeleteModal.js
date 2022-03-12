import React from 'react'

import { Button, Modal } from 'react-bootstrap'

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
              margin: '1.5rem 0',
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

// export default DeleteModal

function Example({ show, setShow, req, saveAndExit, runDelete, title, data }) {
  // const [show, setShow] = useState(false);

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Modal.Title>Delete {req}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {title}
        </Modal.Body>
        <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          centered
        >
          <button
            id="mybtn"
            className="btn btn-background"
            onClick={() => {
              saveAndExit()
              setShow(false)
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={() => {
              runDelete(data)
              saveAndExit()
              setShow(false)
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Example
