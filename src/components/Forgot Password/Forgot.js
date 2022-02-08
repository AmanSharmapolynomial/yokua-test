import React, { useRef } from 'react'
// import './style.css'

const Forgot = () => {
  const emailRef = useRef()
  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Forgot Your Password?</h3>
        <form type="submit">
          <input
            type="text"
            className="input-field input-field__email"
            name="email"
            ref={emailRef}
            placeholder="Email"
          />

          <button type="submit" className="submit-btn">
            Send Link
          </button>
        </form>
      </div>
    </>
  )
}

export default Forgot
