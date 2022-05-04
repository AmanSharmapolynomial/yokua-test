import React from 'react'
import { useNavigate } from 'react-router'
import '../../components/Footer/style.css'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="container-fluid footer mt-auto">
      <div className="footerBtn">
        <button
          className="btn me-2"
          onClick={() => {
            navigate('/impressum')
          }}
        >
          Impressum
        </button>
        <button
          className="btn"
          onClick={() => {
            navigate('/privacy-policy')
          }}
        >
          Privacy Policy
        </button>
      </div>
    </footer>
  )
}

export default Footer
