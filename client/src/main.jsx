import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import SmoothScrolling from './components/SmoothScrolling.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <BrowserRouter> 
        <SmoothScrolling>
          <App />
        </SmoothScrolling>
      </BrowserRouter>
    </Provider>
  // </StrictMode>
)
