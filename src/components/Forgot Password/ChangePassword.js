import React, { useRef } from 'react'
// import './style.css'

const ChnagePassword = () => {
  const passwordRef = useRef()
  const confirmPasswordRef = useRef()
  return (
    <>
      <div className="signIn-container">
        <h3 className="container__heading">Change Your Password?</h3>
        <form type="submit">
          <input
            type="text"
            className="input-field input-field__password"
            name="password"
            ref={passwordRef}
            placeholder="Password"
          />
          <input
            type="text"
            className="input-field input-field__password"
            name="confirm-password"
            ref={confirmPasswordRef}
            placeholder="Confirm Password"
          />

          <button type="submit" className="submit-btn">
            Save
          </button>
        </form>
      </div>
    </>
  )
}

export default ChnagePassword
