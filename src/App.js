import React, { Children } from 'react'

import Routing from './routes/Routes'
function App() {
  // fetch state
  // const userDetails = useStoreState(state => state.userDetails)

  return (
    <div className="App">
      <div className="non_header_content relative">
        <Routing />
      </div>
    </div>
  )
}

export default App
