import { useEffect, useState } from 'react'
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
  placeholder = '',
  ariaLabel = '',
  children,
  propFile,
  editFile,
  register = false,
  uploadedFileLink = '',
  editLinkName,
}) => {
  const [file, setFile] = useState(propFile || null)
  const [editFileState, setEditFileState] = useState(false)

  useEffect(() => {
    if (show) setFile(propFile)
    setEditFileState(false)
  }, [show])

  useEffect(() => {
    if (register) editFile(file)
  }, [file])

  const handleFileSaveClick = () => {
    //if (file) {
    saveAction(file)
    setFile(null)
    handleClose()
    // } else {
    //   toast.error('Please select a file')
    // }
  }

  const selectedFileBoxStyle = {
    border: '1px solid gray',
    fontSize: 'small',
    width: '100%',
    padding: '0.375rem 0.75rem',
    borderRadius: '0.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.7rem',
    wordBreak: 'break-all',
  }

  const updateFile = async () => {
    // if(editFileState){

    // }else{

    // }
    await saveAction(editFileState)
    setEditFileState(false)
    handleClose()
  }

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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderBottom: '0',
          width: '100%',
        }}
      >
        {children}
        {action === 'confirm' ? (
          <p style={{ textAlign: 'center' }}>
            Are you sure you want to remove the user from the selected event?
          </p>
        ) : action === 'fileUpload' ? (
          <>
            <FormControl
              type="file"
              style={{ border: '1px solid gray', fontSize: 'small' }}
              onChange={e => setFile(e.target.files[0])}
            />
            {file ? (
              <div className="" style={selectedFileBoxStyle}>
                {file != null ? file.name : propFile?.name}
                <i className="fa-solid fa-xmark" onClick={() => setFile(null)}></i>
              </div>
            ) : null}
            {register && uploadedFileLink && file == null && !editFileState ? (
              <div className="" style={selectedFileBoxStyle}>
                {typeof uploadedFileLink == 'string'
                  ? uploadedFileLink?.substring(uploadedFileLink?.lastIndexOf('/') + 1)
                  : 'Uploaded File'}
                <i className="fa-solid fa-xmark" onClick={() => setEditFileState(true)}></i>
              </div>
            ) : null}
          </>
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
            if (register) editLinkName()
            setFile(null)
            cancelAction()
          }}
        >
          Cancel
        </button>
        <button
          className="btn"
          onClick={e => {
            action === 'confirm'
              ? saveAction(data)
              : action === 'fileUpload'
              ? register
                ? updateFile()
                : handleFileSaveClick()
              : saveAction()
          }}
        >
          {action === 'fileUpload' ? 'Save' : 'Confirm'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default CommonModal
