import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from './store/store';  // ✅ Corrected path if your store file is in /store
import App from './App.jsx';
import SmoothScrolling from './components/SmoothScrolling.jsx';
import './index.css';

// 🚀 Mount React App
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <SmoothScrolling>
        <App />
      </SmoothScrolling>
    </BrowserRouter>
  </Provider>
);
