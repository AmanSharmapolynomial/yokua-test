import React, { Children } from 'react'
import Header from './components/Header'
import Routing from './routes/Routes'
import { ToastContainer, toast } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)

  return (
    <div className="App">
      <Routing />
      <ToastContainer />
    </div>
  )
}

export default App
