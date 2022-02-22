import React, { Children } from 'react'
import Header from './components/Header'

import Routing from './routes/Routes'
function App() {
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)

  return (
    <div className="App">
      <Routing />
    </div>
  )
}

export default App
