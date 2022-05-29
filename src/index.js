import React from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import App from './App'
import { createStore, StoreProvider } from 'easy-peasy'
import model from './model'
import { BrowserRouter as Router } from 'react-router-dom'
import { LoadingProvider } from './utils/LoadingContext'
import 'bootstrap/dist/css/bootstrap.css'

const store = createStore(model)

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <StoreProvider store={store}>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </StoreProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
