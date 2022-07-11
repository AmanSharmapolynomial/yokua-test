import { Modal, FormControl } from 'react-bootstrap'
import { toast } from 'react-toastify'

const CommonModal = ({
  show,
  handleClose,
  modalTitle,
  action,
  data,
  handleDataChange,
  cancelAction,
  saveAction,
  placeholder,
  ariaLabel,
}) => {
  return (
    <Modal show={show} centered onHide={handleClose}>
      <Modal.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '0',
        }}
      >
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="pt-0"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '0',
          width: '100%',
        }}
      >
        {action === 'confirm' ? (
          <p style={{ textAlign: 'center' }}>
            Are you sure you want to remove the user from the selected event?
          </p>
        ) : (
          <FormControl
            style={{ fontSize: 'small' }}
            className="mt-2 mb-2 w-100"
            placeholder={placeholder}
            aria-label={ariaLabel}
            aria-describedby="basic-addon2"
            value={data}
            onChange={e => handleDataChange(e.target.value)}
          />
        )}
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
          className="btn btn-background me-4"
          onClick={() => {
            cancelAction()
          }}
        >
          Cancel
        </button>
        <button
          className="btn"
          onClick={() => {
            action === 'confirm' ? saveAction(data) : saveAction()
          }}
        >
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default CommonModal
