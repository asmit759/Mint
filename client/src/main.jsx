import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SmoothScrolling from './components/SmoothScrolling.jsx'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <StrictMode>
        <SmoothScrolling>
             <App />
        </SmoothScrolling>
      </StrictMode>
  </Provider>

)
