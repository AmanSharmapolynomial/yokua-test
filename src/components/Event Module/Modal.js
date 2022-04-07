import React from 'react'
import './style.css'
import Modal from 'react-modal'
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
      <div>
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
              props.closeModal()
            }}
          >
            Cancel
          </button>
          &nbsp;&nbsp;
          <button
            onClick={() => {
              props.handleSendButton()
            }}
            style={{
              background: 'rgb(0, 79, 155)',
              color: 'white',
              border: '1px solid black',
              borderRadius: '3px',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default MyModel
