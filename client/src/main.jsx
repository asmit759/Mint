import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SmoothScrolling from './components/SmoothScrolling.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SmoothScrolling>
      <App />
    </SmoothScrolling>
  </StrictMode>
)
