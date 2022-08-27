import React from 'react'
import './404.css'
import { getToken, getUserRoles } from '../../utils/token'
import Header from '../../components/Header'
import PageNotFoundImage from '../../assets/404.png'

const PageNotFound = () => {
  return (
    <>
      <Header
        isLogedIn={getToken()}
        isAdmin={
          getUserRoles() == 'Technical Administrator' || getUserRoles() == 'PMK Administrator'
        }
      />
      <div className="page-not-found">
        <img src={PageNotFoundImage} alt="Page Not Found" />
      </div>
    </>
  )
}

export default PageNotFound
