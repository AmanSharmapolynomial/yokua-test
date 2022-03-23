import React from 'react'
import '../../components/Footer/style.css'

const Footer = () => {
  return (
    <div className="footer fixed-bottom">
      <div className="footerBtn">
        <button className="btn mr-2">Impressum</button>
        <button className="btn">Privacy Policy</button>
      </div>
    </div>
  )
}

export default Footer
