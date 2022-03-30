import React, { Children, useState } from 'react'
import Header from './components/Header'
import Routing from './routes/Routes'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { getToken } from './utils/token'
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';
import 'bootstrap/dist/css/bootstrap.min.css'
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { BallTriangle, Rings, TailSpin } from 'react-loader-spinner'
import styled from 'styled-components'
import { useLoading } from './utils/LoadingContext'

const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: rgba(180, 180, 180, 0.5);
  z-index: 100;
`

function App() {
  const { loading } = useLoading()
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)

  return (
    <div className="container-fluid p-0 vh-100 m-0 d-flex flex-column">
      <Routing />
      {loading && (
        <LoaderContainer>
          <div style={{ position: 'absolute' }}>
            <TailSpin height="100" width="100" color="#004F9B" ariaLabel="loading" />
          </div>
        </LoaderContainer>
      )}
      <ToastContainer />
    </div>
  )
}

export default App
