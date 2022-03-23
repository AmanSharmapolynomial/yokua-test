import React from 'react'

import { Modal } from 'react-bootstrap'

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
            borderBottom: '0',
          }}
        >
          <Modal.Title>Delete {req}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '0',
          }}
        >
          {title}
        </Modal.Body>
        <Modal.Footer
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderTop: '0',
          }}
          centered
        >
          <button
            id="mybtn"
            className="btn btn-background mr-4"
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
