import React from 'react'
import Routing from './routes/Routes'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import { TailSpin } from 'react-loader-spinner'
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

  // CLOSE DROPDOWN ON SCROLL
  window.addEventListener('scroll', () => {
    const dropDownClasses = document.getElementsByClassName('dropdown-menu')
    for (let i = 0; i < dropDownClasses.length; i++) {
      if (dropDownClasses[i].classList.contains('show')) {
        dropDownClasses[i].classList.remove('show')
      }
    }
  })
  return (
    <div id="main" className="container-fluid d-flex flex-column p-0 m-0 flex-fill">
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
