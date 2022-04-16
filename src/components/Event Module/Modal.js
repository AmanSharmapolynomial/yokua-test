import React from 'react'
import './style.css'
import Modal from 'react-modal'
import { toast } from 'react-toastify'
const MyModel = props => {
  console.log(props)
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '32%',
    },
  }
  return (
    <div>
      <div style={{ position: 'relative' }}>
        <i
          className="fa-solid fa-xmark"
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            padding: '3px 5px',
            borderRadius: '50%',
            background: '#cd0000',
            color: '#fff',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
          onClick={() => props.closeModal()}
        ></i>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {props.title}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
          className="row"
        >
          <input
            style={{
              borderRadius: '3px',
              width: '75%',
            }}
            type="text"
            maxLength="255"
            placeholder={props.placeholder}
            onChange={e => {
              props.setMessage(e.target.value)
            }}
            className="form-control"
            required
            value={props.value}
          />
        </div>
        <br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            style={{
              background: 'white',
              color: 'rgb(0, 79, 155)',
              border: '1px solid black',
              borderRadius: '3px',
            }}
            onClick={() => {
              if (typeof props.onCancel === 'function') {
                props.onCancel()
              }
              props.closeModal()
            }}
          >
            Cancel
          </button>
          &nbsp;&nbsp;
          <button
            onClick={() => {
              if (typeof props.validation === 'function') {
                const validationResult = props.validation(props.message)
                if (validationResult) {
                  props.handleSendButton()
                  return
                }
                toast.error('URL is not valid')
                return
              }
              props.handleSendButton()
            }}
            style={{
              background: 'rgb(0, 79, 155)',
              color: 'white',
              border: '1px solid black',
              borderRadius: '3px',
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyModel
